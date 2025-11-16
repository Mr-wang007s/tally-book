/**
 * DateInput Component
 * 
 * Date picker with formatted display and validation
 * Supports date range, disabled dates, and locale-specific formatting
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export interface DateInputProps {
  label?: string;
  value?: Date;
  onChangeDate?: (date: Date) => void;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  displayFormat?: string;
  mode?: 'date' | 'time' | 'datetime';
  locale?: string;
}

const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value = new Date(),
  onChangeDate,
  error,
  helperText,
  isRequired = false,
  containerStyle,
  labelStyle,
  disabled = false,
  minimumDate,
  maximumDate = new Date(),
  displayFormat = 'YYYY-MM-DD',
  mode = 'date',
  locale = 'zh-CN',
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === 'android') {
        setShowPicker(false);
      }

      if (date) {
        setSelectedDate(date);
        onChangeDate?.(date);
      }
    },
    [onChangeDate]
  );

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    labelContainer: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    labelText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    requiredIndicator: {
      color: theme.colors.error,
      marginLeft: 4,
    },
    inputContainer: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      backgroundColor: disabled ? theme.colors.background : theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
    },
    inputText: {
      fontSize: 16,
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: 4,
    },
    helperText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.labelText, labelStyle]}>{label}</Text>
          {isRequired && <Text style={styles.requiredIndicator}>*</Text>}
        </View>
      )}
      <Pressable
        disabled={disabled}
        onPress={() => !disabled && setShowPicker(true)}
        style={styles.inputContainer}
      >
        <Text style={styles.inputText}>{formatDate(selectedDate, displayFormat)}</Text>
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <View style={{ backgroundColor: theme.colors.surface, paddingBottom: 20 }}>
              <DateTimePicker
                value={selectedDate}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                locale={locale}
              />
              <Button
                title="完成"
                onPress={() => setShowPicker(false)}
                variant="primary"
                style={{ marginHorizontal: 12 }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode={mode}
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

DateInput.displayName = 'DateInput';
