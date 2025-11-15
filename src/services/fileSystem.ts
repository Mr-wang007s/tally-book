/**
 * File System Service
 * 照片存储管理服务
 * 用于保存和管理 OCR 拍照的账单照片
 */

import * as FileSystem from 'expo-file-system';

// 照片存储目录
const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

/**
 * 初始化照片存储目录
 */
export async function initPhotoStorage(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
  } catch (error) {
    console.error('Failed to initialize photo storage:', error);
    throw error;
  }
}

/**
 * 保存照片文件
 * @param sourceUri 照片源 URI (来自相机或相册)
 * @param filename 文件名 (可选，默认使用时间戳)
 * @returns 保存后的文件路径
 */
export async function savePhoto(
  sourceUri: string,
  filename?: string
): Promise<string> {
  try {
    await initPhotoStorage();

    const name = filename || `photo_${Date.now()}.jpg`;
    const destinationUri = `${PHOTOS_DIR}${name}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.error('Failed to save photo:', error);
    throw error;
  }
}

/**
 * 删除照片文件
 * @param photoPath 照片路径
 */
export async function deletePhoto(photoPath: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(photoPath);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(photoPath);
    }
  } catch (error) {
    console.error('Failed to delete photo:', error);
    throw error;
  }
}

/**
 * 获取照片文件信息
 * @param photoPath 照片路径
 * @returns 文件信息 (大小、修改时间等)
 */
export async function getPhotoInfo(photoPath: string): Promise<FileSystem.FileInfo> {
  try {
    return await FileSystem.getInfoAsync(photoPath, { size: true });
  } catch (error) {
    console.error('Failed to get photo info:', error);
    throw error;
  }
}

/**
 * 获取所有已保存的照片
 * @returns 照片路径列表
 */
export async function getAllPhotos(): Promise<string[]> {
  try {
    await initPhotoStorage();
    
    const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    return files.map((file) => `${PHOTOS_DIR}${file}`);
  } catch (error) {
    console.error('Failed to get all photos:', error);
    return [];
  }
}

/**
 * 清理未使用的照片 (删除孤立的照片文件)
 * @param usedPhotoPaths 正在使用的照片路径列表
 */
export async function cleanupUnusedPhotos(
  usedPhotoPaths: string[]
): Promise<number> {
  try {
    const allPhotos = await getAllPhotos();
    const unusedPhotos = allPhotos.filter(
      (photo) => !usedPhotoPaths.includes(photo)
    );

    for (const photo of unusedPhotos) {
      await deletePhoto(photo);
    }

    return unusedPhotos.length;
  } catch (error) {
    console.error('Failed to cleanup unused photos:', error);
    return 0;
  }
}

/**
 * 获取照片存储目录大小 (bytes)
 */
export async function getPhotoStorageSize(): Promise<number> {
  try {
    const photos = await getAllPhotos();
    let totalSize = 0;

    for (const photo of photos) {
      const info = await getPhotoInfo(photo);
      totalSize += info.size || 0;
    }

    return totalSize;
  } catch (error) {
    console.error('Failed to get photo storage size:', error);
    return 0;
  }
}
