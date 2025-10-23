import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { ProgressBar } from '../../components/ProgressBar';
import { VoiceInput } from '../../components/VoiceInput';
import { useResume } from '../../contexts/ResumeContext';

export default function Step3Screen() {
  const router = useRouter();
  const { currentResume, updateCurrentResumeField } = useResume();

  const [skills, setSkills] = useState(currentResume?.skills || '');

  useEffect(() => {
    if (currentResume?.skills) {
      setSkills(currentResume.skills);
    }
  }, []);

  const handleNext = () => {
    if (!skills) {
      alert('보유 기술/자격증을 입력해주세요.');
      return;
    }

    updateCurrentResumeField('skills', skills);
    router.push('/create/step-4');
  };

  const handleBack = () => {
    updateCurrentResumeField('skills', skills);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProgressBar currentStep={3} totalSteps={6} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.xl }}>
          <View style={{ marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
              보유 기술/자격증
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm, lineHeight: 28 }}>
              어떤 기술이나 자격증이 있으신가요?
            </Text>
          </View>

          <VoiceInput
            value={skills}
            onChangeText={setSkills}
            placeholder="예: 조리사 자격증이 있고, 한식, 중식 요리를 할 수 있습니다. 컴퓨터도 기본적으로 다룰 수 있어요."
            label="보유 기술/자격증"
            multiline
          />

          <View style={{ marginTop: 'auto', paddingTop: Spacing.xl, gap: Spacing.md }}>
            <BigButton title="다음" onPress={handleNext} size="large" />
            <BigButton title="이전" onPress={handleBack} variant="outline" size="medium" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
