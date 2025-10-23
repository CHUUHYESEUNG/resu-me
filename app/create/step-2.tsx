import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSizes, Spacing } from '../../constants/styles';
import { BigButton } from '../../components/BigButton';
import { ProgressBar } from '../../components/ProgressBar';
import { VoiceInputWithAI } from '../../components/VoiceInputWithAI';
import { ParsedExperienceEditor } from '../../components/ParsedExperienceEditor';
import { useResume } from '../../contexts/ResumeContext';
import { ParsedExperience } from '../../utils/aiParser';

export default function Step2Screen() {
  const router = useRouter();
  const { currentResume, updateCurrentResumeField } = useResume();

  const [experience, setExperience] = useState(currentResume?.experience || '');
  const [parsedData, setParsedData] = useState<ParsedExperience | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (currentResume?.experience) {
      setExperience(currentResume.experience);
    }
  }, []);

  const handleParsedResult = (parsed: ParsedExperience) => {
    setParsedData(parsed);
    setShowEditor(true);
  };

  const handleSaveParsed = (data: ParsedExperience) => {
    // 파싱된 데이터를 텍스트로 변환
    let formattedText = data.summary + '\n\n';

    data.companies.forEach((company, index) => {
      formattedText += `${index + 1}. ${company.name}\n`;
      formattedText += `   직무: ${company.position}\n`;
      formattedText += `   기간: ${company.startDate} ~ ${company.endDate}\n`;
      formattedText += `   업무: ${company.description}\n\n`;
    });

    setExperience(formattedText.trim());
    updateCurrentResumeField('experience', formattedText.trim());
    setShowEditor(false);
    setParsedData(null);
  };

  const handleCancelParsed = () => {
    setShowEditor(false);
    setParsedData(null);
  };

  const handleNext = () => {
    if (!experience) {
      alert('경력 사항을 입력해주세요.');
      return;
    }

    updateCurrentResumeField('experience', experience);
    router.push('/create/step-3');
  };

  const handleBack = () => {
    updateCurrentResumeField('experience', experience);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ProgressBar currentStep={2} totalSteps={6} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: Spacing.xl }}>
          <View style={{ marginBottom: Spacing['2xl'] }}>
            <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
              경력 사항
            </Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm, lineHeight: 28 }}>
              어떤 일을 하셨나요?{'\n'}자유롭게 말씀해주세요
            </Text>
          </View>

          <VoiceInputWithAI
            value={experience}
            onChangeText={setExperience}
            onParsedResult={handleParsedResult}
            placeholder="예: 저는 20년간 식당에서 일했습니다. 주방 일과 홀 서빙을 담당했고..."
            label="경력 사항"
            multiline
            enableAIParsing={true}
          />

          <View style={{ marginTop: 'auto', paddingTop: Spacing.xl, gap: Spacing.md }}>
            <BigButton title="다음" onPress={handleNext} size="large" />
            <BigButton title="이전" onPress={handleBack} variant="outline" size="medium" />
          </View>
        </View>
      </ScrollView>

      {/* AI 파싱 결과 에디터 모달 */}
      <Modal visible={showEditor && parsedData !== null} animationType="slide" presentationStyle="pageSheet">
        {parsedData && (
          <ParsedExperienceEditor parsedData={parsedData} onSave={handleSaveParsed} onCancel={handleCancelParsed} />
        )}
      </Modal>
    </SafeAreaView>
  );
}
