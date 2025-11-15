/**
 * OCR API Service
 * 百度 OCR API 集成
 * User Story 3: 拍照识别账单
 * 遵循 Constitution Principle II (Code Quality - Service Separation)
 */

import * as FileSystem from 'expo-file-system';

// 百度 OCR API 配置（从环境变量读取）
const BAIDU_API_KEY = process.env.EXPO_PUBLIC_BAIDU_API_KEY || '';
const BAIDU_SECRET_KEY = process.env.EXPO_PUBLIC_BAIDU_SECRET_KEY || '';
const TOKEN_CACHE_KEY = 'baidu_access_token';
const TOKEN_CACHE_EXPIRY_KEY = 'baidu_token_expiry';

interface BaiduAccessTokenResponse {
  access_token: string;
  expires_in: number;
}

interface BaiduOCRResponse {
  words_result: Array<{
    words: string;
  }>;
  words_result_num: number;
}

export interface OCRResult {
  rawText: string;
  amount?: number;
  merchant?: string;
  date?: string;
  confidence: number;
}

/**
 * 获取百度 Access Token（带缓存）
 */
export async function getBaiduAccessToken(): Promise<string> {
  // 检查缓存
  try {
    const cachedToken = await AsyncStorage.getItem(TOKEN_CACHE_KEY);
    const cachedExpiry = await AsyncStorage.getItem(TOKEN_CACHE_EXPIRY_KEY);

    if (cachedToken && cachedExpiry) {
      const expiryTime = parseInt(cachedExpiry, 10);
      const now = Date.now();

      // 如果 token 未过期（提前 5 分钟刷新）
      if (expiryTime - now > 5 * 60 * 1000) {
        return cachedToken;
      }
    }
  } catch (error) {
    console.warn('Failed to read cached token:', error);
  }

  // 获取新 token
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;

  try {
    const response = await fetch(tokenUrl, { method: 'POST' });
    const data: BaiduAccessTokenResponse = await response.json();

    if (!data.access_token) {
      throw new Error('Failed to get access token');
    }

    // 缓存 token
    const expiryTime = Date.now() + data.expires_in * 1000;
    await AsyncStorage.setItem(TOKEN_CACHE_KEY, data.access_token);
    await AsyncStorage.setItem(TOKEN_CACHE_EXPIRY_KEY, expiryTime.toString());

    return data.access_token;
  } catch (error) {
    console.error('Failed to get Baidu access token:', error);
    throw new Error('获取 OCR 服务认证失败');
  }
}

/**
 * 将图片文件转为 Base64
 */
async function imageToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw new Error('图片读取失败');
  }
}

/**
 * 从 OCR 文本中提取金额
 */
function extractAmount(text: string): number | undefined {
  // 匹配金额模式：
  // 1. ¥123.45 或 ￥123.45
  // 2. 金额：123.45 或 小计：123.45
  // 3. 纯数字 123.45（优先级最低）
  const patterns = [
    /[¥￥]\s*(\d+\.?\d*)/,
    /(?:金额|小计|合计|总计)[：:]\s*(\d+\.?\d*)/,
    /(\d+\.\d{2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1]);
      if (amount > 0 && amount <= 1000000) {
        return amount;
      }
    }
  }

  return undefined;
}

/**
 * 从 OCR 文本中提取商家名称
 */
function extractMerchant(text: string): string | undefined {
  // 简单规则：取第一行非数字文本作为商家名称
  const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

  for (const line of lines) {
    // 跳过包含大量数字或符号的行
    if (!/\d{4,}|[¥￥：:]/g.test(line) && line.length >= 2 && line.length <= 50) {
      return line;
    }
  }

  return undefined;
}

/**
 * 从 OCR 文本中提取日期
 */
function extractDate(text: string): string | undefined {
  // 匹配日期模式：YYYY-MM-DD 或 YYYY/MM/DD 或 YYYY.MM.DD
  const patterns = [
    /(\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2})/,
    /(\d{4}年\d{1,2}月\d{1,2}日)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * 识别小票图片（百度通用文字识别 API）
 */
export async function recognizeReceipt(imageUri: string): Promise<OCRResult> {
  try {
    // 获取 Access Token
    const accessToken = await getBaiduAccessToken();

    // 转换图片为 Base64
    const base64Image = await imageToBase64(imageUri);

    // 调用百度 OCR API
    const ocrUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`;

    const response = await fetch(ocrUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `image=${encodeURIComponent(base64Image)}`,
    });

    const data: BaiduOCRResponse = await response.json();

    if (!data.words_result || data.words_result.length === 0) {
      throw new Error('未识别到文字');
    }

    // 拼接所有识别文本
    const rawText = data.words_result.map((item) => item.words).join('\n');

    // 提取结构化信息
    const amount = extractAmount(rawText);
    const merchant = extractMerchant(rawText);
    const date = extractDate(rawText);

    // 计算置信度（简单规则）
    let confidence = 0.5;
    if (amount) confidence += 0.3;
    if (merchant) confidence += 0.1;
    if (date) confidence += 0.1;

    return {
      rawText,
      amount,
      merchant,
      date,
      confidence,
    };
  } catch (error) {
    console.error('OCR recognition failed:', error);
    throw error;
  }
}

/**
 * 检查 OCR 服务是否可用
 */
export async function isOCRAvailable(): Promise<boolean> {
  if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
    return false;
  }

  try {
    await getBaiduAccessToken();
    return true;
  } catch {
    return false;
  }
}

// 需要导入 AsyncStorage（之前遗漏）
import AsyncStorage from '@react-native-async-storage/async-storage';
