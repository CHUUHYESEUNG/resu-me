import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, type NativeSyntheticEvent, type TextInputSubmitEditingEventData } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { ProgressBar } from '../../components/ProgressBar';
import { useResume } from '../../contexts/ResumeContext';

// InputField를 컴포넌트 외부로 이동 (리렌더링 시 포커스 유지)
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  required = false,
  autoCapitalize = 'sentences',
  inputRef,
  returnKeyType = 'next',
  onSubmitEditing,
  blurOnSubmit = false,
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  required?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  inputRef?: React.RefObject<TextInput>;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  blurOnSubmit?: boolean;
  autoFocus?: boolean;
}) => (
  <View style={{ marginBottom: Spacing.lg }}>
    <Text style={{ fontSize: FontSizes.base, color: Colors.text, fontWeight: '600', marginBottom: Spacing.sm }}>
      {label} {required && <Text style={{ color: Colors.error }}>*</Text>}
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
      ref={inputRef}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.disabled}
      keyboardType={keyboardType}
      autoCorrect={false}
      autoCapitalize={autoCapitalize}
      returnKeyType={returnKeyType}
      blurOnSubmit={blurOnSubmit}
      onSubmitEditing={onSubmitEditing}
      autoFocus={autoFocus}
    />
  </View>
);

export default function Step1Screen() {
  const router = useRouter();
  const { currentResume, updateCurrentResumeField } = useResume();

  const ageInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);

  const [name, setName] = useState(currentResume?.basicInfo?.name || '');
  const [age, setAge] = useState(currentResume?.basicInfo?.age?.toString() || '');
  const [phone, setPhone] = useState(currentResume?.basicInfo?.phone || '');
  const [email, setEmail] = useState(currentResume?.basicInfo?.email || '');

  useEffect(() => {
    if (currentResume?.basicInfo) {
      setName(currentResume.basicInfo.name || '');
      setAge(currentResume.basicInfo.age?.toString() || '');
      setPhone(currentResume.basicInfo.phone || '');
      setEmail(currentResume.basicInfo.email || '');
    }
  }, []);

  const handleNext = () => {
    if (!name || !age || !phone) {
      alert('이름, 나이, 연락처는 필수 입력 항목입니다.');
      return;
    }

    updateCurrentResumeField('basicInfo', { name, age, phone, email });
    router.push('/create/step-2');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProgressBar currentStep={1} totalSteps={6} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, padding: Spacing.xl }}>
          <View style={{ marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
              기본 정보
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm }}>
              본인의 기본 정보를 입력해주세요
            </Text>
          </View>

          <InputField
            label="이름"
            value={name}
            onChangeText={setName}
            placeholder="홍길동"
            required
            returnKeyType="next"
            onSubmitEditing={() => ageInputRef.current?.focus()}
            autoFocus
          />

          <InputField
            label="나이"
            value={age}
            onChangeText={setAge}
            placeholder="55"
            keyboardType="numeric"
            required
            inputRef={ageInputRef}
            returnKeyType="next"
            onSubmitEditing={() => phoneInputRef.current?.focus()}
          />

          <InputField
            label="연락처"
            value={phone}
            onChangeText={setPhone}
            placeholder="010-1234-5678"
            keyboardType="phone-pad"
            required
            inputRef={phoneInputRef}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />

          <InputField
            label="이메일 (선택)"
            value={email}
            onChangeText={setEmail}
            placeholder="hong@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            inputRef={emailInputRef}
            returnKeyType="done"
            blurOnSubmit
          />

          <View style={{ marginTop: 'auto', paddingTop: Spacing.xl }}>
            <BigButton title="다음" onPress={handleNext} size="large" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
