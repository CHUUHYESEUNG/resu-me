// AI Parser using Azure OpenAI
import OpenAI from 'openai';
import '@azure/openai/types';
import { azureConfig, validateAzureConfig } from './config';

// 파싱 결과 인터페이스
export interface ParsedExperience {
  companies: Array<{
    name: string; // 회사명
    position: string; // 직무/직급
    startDate: string; // 시작일 (예: "2010", "2010년 3월")
    endDate: string; // 종료일 (예: "2015", "현재")
    description: string; // 업무 설명
  }>;
  summary: string; // 전체 요약
}

export interface ParsedSkills {
  technical: string[]; // 기술적 스킬
  soft: string[]; // 소프트 스킬
  certifications: string[]; // 자격증
  summary: string; // 전체 요약
}

export interface VoiceCommand {
  action: 'change' | 'add' | 'delete' | 'unknown';
  field: string; // 변경할 필드 (회사명, 직무, 등)
  value: string; // 새로운 값
  index?: number; // 여러 항목 중 몇 번째인지
}

class AIParser {
  private client: OpenAI | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (!validateAzureConfig()) {
      console.warn('Azure OpenAI 설정이 없습니다. AI 파싱 기능이 비활성화됩니다.');
      return;
    }

    try {
      const endpoint = azureConfig.endpoint.replace(/\/+$/, '');
      this.client = new OpenAI({
        apiKey: azureConfig.apiKey,
        baseURL: `${endpoint}/openai/deployments/${azureConfig.deploymentName}`,
        defaultQuery: { 'api-version': azureConfig.apiVersion },
        defaultHeaders: { 'api-key': azureConfig.apiKey },
        dangerouslyAllowBrowser: true,
      });
    } catch (error) {
      console.error('Azure OpenAI 클라이언트 초기화 실패:', error);
    }
  }

  /**
   * 경력 사항 텍스트를 구조화된 데이터로 변환
   */
  async parseExperience(text: string): Promise<ParsedExperience | null> {
    if (!this.client) {
      console.warn('Azure OpenAI 클라이언트가 초기화되지 않았습니다.');
      return null;
    }

    const prompt = `
다음은 사용자가 음성으로 입력한 경력 사항입니다. 이 텍스트를 분석하여 JSON 형식으로 구조화해주세요.

입력 텍스트:
"""
${text}
"""

다음 JSON 형식으로 응답해주세요:
{
  "companies": [
    {
      "name": "회사명",
      "position": "직무/직급",
      "startDate": "시작일",
      "endDate": "종료일 또는 '현재'",
      "description": "업무 설명"
    }
  ],
  "summary": "전체 경력 요약 (1-2문장)"
}

규칙:
- 회사명이 명확하지 않으면 "회사명 미상"으로 표시
- 날짜가 불명확하면 "연도 미상"으로 표시
- 여러 회사/직장을 언급하면 배열에 모두 포함
- 한국어로 응답하고, JSON만 반환 (다른 설명 없이)
`;

    try {
      const response = await this.client.chat.completions.create({
        model: azureConfig.deploymentName,
        messages: [
          {
            role: 'system',
            content:
              '당신은 이력서 작성을 돕는 AI 어시스턴트입니다. 사용자의 음성 입력에서 경력 정보를 정확하게 추출합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as ParsedExperience;
      }
      return null;
    } catch (error) {
      console.error('경력 파싱 오류:', error);
      return null;
    }
  }

  /**
   * 스킬 텍스트를 구조화된 데이터로 변환
   */
  async parseSkills(text: string): Promise<ParsedSkills | null> {
    if (!this.client) {
      console.warn('Azure OpenAI 클라이언트가 초기화되지 않았습니다.');
      return null;
    }

    const prompt = `
다음은 사용자가 음성으로 입력한 보유 스킬 및 자격증입니다. 이 텍스트를 분석하여 JSON 형식으로 구조화해주세요.

입력 텍스트:
"""
${text}
"""

다음 JSON 형식으로 응답해주세요:
{
  "technical": ["기술적 스킬 목록"],
  "soft": ["소프트 스킬 목록"],
  "certifications": ["자격증 목록"],
  "summary": "전체 스킬 요약 (1-2문장)"
}

규칙:
- 기술적 스킬: 컴퓨터, 기계 조작, 전문 기술 등
- 소프트 스킬: 의사소통, 리더십, 팀워크 등
- 자격증: 운전면허, 자격증, 면허 등
- 한국어로 응답하고, JSON만 반환
`;

    try {
      const response = await this.client.chat.completions.create({
        model: azureConfig.deploymentName,
        messages: [
          {
            role: 'system',
            content:
              '당신은 이력서 작성을 돕는 AI 어시스턴트입니다. 사용자의 음성 입력에서 스킬 정보를 정확하게 분류합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as ParsedSkills;
      }
      return null;
    } catch (error) {
      console.error('스킬 파싱 오류:', error);
      return null;
    }
  }

  /**
   * 음성 명령 파싱 (예: "회사명을 삼성으로 바꿔줘")
   */
  async parseVoiceCommand(command: string): Promise<VoiceCommand | null> {
    if (!this.client) {
      console.warn('Azure OpenAI 클라이언트가 초기화되지 않았습니다.');
      return null;
    }

    const prompt = `
다음은 사용자가 입력한 음성 명령입니다. 이 명령을 분석하여 JSON 형식으로 변환해주세요.

음성 명령:
"""
${command}
"""

다음 JSON 형식으로 응답해주세요:
{
  "action": "change | add | delete",
  "field": "변경할 필드명 (예: 회사명, 직무, 시작일, 종료일, 업무내용)",
  "value": "새로운 값",
  "index": "여러 항목 중 몇 번째인지 (0부터 시작, 없으면 null)"
}

예시:
- "회사명을 삼성으로 바꿔줘" → {"action": "change", "field": "회사명", "value": "삼성", "index": null}
- "직무를 엔지니어로 변경" → {"action": "change", "field": "직무", "value": "엔지니어", "index": null}
- "첫 번째 회사 이름을 카카오로" → {"action": "change", "field": "회사명", "value": "카카오", "index": 0}

JSON만 반환하세요.
`;

    try {
      const response = await this.client.chat.completions.create({
        model: azureConfig.deploymentName,
        messages: [
          {
            role: 'system',
            content: '당신은 음성 명령을 분석하는 AI입니다. 사용자의 명령을 구조화된 데이터로 변환합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 200,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return {
          action: parsed.action || 'unknown',
          field: parsed.field || '',
          value: parsed.value || '',
          index: parsed.index !== null && parsed.index !== undefined ? parsed.index : undefined,
        };
      }
      return null;
    } catch (error) {
      console.error('음성 명령 파싱 오류:', error);
      return null;
    }
  }

  /**
   * 이력서 전체를 요약하여 자기소개 생성
   */
  async generateIntroduction(resumeData: {
    name: string;
    experience: string;
    skills: string;
    desiredJob: string;
  }): Promise<string | null> {
    if (!this.client) {
      console.warn('Azure OpenAI 클라이언트가 초기화되지 않았습니다.');
      return null;
    }

    const prompt = `
다음 정보를 바탕으로 간단하고 효과적인 자기소개를 작성해주세요 (3-4문장).

이름: ${resumeData.name}
경력: ${resumeData.experience}
보유 스킬: ${resumeData.skills}
희망 직무: ${resumeData.desiredJob}

50대 이상 연령층도 이해하기 쉽고, 진솔하며, 긍정적인 톤으로 작성해주세요.
`;

    try {
      const response = await this.client.chat.completions.create({
        model: azureConfig.deploymentName,
        messages: [
          {
            role: 'system',
            content: '당신은 이력서 자기소개를 작성하는 전문가입니다. 간결하고 진솔한 자기소개를 작성합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || null;
    } catch (error) {
      console.error('자기소개 생성 오류:', error);
      return null;
    }
  }
}

export const aiParser = new AIParser();
