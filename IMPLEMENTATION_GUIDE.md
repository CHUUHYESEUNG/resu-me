# 🎯 레쥬미 구현 가이드

## ✅ Step-2 (경력 사항) AI 파싱 완료!

**2025년 현재 상태:** Step-2에 Azure OpenAI 기반 음성 인식 + AI 파싱이 통합되었습니다.

---

## 🚀 테스트 방법

### 1. Azure OpenAI API 설정 확인

`.env` 파일에 다음 값들이 설정되어 있는지 확인:

```bash
EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
EXPO_PUBLIC_AZURE_OPENAI_API_KEY=your-api-key-here
EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT=gpt-4
```

### 2. 네이티브 빌드 (음성 인식 권한 적용)

```bash
# iOS/Android 네이티브 프로젝트 생성
npx expo prebuild

# iOS 실행 (맥에서만)
npx expo run:ios

# Android 실행
npx expo run:android
```

### 3. Step-2 사용 플로우

1. **음성 입력:**
   - 마이크 버튼(🎤)을 눌러 경력 사항을 말합니다
   - 예: "저는 2010년부터 2015년까지 삼성전자에서 소프트웨어 엔지니어로 일했습니다"

2. **AI 분석:**
   - 음성 입력 후 "AI로 분석" 버튼(✨) 클릭
   - Azure OpenAI가 회사명, 직무, 기간, 업무 내용을 자동 추출

3. **결과 확인 및 수정:**
   - 모달로 파싱 결과 표시
   - **텍스트로 수정:** 각 필드를 직접 편집
   - **음성 명령으로 수정:** "음성으로 수정하기" 버튼 클릭 후 명령
     - "회사명을 삼성으로 바꿔줘"
     - "직무를 엔지니어로 변경"
     - "시작일을 2010년으로"

4. **저장:**
   - "저장하고 계속" 버튼으로 다음 단계 진행

---

## 📦 생성된 파일 목록

### 핵심 모듈
- `utils/speechRecognition.ts` - expo-speech-recognition 네이티브 통합
- `utils/aiParser.ts` - Azure OpenAI 파싱 엔진
- `utils/pdfGenerator.ts` - HTML to PDF 변환
- `utils/config.ts` - Azure API 설정

### 컴포넌트
- `components/VoiceInputWithAI.tsx` - AI 파싱 기능이 있는 음성 입력
- `components/ParsedExperienceEditor.tsx` - AI 파싱 결과 편집기

### 화면
- `app/create/step-2.tsx` - AI 파싱 통합 완료 ✅

---

## 🔄 다음 작업 (우선순위)

### Phase 1: 전체 Step AI 통합
- [ ] Step-3 (보유 스킬) - `aiParser.parseSkills()` 사용
- [ ] Step-4 (희망 직무) - 단순 텍스트 저장
- [ ] Step-5 (근무 조건) - 단순 선택/입력
- [ ] Step-6 (자기소개) - `aiParser.generateIntroduction()` 사용

### Phase 2: PDF 생성
- [ ] `app/preview.tsx` 업데이트
- [ ] PDF 다운로드 버튼 추가
- [ ] PDF 공유 기능 (`expo-sharing`)

### Phase 3: 개선
- [ ] 이력서 편집 기능
- [ ] 에러 처리 개선
- [ ] 로딩 상태 UX 개선

---

## 💡 AI 파싱 작동 원리

### 1️⃣ 음성 → 텍스트 (STT)
```typescript
expo-speech-recognition
  ↓ (한국어 음성 인식)
"저는 2010년부터 삼성에서 일했습니다"
```

### 2️⃣ 텍스트 → 구조화 (NLP with Azure OpenAI)
```typescript
Azure OpenAI API
  ↓ (프롬프트 엔지니어링)
{
  companies: [{
    name: "삼성",
    position: "직원",
    startDate: "2010",
    endDate: "현재",
    description: "업무 담당"
  }],
  summary: "2010년부터 삼성에서 근무"
}
```

### 3️⃣ 구조화 → 편집 가능 UI
```typescript
ParsedExperienceEditor
  ↓ (텍스트 편집 또는 음성 명령)
사용자 확인 및 수정
```

### 4️⃣ 최종 저장
```typescript
ResumeContext.updateCurrentResumeField('experience', formattedText)
```

---

## 🎤 음성 명령 예시

### 변경 명령
- "회사명을 카카오로 바꿔줘"
- "직무를 엔지니어로 변경"
- "시작일을 2015년으로"
- "첫 번째 회사 이름을 네이버로"

### 추가/삭제 명령 (향후 지원)
- "회사 하나 추가해줘"
- "두 번째 회사 삭제"

---

## ⚠️ 알려진 이슈

### 음성 인식이 작동하지 않는 경우
1. **권한 확인:**
   ```bash
   # 네이티브 빌드가 필요합니다
   npx expo prebuild
   npx expo run:ios  # 또는 run:android
   ```

2. **Expo Go에서는 expo-speech-recognition이 작동하지 않을 수 있습니다**
   - 반드시 네이티브 빌드로 테스트하세요

### AI 파싱이 작동하지 않는 경우
1. `.env` 파일 확인
2. Azure OpenAI API 키 유효성 확인
3. 배포 이름(deployment) 확인 (gpt-4, gpt-35-turbo 등)

### 디버깅
```typescript
// utils/config.ts에서 설정 확인
import { validateAzureConfig } from './utils/config';
console.log(validateAzureConfig()); // true여야 함
```

---

## 📱 배포 전 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되었는지 확인
- [ ] Azure API 키가 GitHub에 업로드되지 않았는지 확인
- [ ] iOS/Android 권한 설정 확인 (`app.json`)
- [ ] 실제 디바이스에서 음성 인식 테스트
- [ ] AI 파싱 정확도 테스트 (다양한 입력 시도)
- [ ] PDF 생성 테스트
- [ ] 50+ 연령층 사용성 테스트

---

## 🤝 협업 가이드

### 제미나이 동업자님께
- Step-2의 구현 방식을 참고하여 Step-3, 6에도 적용 가능
- `aiParser.parseSkills()`, `aiParser.generateIntroduction()` 메서드 준비됨
- PDF 템플릿은 `utils/pdfGenerator.ts`에 있으며 HTML/CSS 수정 가능

### 다음 미팅 때 논의 사항
1. AI 파싱 프롬프트 개선 (정확도 향상)
2. 음성 명령 패턴 확장
3. PDF 템플릿 디자인 피드백
4. 수익화 전략 (유료 기능 범위)

---

생성일: 2025-10-23
작성자: Claude Code
