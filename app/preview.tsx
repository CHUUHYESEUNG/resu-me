import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Share, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';
import { BigButton } from '../components/BigButton';
import { useResume } from '../contexts/ResumeContext';
import { Resume } from '../types/resume';
import { generateResumePDF } from '../utils/pdfGenerator';

export default function PreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getResume } = useResume();

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    if (!id) {
      Alert.alert('오류', '이력서를 찾을 수 없습니다.');
      router.back();
      return;
    }

    setLoading(true);
    const loadedResume = await getResume(id);

    if (!loadedResume) {
      Alert.alert('오류', '이력서를 불러올 수 없습니다.');
      router.back();
      return;
    }

    setResume(loadedResume);
    setLoading(false);
  };

  const handleShare = async () => {
    if (!resume) return;

    try {
      const message = `
📝 이력서

이름: ${resume.basicInfo.name}
나이: ${resume.basicInfo.age}세
연락처: ${resume.basicInfo.phone}
${resume.basicInfo.email ? `이메일: ${resume.basicInfo.email}\n` : ''}
---

🏢 경력 사항
${resume.experience}

---

🎓 보유 기술/자격증
${resume.skills}

---

💼 희망 직무
${resume.desiredJob}

---

⏰ 근무 조건
지역: ${resume.workConditions.location}
시간: ${resume.workConditions.time}
형태: ${resume.workConditions.type}

---

✍️ 자기소개
${resume.introduction}
      `.trim();

      await Share.share({
        message,
        title: `${resume.basicInfo.name}의 이력서`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('오류', '공유에 실패했습니다.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!resume) return;

    setGeneratingPDF(true);
    try {
      // PDF 생성
      const pdfPath = await generateResumePDF(resume, {
        fileName: `${resume.basicInfo.name}_이력서.pdf`,
      });

      Alert.alert('완료', 'PDF가 생성되었습니다!', [
        {
          text: '공유하기',
          onPress: async () => {
            // 공유 가능 여부 확인
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
              await Sharing.shareAsync(pdfPath, {
                mimeType: 'application/pdf',
                dialogTitle: `${resume.basicInfo.name}의 이력서`,
                UTI: 'com.adobe.pdf',
              });
            } else {
              Alert.alert('알림', 'PDF가 다운로드 폴더에 저장되었습니다.\n경로: ' + pdfPath);
            }
          },
        },
        {
          text: '확인',
          style: 'default',
        },
      ]);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      Alert.alert(
        '오류',
        'PDF 생성에 실패했습니다.\n\n' +
          '디바이스 저장공간을 확인해주세요.\n' +
          (Platform.OS === 'ios'
            ? 'iOS에서는 파일 앱에서 확인할 수 있습니다.'
            : 'Android에서는 다운로드 폴더에서 확인할 수 있습니다.')
      );
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const SectionCard = ({ title, content, emoji }: { title: string; content: string | React.ReactNode; emoji: string }) => (
    <View
      style={{
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 2,
        borderColor: Colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
        <Text style={{ fontSize: 28, marginRight: Spacing.sm }}>{emoji}</Text>
        <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text }}>
          {title}
        </Text>
      </View>
      <View style={{ paddingLeft: Spacing.md }}>
        {typeof content === 'string' ? (
          <Text style={{ fontSize: FontSizes.base, color: Colors.text, lineHeight: 28 }}>
            {content}
          </Text>
        ) : (
          content
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.md }}>
            불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!resume) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
          <Text style={{ fontSize: 60 }}>😢</Text>
          <Text style={{ fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, marginTop: Spacing.lg }}>
            이력서를 찾을 수 없습니다
          </Text>
          <View style={{ marginTop: Spacing['2xl'], width: '100%' }}>
            <BigButton title="홈으로" onPress={handleGoHome} size="large" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.lg }}>
          {/* Header Card */}
          <View
            style={{
              backgroundColor: Colors.primary,
              borderRadius: BorderRadius.lg,
              padding: Spacing.xl,
              marginBottom: Spacing.lg,
            }}
          >
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.background }}>
              {resume.basicInfo.name}
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.background, marginTop: Spacing.sm }}>
              {resume.basicInfo.age}세 • {resume.basicInfo.phone}
            </Text>
            {resume.basicInfo.email && (
              <Text style={{ fontSize: FontSizes.base, color: Colors.background, marginTop: 4 }}>
                {resume.basicInfo.email}
              </Text>
            )}
          </View>

          {/* Sections */}
          <SectionCard title="경력 사항" content={resume.experience} emoji="🏢" />

          <SectionCard title="보유 기술/자격증" content={resume.skills} emoji="🎓" />

          <SectionCard title="희망 직무" content={resume.desiredJob} emoji="💼" />

          <SectionCard
            title="근무 조건"
            emoji="⏰"
            content={
              <>
                <Text style={{ fontSize: FontSizes.base, color: Colors.text, lineHeight: 28 }}>
                  지역: {resume.workConditions.location}
                </Text>
                <Text style={{ fontSize: FontSizes.base, color: Colors.text, lineHeight: 28 }}>
                  시간: {resume.workConditions.time}
                </Text>
                <Text style={{ fontSize: FontSizes.base, color: Colors.text, lineHeight: 28 }}>
                  형태: {resume.workConditions.type}
                </Text>
              </>
            }
          />

          <SectionCard title="자기소개" content={resume.introduction} emoji="✍️" />

          {/* Action Buttons */}
          <View style={{ marginTop: Spacing.lg, gap: Spacing.md }}>
            <BigButton
              title={generatingPDF ? 'PDF 생성 중...' : '📄 PDF로 다운로드'}
              onPress={handleDownloadPDF}
              size="large"
              variant="primary"
              disabled={generatingPDF}
            />
            <BigButton title="텍스트로 공유하기" onPress={handleShare} size="medium" variant="secondary" />
            <BigButton title="홈으로" onPress={handleGoHome} variant="outline" size="medium" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
