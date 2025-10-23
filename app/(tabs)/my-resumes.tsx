import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing } from '../../constants/styles';
import { ResumeCard } from '../../components/ResumeCard';
import { useResume } from '../../contexts/ResumeContext';
import { BigButton } from '../../components/BigButton';

export default function MyResumesScreen() {
  const router = useRouter();
  const { resumes, loading, deleteResume, loadResumes } = useResume();

  useEffect(() => {
    loadResumes();
  }, []);

  const handleViewResume = (resumeId: string) => {
    router.push({
      pathname: '/preview',
      params: { id: resumeId },
    });
  };

  const handleDeleteResume = (resumeId: string, resumeName: string) => {
    Alert.alert(
      '이력서 삭제',
      `"${resumeName}" 이력서를 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResume(resumeId);
              Alert.alert('성공', '이력서가 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '이력서 삭제에 실패했습니다.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCreateNew = () => {
    router.push('/create/step-1');
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.lg }}>
          {resumes.length === 0 ? (
            // Empty state
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl }}>
              <Text style={{ fontSize: 80 }}>📝</Text>
              <Text
                style={{
                  fontSize: FontSizes.xl,
                  fontWeight: '700',
                  color: Colors.text,
                  marginTop: Spacing.lg,
                  textAlign: 'center',
                }}
              >
                아직 작성된 이력서가 없어요
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
                첫 이력서를 작성해보세요{'\n'}음성으로 간편하게 만들 수 있어요!
              </Text>
              <View style={{ marginTop: Spacing['2xl'], width: '100%' }}>
                <BigButton title="첫 이력서 만들기" onPress={handleCreateNew} size="large" />
              </View>
            </View>
          ) : (
            // Resumes list
            <>
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text }}>
                  전체 {resumes.length}개
                </Text>
              </View>

              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onPress={() => handleViewResume(resume.id)}
                  onDelete={() => handleDeleteResume(resume.id, resume.basicInfo.name)}
                />
              ))}

              <View style={{ marginTop: Spacing.lg }}>
                <BigButton title="새 이력서 만들기" onPress={handleCreateNew} variant="outline" size="medium" />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
