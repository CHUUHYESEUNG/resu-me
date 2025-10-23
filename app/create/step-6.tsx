import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { ProgressBar } from '../../components/ProgressBar';
import { VoiceInput } from '../../components/VoiceInput';
import { useResume } from '../../contexts/ResumeContext';

export default function Step6Screen() {
  const router = useRouter();
  const { currentResume, updateCurrentResumeField, createResumeFromFormData, saveResume } = useResume();

  const [introduction, setIntroduction] = useState(currentResume?.introduction || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentResume?.introduction) {
      setIntroduction(currentResume.introduction);
    }
  }, []);

  const handleComplete = async () => {
    if (!introduction) {
      Alert.alert('알림', '자기소개를 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);

      // 현재 입력 데이터 업데이트
      updateCurrentResumeField('introduction', introduction);

      // 최종 formData 생성
      const finalFormData = {
        ...currentResume!,
        introduction,
      };

      // Resume 객체 생성
      const newResume = createResumeFromFormData(finalFormData);

      // 저장
      await saveResume(newResume);

      Alert.alert(
        '완료!',
        '이력서가 저장되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              router.replace({
                pathname: '/preview',
                params: { id: newResume.id },
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error saving resume:', error);
      Alert.alert('오류', '이력서 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    updateCurrentResumeField('introduction', introduction);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProgressBar currentStep={6} totalSteps={6} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.xl }}>
          <View style={{ marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
              자기소개
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm, lineHeight: 28 }}>
              자신에 대해 자유롭게 말씀해주세요
            </Text>
          </View>

          <VoiceInput
            value={introduction}
            onChangeText={setIntroduction}
            placeholder="예: 저는 성실하고 책임감이 강한 사람입니다. 새로운 것을 배우는 것을 좋아하고..."
            label="자기소개"
            multiline
          />

          <View style={{ marginTop: 'auto', paddingTop: Spacing.xl, gap: Spacing.md }}>
            <BigButton
              title="완료"
              onPress={handleComplete}
              size="large"
              loading={isSaving}
              disabled={isSaving}
            />
            <BigButton
              title="이전"
              onPress={handleBack}
              variant="outline"
              size="medium"
              disabled={isSaving}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
