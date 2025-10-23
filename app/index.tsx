import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';
import { BigButton } from '../components/BigButton';

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const onboardingPages = [
    {
      emoji: '🎤',
      title: '말하는 이력서',
      description: '복잡한 입력 없이\n음성으로 간편하게\n이력서를 작성하세요',
    },
    {
      emoji: '📝',
      title: '6단계 작성',
      description: '기본정보부터 자기소개까지\n6단계로 쉽게\n이력서를 완성하세요',
    },
    {
      emoji: '✅',
      title: '저장 & 공유',
      description: '작성한 이력서를\nPDF로 저장하고\n간편하게 공유하세요',
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const currentData = onboardingPages[currentPage];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <View style={{ flex: 1, padding: Spacing.xl }}>
        {/* Skip button */}
        {currentPage < onboardingPages.length - 1 && (
          <TouchableOpacity
            onPress={handleSkip}
            style={{ alignSelf: 'flex-end', padding: Spacing.sm }}
          >
            <Text style={{ fontSize: FontSizes.base, color: Colors.background, fontWeight: '600' }}>
              건너뛰기
            </Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 120 }}>{currentData.emoji}</Text>

          <Text
            style={{
              fontSize: FontSizes['3xl'],
              fontWeight: '700',
              color: Colors.background,
              marginTop: Spacing.xl,
              textAlign: 'center',
            }}
          >
            {currentData.title}
          </Text>

          <Text
            style={{
              fontSize: FontSizes.lg,
              color: Colors.background,
              marginTop: Spacing.lg,
              textAlign: 'center',
              lineHeight: 34,
            }}
          >
            {currentData.description}
          </Text>
        </View>

        {/* Page indicators */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.xl,
          }}
        >
          {onboardingPages.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentPage === index ? 32 : 8,
                height: 8,
                borderRadius: BorderRadius.full,
                backgroundColor: currentPage === index ? Colors.background : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </View>

        {/* Next button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            height: 72,
            backgroundColor: Colors.background,
            borderRadius: BorderRadius.lg,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: FontSizes.lg, color: Colors.primary, fontWeight: '700' }}>
            {currentPage < onboardingPages.length - 1 ? '다음' : '시작하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
