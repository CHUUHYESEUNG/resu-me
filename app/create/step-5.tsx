import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { ProgressBar } from '../../components/ProgressBar';
import { useResume } from '../../contexts/ResumeContext';

export default function Step5Screen() {
  const router = useRouter();
  const { currentResume, updateCurrentResumeField } = useResume();

  const [location, setLocation] = useState(currentResume?.workConditions?.location || '');
  const [time, setTime] = useState(currentResume?.workConditions?.time || '');
  const [type, setType] = useState(currentResume?.workConditions?.type || '');

  useEffect(() => {
    if (currentResume?.workConditions) {
      setLocation(currentResume.workConditions.location);
      setTime(currentResume.workConditions.time);
      setType(currentResume.workConditions.type);
    }
  }, []);

  const handleNext = () => {
    if (!location || !time || !type) {
      alert('모든 근무 조건을 입력해주세요.');
      return;
    }

    updateCurrentResumeField('workConditions', { location, time, type });
    router.push('/create/step-6');
  };

  const handleBack = () => {
    updateCurrentResumeField('workConditions', { location, time, type });
    router.back();
  };

  const InputField = ({ label, value, onChangeText, placeholder }: any) => (
    <View style={{ marginBottom: Spacing.lg }}>
      <Text style={{ fontSize: FontSizes.base, color: Colors.text, fontWeight: '600', marginBottom: Spacing.sm }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderWidth: 2,
          borderColor: Colors.border,
          borderRadius: BorderRadius.md,
          padding: Spacing.md,
          fontSize: FontSizes.base,
          color: Colors.text,
          backgroundColor: Colors.background,
          height: 60,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.disabled}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProgressBar currentStep={5} totalSteps={6} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.xl }}>
          <View style={{ marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
              근무 조건
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm, lineHeight: 28 }}>
              언제, 어디서 일하고 싶으신가요?
            </Text>
          </View>

          <InputField
            label="희망 근무 지역"
            value={location}
            onChangeText={setLocation}
            placeholder="예: 서울시 강남구"
          />

          <InputField
            label="희망 근무 시간"
            value={time}
            onChangeText={setTime}
            placeholder="예: 오전 9시 ~ 오후 6시"
          />

          <InputField
            label="고용 형태"
            value={type}
            onChangeText={setType}
            placeholder="예: 정규직, 계약직, 파트타임"
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
