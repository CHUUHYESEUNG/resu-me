// AI 파싱 결과를 표시하고 수정할 수 있는 컴포넌트
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';
import { ParsedExperience } from '../utils/aiParser';
import { speechRecognition } from '../utils/speechRecognition';
import { aiParser } from '../utils/aiParser';

interface ParsedExperienceEditorProps {
  parsedData: ParsedExperience;
  onSave: (data: ParsedExperience) => void;
  onCancel: () => void;
}

export const ParsedExperienceEditor: React.FC<ParsedExperienceEditorProps> = ({
  parsedData,
  onSave,
  onCancel,
}) => {
  const [data, setData] = useState<ParsedExperience>(parsedData);
  const [isListeningForCommand, setIsListeningForCommand] = useState(false);

  // 개별 회사 정보 수정
  const updateCompany = (index: number, field: string, value: string) => {
    const updatedCompanies = [...data.companies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [field]: value,
    };
    setData({ ...data, companies: updatedCompanies });
  };

  // 회사 삭제
  const deleteCompany = (index: number) => {
    const updatedCompanies = data.companies.filter((_, i) => i !== index);
    setData({ ...data, companies: updatedCompanies });
  };

  // 회사 추가
  const addCompany = () => {
    const newCompany = {
      name: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setData({ ...data, companies: [...data.companies, newCompany] });
  };

  // 음성 명령으로 수정
  const startVoiceCommand = async () => {
    try {
      setIsListeningForCommand(true);
      Alert.alert(
        '음성 명령 모드',
        '수정할 내용을 말씀해주세요.\n\n예시:\n- "첫 번째 회사명을 삼성으로 바꿔줘"\n- "직무를 엔지니어로 변경"\n- "시작일을 2010년으로"',
        [
          {
            text: '취소',
            onPress: () => setIsListeningForCommand(false),
            style: 'cancel',
          },
          {
            text: '시작',
            onPress: async () => {
              try {
                let commandText = '';

                await speechRecognition.startListening(
                  (result) => {
                    if (result.isFinal) {
                      commandText = result.transcript;
                      speechRecognition.stopListening();
                      processVoiceCommand(commandText);
                    }
                  },
                  (error) => {
                    Alert.alert('오류', '음성 인식 실패');
                    setIsListeningForCommand(false);
                  },
                  {
                    language: 'ko-KR',
                    continuous: false,
                    interimResults: false,
                  }
                );
              } catch (error) {
                setIsListeningForCommand(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Voice command error:', error);
      setIsListeningForCommand(false);
    }
  };

  // 음성 명령 처리
  const processVoiceCommand = async (commandText: string) => {
    try {
      const command = await aiParser.parseVoiceCommand(commandText);

      if (!command || command.action === 'unknown') {
        Alert.alert('알림', '명령을 이해하지 못했습니다. 다시 시도해주세요.');
        setIsListeningForCommand(false);
        return;
      }

      // 명령 실행
      if (command.action === 'change') {
        const index = command.index !== undefined ? command.index : 0;
        if (index < data.companies.length) {
          const fieldMap: { [key: string]: string } = {
            회사명: 'name',
            회사: 'name',
            직무: 'position',
            직급: 'position',
            시작일: 'startDate',
            종료일: 'endDate',
            업무내용: 'description',
            설명: 'description',
          };

          const actualField = fieldMap[command.field] || command.field;
          updateCompany(index, actualField, command.value);

          Alert.alert('완료', `${command.field}을(를) "${command.value}"(으)로 변경했습니다.`);
        }
      } else if (command.action === 'delete') {
        const index = command.index !== undefined ? command.index : 0;
        if (index < data.companies.length) {
          deleteCompany(index);
          Alert.alert('완료', `${index + 1}번째 회사를 삭제했습니다.`);
        }
      } else if (command.action === 'add') {
        addCompany();
        Alert.alert('완료', '새 회사를 추가했습니다.');
      }
    } catch (error) {
      console.error('Process voice command error:', error);
      Alert.alert('오류', '명령 처리 중 오류가 발생했습니다.');
    } finally {
      setIsListeningForCommand(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
        {/* 헤더 */}
        <View style={{ marginBottom: Spacing.xl }}>
          <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: Colors.text }}>
            AI 분석 결과
          </Text>
          <Text style={{ fontSize: FontSizes.base, color: Colors.disabled, marginTop: Spacing.sm }}>
            정보를 확인하고 수정해주세요
          </Text>
        </View>

        {/* 요약 */}
        <View style={{ marginBottom: Spacing.lg, padding: Spacing.md, backgroundColor: '#f0f9ff', borderRadius: BorderRadius.md }}>
          <Text style={{ fontSize: FontSizes.sm, fontWeight: '600', color: Colors.primary, marginBottom: Spacing.xs }}>
            전체 요약
          </Text>
          <TextInput
            style={{
              fontSize: FontSizes.base,
              color: Colors.text,
              padding: Spacing.sm,
              backgroundColor: Colors.background,
              borderRadius: BorderRadius.sm,
              borderWidth: 1,
              borderColor: Colors.border,
              minHeight: 60,
              textAlignVertical: 'top',
            }}
            value={data.summary}
            onChangeText={(text) => setData({ ...data, summary: text })}
            multiline
          />
        </View>

        {/* 회사별 경력 */}
        {data.companies.map((company, index) => (
          <View
            key={index}
            style={{
              marginBottom: Spacing.lg,
              padding: Spacing.md,
              backgroundColor: Colors.background,
              borderWidth: 2,
              borderColor: Colors.border,
              borderRadius: BorderRadius.md,
            }}
          >
            {/* 회사 헤더 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md }}>
              <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.primary }}>
                {index + 1}번째 회사
              </Text>
              <TouchableOpacity onPress={() => deleteCompany(index)}>
                <Text style={{ fontSize: FontSizes.base, color: Colors.error }}>삭제</Text>
              </TouchableOpacity>
            </View>

            {/* 회사명 */}
            <View style={{ marginBottom: Spacing.sm }}>
              <Text style={{ fontSize: FontSizes.sm, color: Colors.disabled, marginBottom: 4 }}>회사명</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: Colors.border,
                  borderRadius: BorderRadius.sm,
                  padding: Spacing.sm,
                  fontSize: FontSizes.base,
                  color: Colors.text,
                }}
                value={company.name}
                onChangeText={(text) => updateCompany(index, 'name', text)}
              />
            </View>

            {/* 직무 */}
            <View style={{ marginBottom: Spacing.sm }}>
              <Text style={{ fontSize: FontSizes.sm, color: Colors.disabled, marginBottom: 4 }}>직무/직급</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: Colors.border,
                  borderRadius: BorderRadius.sm,
                  padding: Spacing.sm,
                  fontSize: FontSizes.base,
                  color: Colors.text,
                }}
                value={company.position}
                onChangeText={(text) => updateCompany(index, 'position', text)}
              />
            </View>

            {/* 기간 */}
            <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: FontSizes.sm, color: Colors.disabled, marginBottom: 4 }}>시작일</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.border,
                    borderRadius: BorderRadius.sm,
                    padding: Spacing.sm,
                    fontSize: FontSizes.base,
                    color: Colors.text,
                  }}
                  value={company.startDate}
                  onChangeText={(text) => updateCompany(index, 'startDate', text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: FontSizes.sm, color: Colors.disabled, marginBottom: 4 }}>종료일</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.border,
                    borderRadius: BorderRadius.sm,
                    padding: Spacing.sm,
                    fontSize: FontSizes.base,
                    color: Colors.text,
                  }}
                  value={company.endDate}
                  onChangeText={(text) => updateCompany(index, 'endDate', text)}
                />
              </View>
            </View>

            {/* 업무 설명 */}
            <View>
              <Text style={{ fontSize: FontSizes.sm, color: Colors.disabled, marginBottom: 4 }}>업무 내용</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: Colors.border,
                  borderRadius: BorderRadius.sm,
                  padding: Spacing.sm,
                  fontSize: FontSizes.base,
                  color: Colors.text,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                value={company.description}
                onChangeText={(text) => updateCompany(index, 'description', text)}
                multiline
              />
            </View>
          </View>
        ))}

        {/* 회사 추가 버튼 */}
        <TouchableOpacity
          onPress={addCompany}
          style={{
            padding: Spacing.md,
            borderWidth: 2,
            borderColor: Colors.primary,
            borderStyle: 'dashed',
            borderRadius: BorderRadius.md,
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}
        >
          <Text style={{ fontSize: FontSizes.base, color: Colors.primary, fontWeight: '600' }}>+ 회사 추가</Text>
        </TouchableOpacity>

        {/* 액션 버튼 */}
        <View style={{ gap: Spacing.md }}>
          {/* 음성 명령 버튼 */}
          <TouchableOpacity
            onPress={startVoiceCommand}
            disabled={isListeningForCommand}
            style={{
              height: 60,
              backgroundColor: isListeningForCommand ? Colors.disabled : Colors.secondary,
              borderRadius: BorderRadius.md,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 24 }}>🎤</Text>
            <Text style={{ fontSize: FontSizes.base, color: Colors.background, fontWeight: '700' }}>
              {isListeningForCommand ? '음성 명령 대기 중...' : '음성으로 수정하기'}
            </Text>
          </TouchableOpacity>

          {/* 저장 버튼 */}
          <TouchableOpacity
            onPress={() => onSave(data)}
            style={{
              height: 60,
              backgroundColor: Colors.primary,
              borderRadius: BorderRadius.md,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: FontSizes.lg, color: Colors.background, fontWeight: '700' }}>저장하고 계속</Text>
          </TouchableOpacity>

          {/* 취소 버튼 */}
          <TouchableOpacity
            onPress={onCancel}
            style={{
              height: 48,
              backgroundColor: Colors.background,
              borderWidth: 2,
              borderColor: Colors.border,
              borderRadius: BorderRadius.md,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: FontSizes.base, color: Colors.text }}>다시 입력하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
