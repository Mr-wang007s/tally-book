/**
 * Voice Recognition API Service
 * 语音识别服务 (基于 Expo Speech Recognition)
 */

import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * 麦克风权限状态
 */
export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

/**
 * 语音识别结果
 */
export interface RecognitionResult {
  text: string; // 识别的文本
  confidence: number; // 置信度 (0-1)
  isFinal: boolean; // 是否是最终结果
}

/**
 * 语音识别错误
 */
export class VoiceRecognitionError extends Error {
  constructor(
    message: string,
    public code: 'PERMISSION_DENIED' | 'NOT_AVAILABLE' | 'NETWORK_ERROR' | 'TIMEOUT' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'VoiceRecognitionError';
  }
}

/**
 * 请求麦克风权限
 * @returns 权限状态
 */
export async function requestMicrophonePermission(): Promise<PermissionStatus> {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    
    if (status === 'granted') {
      return PermissionStatus.GRANTED;
    } else if (status === 'denied') {
      return PermissionStatus.DENIED;
    }
    
    return PermissionStatus.UNDETERMINED;
  } catch (error) {
    console.error('Failed to request microphone permission:', error);
    return PermissionStatus.DENIED;
  }
}

/**
 * 检查麦克风权限状态
 * @returns 权限状态
 */
export async function checkMicrophonePermission(): Promise<PermissionStatus> {
  try {
    const { status } = await Audio.getPermissionsAsync();
    
    if (status === 'granted') {
      return PermissionStatus.GRANTED;
    } else if (status === 'denied') {
      return PermissionStatus.DENIED;
    }
    
    return PermissionStatus.UNDETERMINED;
  } catch (error) {
    console.error('Failed to check microphone permission:', error);
    return PermissionStatus.UNDETERMINED;
  }
}

/**
 * 检查语音识别是否可用
 * @returns 是否可用
 */
export function isVoiceRecognitionAvailable(): boolean {
  // Expo Speech 在 iOS 和 Android 上都可用
  // Web 平台需要浏览器支持 Web Speech API
  if (Platform.OS === 'web') {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
  
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * 录音会话
 */
class RecordingSession {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  /**
   * 开始录音
   */
  async start(): Promise<void> {
    if (this.isRecording) {
      throw new VoiceRecognitionError('Already recording', 'UNKNOWN');
    }

    try {
      // 设置音频模式
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 创建录音实例
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new VoiceRecognitionError('Failed to start recording', 'UNKNOWN');
    }
  }

  /**
   * 停止录音
   * @returns 录音文件 URI
   */
  async stop(): Promise<string | null> {
    if (!this.isRecording || !this.recording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.isRecording = false;
      this.recording = null;
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw new VoiceRecognitionError('Failed to stop recording', 'UNKNOWN');
    }
  }

  /**
   * 取消录音
   */
  async cancel(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Failed to cancel recording:', error);
      }
      this.isRecording = false;
      this.recording = null;
    }
  }

  /**
   * 获取录音状态
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }
}

// 单例录音会话
let recordingSession: RecordingSession | null = null;

/**
 * 开始录音
 */
export async function startRecording(): Promise<void> {
  // 检查权限
  const permission = await checkMicrophonePermission();
  if (permission !== PermissionStatus.GRANTED) {
    const newPermission = await requestMicrophonePermission();
    if (newPermission !== PermissionStatus.GRANTED) {
      throw new VoiceRecognitionError('Microphone permission denied', 'PERMISSION_DENIED');
    }
  }

  // 检查是否可用
  if (!isVoiceRecognitionAvailable()) {
    throw new VoiceRecognitionError('Voice recognition not available', 'NOT_AVAILABLE');
  }

  // 创建或重用录音会话
  if (!recordingSession) {
    recordingSession = new RecordingSession();
  }

  await recordingSession.start();
}

/**
 * 停止录音并识别语音
 * @returns 识别结果
 */
export async function stopRecording(): Promise<RecognitionResult> {
  if (!recordingSession || !recordingSession.getIsRecording()) {
    throw new VoiceRecognitionError('No active recording', 'UNKNOWN');
  }

  const uri = await recordingSession.stop();
  
  if (!uri) {
    throw new VoiceRecognitionError('Failed to get recording URI', 'UNKNOWN');
  }

  // 调用语音识别 API
  // 注意: Expo Speech 主要用于文本转语音 (TTS)
  // 语音识别 (STT) 需要使用第三方 API 或原生模块
  // 这里我们使用模拟实现，实际项目中需要集成百度语音 API 或其他服务
  
  return recognizeSpeech(uri);
}

/**
 * 取消录音
 */
export async function cancelRecording(): Promise<void> {
  if (recordingSession) {
    await recordingSession.cancel();
  }
}

/**
 * 识别语音 (模拟实现)
 * @param audioUri 音频文件 URI
 * @returns 识别结果
 * 
 * 实际项目中应该调用百度语音识别 API 或其他第三方服务
 */
async function recognizeSpeech(audioUri: string): Promise<RecognitionResult> {
  // TODO: 集成百度语音识别 API
  // 1. 读取音频文件
  // 2. 上传到百度语音识别 API
  // 3. 获取识别结果
  // 4. 返回格式化的结果
  
  // 模拟 API 调用延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // 模拟识别结果 (实际项目中替换为真实 API 调用)
  const mockResults = [
    { text: '早餐面包牛奶15块', confidence: 0.95 },
    { text: '午餐花了50元', confidence: 0.92 },
    { text: '打车30元', confidence: 0.88 },
    { text: '超市买菜100块', confidence: 0.90 },
  ];
  
  const result = mockResults[Math.floor(Math.random() * mockResults.length)];
  
  return {
    ...result,
    isFinal: true,
  };
}

/**
 * 语音转文本 (使用百度语音识别 API)
 * @param audioUri 音频文件 URI
 * @param apiKey 百度 API Key
 * @param secretKey 百度 Secret Key
 * @returns 识别结果
 */
export async function recognizeSpeechWithBaidu(
  audioUri: string,
  apiKey: string,
  secretKey: string
): Promise<RecognitionResult> {
  try {
    // 1. 获取 Access Token
    const tokenResponse = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
      { method: 'POST' }
    );
    
    if (!tokenResponse.ok) {
      throw new VoiceRecognitionError('Failed to get access token', 'NETWORK_ERROR');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // 2. 读取音频文件
    // 注意: 实际实现需要使用 expo-file-system 读取文件并转换为 Base64
    // const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });
    
    // 3. 调用语音识别 API
    // const response = await fetch(
    //   `https://vop.baidu.com/server_api?cuid=my-tally-book&token=${accessToken}`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       format: 'wav',
    //       rate: 16000,
    //       channel: 1,
    //       speech: audioBase64,
    //       len: audioBase64.length,
    //     }),
    //   }
    // );
    
    // 模拟返回
    return {
      text: '早餐面包牛奶15块',
      confidence: 0.95,
      isFinal: true,
    };
  } catch (error) {
    console.error('Speech recognition failed:', error);
    throw new VoiceRecognitionError('Speech recognition failed', 'NETWORK_ERROR');
  }
}
