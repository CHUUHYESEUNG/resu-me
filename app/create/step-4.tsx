import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { ProgressBar } from '../../components/ProgressBar';
import { VoiceInput } from '../../components/VoiceInput';
import { useResume } from '../../contexts/ResumeContext';

export default function Step4Screen() {
  const router = useRouter();
  const { currentResume, updateCurrentResumeField } = useResume();

  const [desiredJob, setDesiredJob] = useState(currentResume?.desiredJob || '');

  useEffect(() => {
    if (currentResume?.desiredJob) {
      setDesiredJob(currentResume.desiredJob);
    }
  }, []);

  const handleNext = () => {
    if (!desiredJob) {
      alert('희망 직무를 입력해주세요.');
      return;
    }

    updateCurrentResumeField('desiredJob', desiredJob);
    router.push('/create/step-5');
  };

  const handleBack = () => {
    updateCurrentResumeField('desiredJob', desiredJob);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProgressBar currentStep={4} totalSteps={6} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.xl }}>
          <View style={{ marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
              희망 직무
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm, lineHeight: 28 }}>
              어떤 일을 하고 싶으신가요?
            </Text>
          </View>

          <VoiceInput
            value={desiredJob}
            onChangeText={setDesiredJob}
            placeholder="예: 주방 보조나 홀 서빙 일을 하고 싶습니다. 경비 일도 괜찮습니다."
            label="희망 직무"
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
