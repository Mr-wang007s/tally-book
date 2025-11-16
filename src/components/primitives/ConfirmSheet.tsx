/**
 * ConfirmSheet Component
 * Animated confirmation dialog/sheet for delete and important actions
 */

import React, { useCallback } from 'react';
import { View, Text, Modal, Pressable, Dimensions } from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Button } from './Button';

export interface ConfirmSheetProps {
  /** Sheet visibility */
  visible: boolean;
  /** Callback on dismiss */
  onDismiss: () => void;
  /** Title text */
  title: string;
  /** Description/body text */
  description?: string;
  /** Primary action label */
  confirmLabel?: string;
  /** Secondary action label */
  cancelLabel?: string;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Is action destructive (red) */
  isDestructive?: boolean;
  /** Confirm button icon */
  icon?: React.ReactNode;
}

/**
 * ConfirmSheet component - confirmation dialog with animations
 */
export const ConfirmSheet: React.FC<ConfirmSheetProps> = ({
  visible,
  onDismiss,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
  icon,
}) => {
  const { theme } = useTheme();
  const { triggerImpact } = useHaptics();

  const handleConfirm = useCallback(() => {
    triggerImpact('medium');
    onConfirm();
    onDismiss();
  }, [onConfirm, onDismiss, triggerImpact]);

  const handleCancel = useCallback(() => {
    triggerImpact('light');
    onCancel?.();
    onDismiss();
  }, [onCancel, onDismiss, triggerImpact]);

  const sheetHeight = Dimensions.get('window').height * 0.4;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCancel}
    >
      {/* Animated Backdrop */}
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={handleCancel}
        />
      </Animated.View>

      {/* Animated Sheet */}
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 20,
          paddingBottom: 32,
          minHeight: sheetHeight,
        }}
      >
        {/* Handle */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.colors.border,
            }}
          />
        </View>

        {/* Icon */}
        {icon && (
          <View
            style={{
              alignItems: 'center',
              marginBottom: 16,
              height: 60,
            }}
          >
            {icon}
          </View>
        )}

        {/* Title */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>
        )}

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <Button
            label={confirmLabel}
            variant={isDestructive ? 'destructive' : 'primary'}
            size="medium"
            onPress={handleConfirm}
          />
          <Button
            label={cancelLabel}
            variant="secondary"
            size="medium"
            onPress={handleCancel}
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

ConfirmSheet.displayName = 'ConfirmSheet';

/**
 * Confirm hook for easier usage
 */
export function useConfirmSheet() {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<ConfirmSheetProps>>({});

  const confirm = useCallback(
    (options: Partial<ConfirmSheetProps>) => {
      setConfig(options);
      setVisible(true);
    },
    []
  );

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const Sheet = () => (
    <ConfirmSheet
      {...(config as ConfirmSheetProps)}
      visible={visible}
      onDismiss={dismiss}
      onConfirm={() => {
        config.onConfirm?.();
        dismiss();
      }}
    />
  );

  return { confirm, dismiss, Sheet };
}

export default ConfirmSheet;
