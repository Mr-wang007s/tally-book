/**
 * AsyncStorage Service
 * 轻量级本地存储服务，用于设置和离线任务队列
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings } from '@/types/settings';
import type { OfflineTask } from '@/types/offlineTask';

// Storage keys
const KEYS = {
  SETTINGS: '@tallybook:settings',
  OFFLINE_QUEUE: '@tallybook:offline_queue',
} as const;

// ============= Settings Operations =============

/**
 * 获取应用设置
 */
export async function getSettings(): Promise<AppSettings | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.SETTINGS);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

/**
 * 保存应用设置
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * 更新部分设置
 */
export async function updateSettings(
  updates: Partial<AppSettings>
): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await saveSettings(updated);
  return updated;
}

/**
 * 清除所有设置
 */
export async function clearSettings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.SETTINGS);
  } catch (error) {
    console.error('Failed to clear settings:', error);
    throw error;
  }
}

// ============= Offline Queue Operations =============

/**
 * 获取离线任务队列
 */
export async function getOfflineQueue(): Promise<OfflineTask[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.OFFLINE_QUEUE);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to get offline queue:', error);
    return [];
  }
}

/**
 * 添加任务到离线队列
 */
export async function addToOfflineQueue(task: OfflineTask): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    queue.push(task);
    await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to add to offline queue:', error);
    throw error;
  }
}

/**
 * 从离线队列中移除任务
 */
export async function removeFromOfflineQueue(taskId: string): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const filtered = queue.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from offline queue:', error);
    throw error;
  }
}

/**
 * 更新离线队列中的任务
 */
export async function updateOfflineTask(
  taskId: string,
  updates: Partial<OfflineTask>
): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const index = queue.findIndex((task) => task.id === taskId);
    
    if (index === -1) {
      throw new Error(`Task ${taskId} not found in queue`);
    }

    queue[index] = { ...queue[index], ...updates };
    await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to update offline task:', error);
    throw error;
  }
}

/**
 * 清空离线队列
 */
export async function clearOfflineQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.OFFLINE_QUEUE);
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
    throw error;
  }
}

/**
 * 获取队列中待处理的任务数量
 */
export async function getPendingTaskCount(): Promise<number> {
  const queue = await getOfflineQueue();
  return queue.filter((task) => task.status === 'pending').length;
}
