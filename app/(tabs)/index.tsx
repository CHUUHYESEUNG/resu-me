import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { useResume } from '../../contexts/ResumeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { clearCurrentResume } = useResume();

  const handleCreateNew = () => {
    clearCurrentResume();
    router.push('/create/step-1');
  };

  const handleViewResumes = () => {
    router.push('/my-resumes');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.xl, justifyContent: 'center' }}>
          {/* Hero Section */}
          <View style={{ alignItems: 'center', marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: 100 }}>🎤</Text>
            <Text
              style={{
                fontSize: FontSizes['2xl'],
                fontWeight: '700',
                color: Colors.text,
                marginTop: Spacing.lg,
                textAlign: 'center',
              }}
            >
              말하는 이력서
            </Text>
            <Text
              style={{
                fontSize: FontSizes.base,
                color: Colors.disabled,
                marginTop: Spacing.sm,
                textAlign: 'center',
                lineHeight: 28,
              }}
            >
              복잡한 입력 없이{'\n'}음성으로 간편하게 이력서를 작성하세요
            </Text>
          </View>

          {/* Feature Cards */}
          <View style={{ marginBottom: Spacing['2xl'], gap: Spacing.md }}>
            <View
              style={{
                backgroundColor: '#F0F7FF',
                padding: Spacing.lg,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: Colors.primary,
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>✨</Text>
              <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text }}>
                간편한 음성 입력
              </Text>
              <Text
                style={{
                  fontSize: FontSizes.sm,
                  color: Colors.disabled,
                  marginTop: 4,
                  lineHeight: 24,
                }}
              >
                마이크 버튼만 누르면 자동으로 텍스트로 변환됩니다
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#F0FDF4',
                padding: Spacing.lg,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: Colors.secondary,
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>📱</Text>
              <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text }}>
                6단계 작성
              </Text>
              <Text
                style={{
                  fontSize: FontSizes.sm,
                  color: Colors.disabled,
                  marginTop: 4,
                  lineHeight: 24,
                }}
              >
                기본정보부터 자기소개까지 단계별로 쉽게 작성
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#FFF7ED',
                padding: Spacing.lg,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: Colors.accent,
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>🚀</Text>
              <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text }}>
                저장 & 공유
              </Text>
              <Text
                style={{
                  fontSize: FontSizes.sm,
                  color: Colors.disabled,
                  marginTop: 4,
                  lineHeight: 24,
                }}
              >
                PDF로 저장하고 카카오톡, 이메일로 간편하게 공유
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: Spacing.md }}>
            <BigButton title="새 이력서 만들기" onPress={handleCreateNew} size="large" />
            <BigButton
              title="내 이력서 보기"
              onPress={handleViewResumes}
              variant="outline"
              size="medium"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
