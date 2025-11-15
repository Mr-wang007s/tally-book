/**
 * Local Storage Adapter
 * Implements StorageAdapter using AsyncStorage for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageAdapter } from './storage';

export class LocalStorageAdapter implements StorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys]; // Convert readonly to mutable array
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }
}

/**
 * Default storage instance
 */
export const storage = new LocalStorageAdapter();
