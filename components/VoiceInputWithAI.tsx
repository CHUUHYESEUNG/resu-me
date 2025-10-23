// AI 파싱 기능이 통합된 VoiceInput 컴포넌트
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';
import { speechRecognition } from '../utils/speechRecognition';
import { aiParser, ParsedExperience } from '../utils/aiParser';

interface VoiceInputWithAIProps {
  value: string;
  onChangeText: (text: string) => void;
  onParsedResult?: (parsed: ParsedExperience) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  enableAIParsing?: boolean; // AI 파싱 활성화 여부
}

export const VoiceInputWithAI: React.FC<VoiceInputWithAIProps> = ({
  value,
  onChangeText,
  onParsedResult,
  placeholder = '말씀해주세요...',
  label,
  multiline = true,
  enableAIParsing = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const startRecording = async () => {
    try {
      console.log('[VoiceInputWithAI] Starting recording...');
      setIsRecording(true);
      setIsProcessing(true);

      await speechRecognition.startListening(
        (result) => {
          console.log('[VoiceInputWithAI] Got result:', result);
          if (result.isFinal) {
            const newText = value ? value + ' ' + result.transcript : result.transcript;
            onChangeText(newText);
            setIsRecording(false);
            setIsProcessing(false);
          }
        },
        (error) => {
          console.error('[VoiceInputWithAI] Speech error:', error);
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
      console.error('[VoiceInputWithAI] Start error:', error);
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

  // AI 파싱 실행
  const parseWithAI = async () => {
    if (!value || !enableAIParsing) {
      Alert.alert('알림', '입력된 텍스트가 없습니다.');
      return;
    }

    setIsParsing(true);
    try {
      const parsed = await aiParser.parseExperience(value);
      if (parsed && onParsedResult) {
        onParsedResult(parsed);
        Alert.alert('완료', 'AI가 경력 정보를 분석했습니다. 확인 후 수정해주세요.');
      } else {
        Alert.alert('오류', 'AI 분석에 실패했습니다. Azure OpenAI 설정을 확인해주세요.');
      }
    } catch (error) {
      console.error('AI parsing error:', error);
      Alert.alert('오류', 'AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsParsing(false);
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
          disabled={isProcessing || isParsing}
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
        editable={!isRecording && !isParsing}
      />

      {/* 액션 버튼들 */}
      {value.length > 0 && (
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          {/* AI 분석 버튼 (enableAIParsing이 true일 때만) */}
          {enableAIParsing && (
            <TouchableOpacity
              onPress={parseWithAI}
              disabled={isParsing}
              style={{
                flex: 1,
                height: 56,
                borderRadius: BorderRadius.md,
                backgroundColor: isParsing ? Colors.disabled : Colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              {isParsing ? (
                <ActivityIndicator color={Colors.background} size="small" />
              ) : (
                <Text style={{ fontSize: 28 }}>✨</Text>
              )}
              <Text
                style={{
                  fontSize: FontSizes.base,
                  color: Colors.background,
                  fontWeight: '700',
                }}
              >
                {isParsing ? 'AI 분석 중...' : 'AI로 분석'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 재녹음 버튼 */}
          <TouchableOpacity
            onPress={startRecording}
            disabled={isParsing}
            style={{
              flex: 1,
              height: 56,
              borderRadius: BorderRadius.md,
              backgroundColor: Colors.secondary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: FontSizes.base, color: Colors.background, fontWeight: '600' }}>
              재녹음
            </Text>
          </TouchableOpacity>

          {/* 삭제 버튼 */}
          <TouchableOpacity
            onPress={clearText}
            disabled={isParsing}
            style={{
              flex: 1,
              height: 56,
              borderRadius: BorderRadius.md,
              backgroundColor: Colors.error,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: FontSizes.base, color: Colors.background, fontWeight: '600' }}>
              삭제
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* AI 파싱 안내 메시지 */}
      {enableAIParsing && value.length > 0 && !isParsing && (
        <Text
          style={{
            fontSize: FontSizes.sm,
            color: Colors.disabled,
            marginTop: Spacing.sm,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          💡 "AI로 분석" 버튼을 누르면 자동으로 정리됩니다
        </Text>
      )}
    </View>
  );
};
