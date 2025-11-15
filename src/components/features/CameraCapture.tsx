/**
 * CameraCapture Component
 * 拍照界面组件
 * User Story 3: 拍照识别账单
 * 遵循 Constitution Principles I (HIG), IV (Accessibility), VII (Safe Areas)
 */

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/useTheme';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { colors, typography } = useTheme();
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);

  // 权限未授予
  if (!permission?.granted) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
          <Icon name="camera" size={64} color={colors.textSecondary} />
          <Text
            style={[
              styles.permissionText,
              { color: colors.text, fontSize: typography.fontSize.body },
            ]}
          >
            需要相机权限才能拍照
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
            accessibilityRole="button"
            accessibilityLabel="授权相机权限"
          >
            <Text
              style={[
                styles.permissionButtonText,
                { color: colors.background, fontSize: typography.fontSize.body },
              ]}
            >
              授权
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton]}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="取消"
          >
            <Text
              style={[
                styles.cancelButtonText,
                { color: colors.textSecondary, fontSize: typography.fontSize.body },
              ]}
            >
              取消
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  /**
   * 拍照
   */
  const handleTakePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('Take picture failed:', error);
      Alert.alert('错误', '拍照失败');
    }
  };

  /**
   * 切换前后摄像头
   */
  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          ratio="4:3"
        >
          <View style={styles.overlay}>
            {/* 顶部工具栏 */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.overlay }]}
                onPress={onCancel}
                accessibilityRole="button"
                accessibilityLabel="取消拍照"
              >
                <Icon name="close" size={24} color={colors.background} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.overlay }]}
                onPress={toggleCameraType}
                accessibilityRole="button"
                accessibilityLabel="切换前后摄像头"
              >
                <Icon name="camera-reverse" size={24} color={colors.background} />
              </TouchableOpacity>
            </View>

            {/* 拍照按钮 */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[styles.captureButton, { borderColor: colors.background }]}
                onPress={handleTakePicture}
                accessibilityRole="button"
                accessibilityLabel="拍照"
              >
                <View style={[styles.captureButtonInner, { backgroundColor: colors.background }]} />
              </TouchableOpacity>
            </View>

            {/* 辅助线（帮助对准小票）*/}
            <View style={styles.guideline}>
              <View style={[styles.guidelineCorner, styles.guidelineTopLeft, { borderColor: colors.primary }]} />
              <View style={[styles.guidelineCorner, styles.guidelineTopRight, { borderColor: colors.primary }]} />
              <View style={[styles.guidelineCorner, styles.guidelineBottomLeft, { borderColor: colors.primary }]} />
              <View style={[styles.guidelineCorner, styles.guidelineBottomRight, { borderColor: colors.primary }]} />
            </View>
          </View>
        </Camera>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  permissionButtonText: {
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  cancelButtonText: {
    fontWeight: '500',
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  guideline: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    borderRadius: 8,
  },
  guidelineCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
  },
  guidelineTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  guidelineTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  guidelineBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  guidelineBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
