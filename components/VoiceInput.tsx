import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';
import { speechRecognition } from '../utils/speechRecognition';

interface VoiceInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChangeText,
  placeholder = '말씀해주세요...',
  label,
  multiline = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      console.log('[VoiceInput] Starting recording...');
      setIsRecording(true);
      setIsProcessing(true);

      await speechRecognition.startListening(
        (result) => {
          console.log('[VoiceInput] Got result:', result);
          if (result.isFinal) {
            const newText = value ? value + ' ' + result.transcript : result.transcript;
            onChangeText(newText);
            setIsRecording(false);
            setIsProcessing(false);
          }
        },
        (error) => {
          console.error('[VoiceInput] Speech error:', error);
          Alert.alert('오류', '음성 인식에 실패했습니다.\n\n' + error.message);
          stopRecording();
        },
        {
          language: 'ko-KR',
          continuous: false,
          interimResults: false,
        }
      );

      setIsProcessing(false);
    } catch (error: any) {
      console.error('[VoiceInput] Start error:', error);
      Alert.alert('오류', '음성 인식을 시작할 수 없습니다.\n\n' + (error.message || '알 수 없는 오류'));
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const stopRecording = async () => {
    try {
      await speechRecognition.stopListening();
      setIsRecording(false);
      setIsProcessing(false);
    } catch (error) {
      console.error('Stop recording error:', error);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const clearText = () => {
    onChangeText('');
  };

  return (
    <View style={{ marginBottom: Spacing.lg }}>
      {label && (
        <Text
          style={{
            fontSize: FontSizes.base,
            color: Colors.text,
            fontWeight: '600',
            marginBottom: Spacing.sm,
          }}
        >
          {label}
        </Text>
      )}

      {/* 마이크 버튼 */}
      <View style={{ alignItems: 'center', marginBottom: Spacing.md }}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={{
            width: 88,
            height: 88,
            borderRadius: BorderRadius.full,
            backgroundColor: isRecording ? Colors.error : Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={Colors.background} size="large" />
          ) : (
            <Text style={{ fontSize: 40 }}>{isRecording ? '⏸️' : '🎤'}</Text>
          )}
        </TouchableOpacity>

        <Text
          style={{
            fontSize: FontSizes.sm,
            color: isRecording ? Colors.error : Colors.text,
            marginTop: Spacing.sm,
            fontWeight: '600',
          }}
        >
          {isRecording ? '녹음 중... (탭하여 중지)' : '탭하여 음성 입력'}
        </Text>
      </View>

      {/* 텍스트 입력 영역 */}
      <TextInput
        style={{
          borderWidth: 2,
          borderColor: Colors.border,
          borderRadius: BorderRadius.md,
          padding: Spacing.md,
          fontSize: FontSizes.base,
          color: Colors.text,
          minHeight: multiline ? 120 : 60,
          textAlignVertical: multiline ? 'top' : 'center',
          backgroundColor: Colors.background,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.disabled}
        multiline={multiline}
        numberOfLines={multiline ? 6 : 1}
      />

      {/* 재녹음/삭제 버튼 */}
      {value.length > 0 && (
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <TouchableOpacity
            onPress={startRecording}
            style={{
              flex: 1,
              height: 48,
              borderRadius: BorderRadius.md,
              backgroundColor: Colors.secondary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: FontSizes.sm, color: Colors.background, fontWeight: '600' }}>
              재녹음
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearText}
            style={{
              flex: 1,
              height: 48,
              borderRadius: BorderRadius.md,
              backgroundColor: Colors.error,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: FontSizes.sm, color: Colors.background, fontWeight: '600' }}>
              삭제
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
