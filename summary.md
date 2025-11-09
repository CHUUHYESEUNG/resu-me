# 음성 이력서 앱 기획서(레쥬미 - 말하는 이력서)
## Voice Resume App for Seniors (50+)

---

## 📋 프로젝트 개요

### 목적

50대 이상 디지털 취약계층이 복잡한 텍스트 입력 없이 음성으로 간편하게 이력서를 작성할 수 있는 모바일 앱

### 목표 사용자

- 50대 이상 중장년층
- 디지털 기기 사용에 어려움을 겪는 분들
- 재취업을 희망하는 어르신들

### 핵심 가치

- **간편성**: 음성으로 모든 정보 입력
- **접근성**: 큰 글씨, 명확한 UI, 간단한 네비게이션
- **실용성**: 즉시 사용 가능한 이력서 생성

---

## 🎯 MVP 핵심 기능 (1일 개발 목표)

### 1. 온보딩 & 기본 설정

- 앱 소개 화면 (큰 글씨, 간단한 설명)
- 필수 권한 요청 (마이크, 저장소)
- 간단한 사용 가이드

### 2. 음성 이력서 작성

**필수 입력 항목** (6개 섹션)

1. **기본 정보**
    - 이름, 나이, 연락처
    - 음성 입력 → 텍스트 변환
2. **경력 사항**
    - "어떤 일을 하셨나요?" 질문
    - 자유 발화 → 텍스트 저장
3. **보유 기술/자격증**
    - "어떤 기술이나 자격증이 있으신가요?"
    - 음성 입력
4. **희망 직무**
    - "어떤 일을 하고 싶으신가요?"
    - 음성 입력
5. **근무 조건**
    - "언제, 어디서 일하고 싶으신가요?"
    - 시간대, 지역 등
6. **자기소개**
    - "자신에 대해 자유롭게 말씀해주세요"
    - 음성 입력

**음성 입력 플로우**

- 큰 마이크 버튼
- 녹음 중 시각적 피드백 (파형, 타이머)
- 재녹음 옵션
- 입력된 텍스트 실시간 표시
- 수정 버튼 (음성 재입력 또는 간단한 텍스트 수정)

### 3. 이력서 미리보기

- 입력한 모든 정보를 보기 좋게 정리
- 큰 글씨로 표시
- 섹션별 구분

### 4. 이력서 저장 & 공유

- 로컬 저장 (AsyncStorage)
- PDF 내보내기
- 텍스트 복사
- 공유 기능 (카카오톡, 이메일 등)

### 5. 내 이력서 관리

- 저장된 이력서 목록
- 수정하기
- 삭제하기

---

## 💰 수익 모델

### Phase 1: 사업자 없이 가능한 수익화

**Google AdMob 광고**

- 배너 광고: 하단 고정
- 전면 광고: 이력서 저장 완료 후
- 보상형 광고: PDF 고급 템플릿 제공 (선택)

**광고 배치 전략**

- 사용자 경험 최소 방해
- 이력서 작성 중에는 광고 없음
- 미리보기/목록 화면에만 배너 광고

### Phase 2: 향후 확장 (사업자 등록 후)

- 프리미엄 이력서 템플릿 판매
- 일자리 매칭 플랫폼 전환 시 수수료
- 기업 구인 광고 게재
- 이력서 컨설팅 서비스

---

## 🎨 UI/UX 디자인 원칙

### 시니어 친화적 디자인

1. **큰 글씨**: 최소 18sp 이상
2. **높은 대비**: 검정/흰색 기반
3. **큰 터치 영역**: 버튼 최소 60x60
4. **간단한 네비게이션**: 최대 3단계
5. **명확한 안내**: 각 단계마다 설명 제공
6. **에러 방지**: 확인 단계 추가

### 색상 팔레트

- Primary: #2563EB (파란색 - 신뢰감)
- Secondary: #10B981 (녹색 - 긍정)
- Background: #FFFFFF (흰색)
- Text: #1F2937 (진한 회색)
- Accent: #F59E0B (주황색 - 강조)

---

## 🛠 기술 스택

### Frontend

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router
- **State Management**: React Hooks (useState, useContext)

### Core Libraries

```json
{
  "expo-speech": "음성 합성 (TTS)",
  "expo-av": "오디오 녹음",
  "expo-file-system": "파일 저장",
  "expo-sharing": "공유 기능",
  "react-native-pdf": "PDF 생성",
  "@react-native-async-storage/async-storage": "로컬 저장",
  "expo-speech-recognition": "음성 인식 (STT)",
  "react-native-admob": "광고"
}

```

### API & Services

- **음성 인식**: Expo Speech Recognition (또는 Web Speech API fallback)
- **광고**: Google AdMob
- **저장소**: AsyncStorage (로컬)

---

## 📱 화면 구조

### 1. 스플래시/온보딩 (Splash/Onboarding)

```
/app/index.tsx
├── 앱 로고 & 소개
├── 사용 방법 간단 설명 (3페이지)
└── 시작하기 버튼

```

### 2. 홈 화면 (Home)

```
/app/(tabs)/index.tsx
├── "새 이력서 만들기" 큰 버튼
├── "내 이력서 보기" 버튼
└── 하단 배너 광고

```

### 3. 이력서 작성 플로우 (Create Resume)

```
/app/create/
├── step-1.tsx - 기본 정보
├── step-2.tsx - 경력 사항
├── step-3.tsx - 보유 기술
├── step-4.tsx - 희망 직무
├── step-5.tsx - 근무 조건
└── step-6.tsx - 자기소개

```

### 4. 이력서 미리보기 (Preview)

```
/app/preview.tsx
├── 전체 이력서 내용
├── 수정/저장/공유 버튼
└── 전면 광고 (저장 후)

```

### 5. 내 이력서 목록 (My Resumes)

```
/app/(tabs)/my-resumes.tsx
├── 저장된 이력서 카드 리스트
├── 각 이력서: 보기/수정/삭제
└── 하단 배너 광고

```

---

## 🗂 프로젝트 구조

```
voice-resume-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # 홈
│   │   └── my-resumes.tsx     # 내 이력서
│   ├── create/
│   │   ├── _layout.tsx
│   │   ├── step-1.tsx
│   │   ├── step-2.tsx
│   │   ├── step-3.tsx
│   │   ├── step-4.tsx
│   │   ├── step-5.tsx
│   │   └── step-6.tsx
│   ├── preview.tsx
│   ├── _layout.tsx
│   └── index.tsx              # 스플래시/온보딩
├── components/
│   ├── VoiceInput.tsx         # 음성 입력 컴포넌트
│   ├── ResumeCard.tsx         # 이력서 카드
│   ├── BigButton.tsx          # 큰 버튼
│   ├── AdBanner.tsx           # 배너 광고
│   └── ProgressBar.tsx        # 진행도 표시
├── contexts/
│   └── ResumeContext.tsx      # 이력서 데이터 관리
├── utils/
│   ├── storage.ts             # AsyncStorage 헬퍼
│   ├── pdfGenerator.ts        # PDF 생성
│   └── speechRecognition.ts   # 음성 인식 헬퍼
├── types/
│   └── resume.ts              # TypeScript 타입 정의
├── constants/
│   └── styles.ts              # 공통 스타일 상수
├── app.json
├── package.json
├── tsconfig.json
└── tailwind.config.js

```

---

## 📊 데이터 모델

```tsx
interface Resume {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  basicInfo: {
    name: string;
    age: number;
    phone: string;
    email?: string;
  };
  experience: string;
  skills: string;
  desiredJob: string;
  workConditions: {
    location: string;
    time: string;
    type: string; // 정규직, 계약직, 파트타임 등
  };
  introduction: string;
}

```

---

## ✅ TODO LIST (우선순위 순)

### Phase 0: 프로젝트 초기 설정 (30분)

- [ ]  Expo 프로젝트 생성 (`npx create-expo-app voice-resume-app`)
- [ ]  TypeScript 설정
- [ ]  NativeWind 설정
- [ ]  Expo Router 설정
- [ ]  필수 라이브러리 설치
    - [ ]  expo-speech
    - [ ]  expo-av
    - [ ]  @react-native-async-storage/async-storage
    - [ ]  expo-file-system
    - [ ]  expo-sharing
    - [ ]  react-native-admob-native-ads (또는 expo-ads-admob)
- [ ]  기본 폴더 구조 생성

### Phase 1: 핵심 컴포넌트 개발 (2시간)

- [ ]  **VoiceInput 컴포넌트** (가장 중요!)
    - [ ]  마이크 버튼 UI
    - [ ]  음성 녹음 기능
    - [ ]  음성-텍스트 변환 (STT)
    - [ ]  녹음 중 시각적 피드백
    - [ ]  재녹음 기능
    - [ ]  텍스트 수정 기능
- [ ]  **BigButton 컴포넌트**
    - [ ]  큰 터치 영역 (최소 80x80)
    - [ ]  명확한 라벨
    - [ ]  로딩 상태
- [ ]  **ResumeCard 컴포넌트**
    - [ ]  이력서 요약 표시
    - [ ]  액션 버튼 (보기/수정/삭제)
- [ ]  **ProgressBar 컴포넌트**
    - [ ]  6단계 진행도 표시

### Phase 2: 데이터 관리 (1시간)

- [ ]  **ResumeContext 설정**
    - [ ]  이력서 상태 관리
    - [ ]  CRUD 함수
- [ ]  **Storage 유틸리티**
    - [ ]  이력서 저장
    - [ ]  이력서 불러오기
    - [ ]  이력서 삭제
- [ ]  **타입 정의** (resume.ts)

### Phase 3: 화면 개발 (3시간)

- [ ]  **온보딩 화면** (index.tsx)
    - [ ]  스플래시
    - [ ]  사용 가이드 3페이지
    - [ ]  권한 요청
- [ ]  **홈 화면** (tabs/index.tsx)
    - [ ]  새 이력서 만들기 버튼
    - [ ]  내 이력서 보기 버튼
    - [ ]  하단 배너 광고
- [ ]  **이력서 작성 플로우** (create/step-*.tsx)
    - [ ]  Step 1: 기본 정보
    - [ ]  Step 2: 경력 사항
    - [ ]  Step 3: 보유 기술
    - [ ]  Step 4: 희망 직무
    - [ ]  Step 5: 근무 조건
    - [ ]  Step 6: 자기소개
    - [ ]  각 단계마다 진행도 표시
    - [ ]  이전/다음 버튼
- [ ]  **미리보기 화면** (preview.tsx)
    - [ ]  전체 이력서 렌더링
    - [ ]  수정/저장/공유 버튼
    - [ ]  저장 후 전면 광고
- [ ]  **내 이력서 목록** (tabs/my-resumes.tsx)
    - [ ]  이력서 카드 리스트
    - [ ]  삭제 확인 다이얼로그

### Phase 4: 부가 기능 (2시간)

- [ ]  **PDF 생성**
    - [ ]  pdfGenerator.ts 구현
    - [ ]  이력서 → PDF 변환
    - [ ]  저장 & 공유
- [ ]  **AdMob 통합**
    - [ ]  배너 광고 컴포넌트
    - [ ]  전면 광고 (Interstitial)
    - [ ]  광고 ID 설정
- [ ]  **공유 기능**
    - [ ]  텍스트 복사
    - [ ]  카카오톡 공유
    - [ ]  이메일 공유

### Phase 5: UX 개선 (1시간)

- [ ]  **스타일링**
    - [ ]  큰 글씨 적용 (18sp+)
    - [ ]  높은 대비 색상
    - [ ]  간격 조정
- [ ]  **피드백**
    - [ ]  로딩 인디케이터
    - [ ]  성공/에러 토스트
    - [ ]  확인 다이얼로그
- [ ]  **접근성**
    - [ ]  스크린 리더 지원
    - [ ]  키보드 네비게이션

### Phase 6: 테스트 & 최적화 (1시간)

- [ ]  실제 기기 테스트
- [ ]  음성 인식 정확도 테스트
- [ ]  광고 표시 테스트
- [ ]  버그 수정
- [ ]  성능 최적화

### Phase 7: 빌드 & 배포 준비 (30분)

- [ ]  앱 아이콘 & 스플래시 스크린
- [ ]  app.json 설정
- [ ]  EAS Build 설정 (선택)
- [ ]  개발 빌드 생성

---

## 🎯 오늘의 목표 (최소 기능)

### Must Have (필수)

1. ✅ 음성으로 6가지 정보 입력
2. ✅ 입력한 정보 미리보기
3. ✅ 이력서 저장 (로컬)
4. ✅ 저장된 이력서 목록 보기
5. ✅ AdMob 배너 광고 통합

### Nice to Have (시간 있으면)

1. PDF 내보내기
2. 공유 기능
3. 전면 광고
4. 이력서 수정 기능

### Future (다음에)

1. 음성 TTS (앱이 질문 읽어주기)
2. 이력서 템플릿 여러 개
3. 클라우드 동기화
4. 일자리 매칭 플랫폼 연동

---

## 💡 개발 팁

### 음성 인식 관련

- **Expo Speech Recognition**: Expo SDK 51+에서 사용 가능
- **대안**: `react-native-voice` 또는 Web Speech API
- **주의사항**:
    - 인터넷 연결 필요
    - 조용한 환경에서 테스트
    - 사용자에게 명확한 가이드 제공

### 광고 관련

- **AdMob 계정**: 구글 애드몹 가입 필요
- **테스트 ID**: 개발 중에는 테스트 광고 ID 사용
- **광고 배치**: 사용자 경험 해치지 않도록 주의
- **수익화**: 앱 출시 후 실제 광고 ID로 교체

### 사업자 없이 수익화

- **AdMob**: 사업자 없이도 가능 (개인 계정)
- **세금**: 연간 수익 일정 금액 이상 시 신고 필요
- **출금**: 은행 계좌만 있으면 가능
- **나중에**: 본격적인 사업 시 사업자 등록 권장

### 시니어 테스트

- 실제 타깃 사용자에게 테스트 필수
- 부모님, 친척 어르신들에게 사용해보기
- 피드백 적극 반영

---

## 📈 향후 확장 로드맵

### Version 1.1 (1개월 후)

- 이력서 템플릿 추가
- 음성 TTS (앱이 질문 읽어주기)
- 이력서 이메일 전송
- 통계 (조회수, 공유 횟수)

### Version 2.0 (3개월 후)

- 일자리 매칭 기능 추가
- 기업 구인공고 게시
- 간단한 채팅 (기업 ↔ 구직자)
- 프리미엄 템플릿 유료 판매

### Version 3.0 (6개월 후)

- AI 이력서 첨삭
- 면접 연습 (음성 기반)
- 커뮤니티 기능
- 교육 콘텐츠 제공

---

## 🚀 시작하기

1. **프로젝트 생성**
    
    ```bash
    npx create-expo-app voice-resume-app
    cd voice-resume-app
    
    ```
    
2. **필수 패키지 설치**
    
    ```bash
    npx expo install expo-speech expo-av @react-native-async-storage/async-storage
    npx expo install expo-file-system expo-sharing
    npm install nativewind
    npm install --save-dev tailwindcss
    
    ```
    
3. **개발 서버 실행**
    
    ```bash
    npx expo start
    
    ```
    
4. **기능 개발 시작**
    - TODO 리스트 순서대로 진행
    - 음성 입력 컴포넌트부터 시작 권장

---

## 📞 연락처 & 지원

- **개발 문의**: Claude Code를 통한 페어 프로그래밍
- **기술 지원**: Expo 공식 문서, React Native 커뮤니티
- **광고 관련**: Google AdMob 고객센터

---

## 📝 참고 자료

- [Expo Speech Recognition](https://docs.expo.dev/versions/latest/sdk/speech-recognition/)
- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Google AdMob 시작하기](https://admob.google.com/home/)
- [NativeWind 문서](https://www.nativewind.dev/)

---

**작성일**: 2025년 10월 23일

**목표 완성일**: 오늘!

**화이팅!** 💪

# 음성 이력서 앱 기획서

## Voice Resume App for Seniors (50+)

---

## 📋 프로젝트 개요

### 목적

50대 이상 디지털 취약계층이 복잡한 텍스트 입력 없이 음성으로 간편하게 이력서를 작성할 수 있는 모바일 앱

### 목표 사용자

- 50대 이상 중장년층
- 디지털 기기 사용에 어려움을 겪는 분들
- 재취업을 희망하는 어르신들

### 핵심 가치

- **간편성**: 음성으로 모든 정보 입력
- **접근성**: 큰 글씨, 명확한 UI, 간단한 네비게이션
- **실용성**: 즉시 사용 가능한 이력서 생성

---

## 🎯 MVP 핵심 기능 (1일 개발 목표)

### 1. 온보딩 & 기본 설정

- 앱 소개 화면 (큰 글씨, 간단한 설명)
- 필수 권한 요청 (마이크, 저장소)
- 간단한 사용 가이드

### 2. 음성 이력서 작성

**필수 입력 항목** (6개 섹션)

1. **기본 정보**
    - 이름, 나이, 연락처
    - 음성 입력 → 텍스트 변환
2. **경력 사항**
    - "어떤 일을 하셨나요?" 질문
    - 자유 발화 → 텍스트 저장
3. **보유 기술/자격증**
    - "어떤 기술이나 자격증이 있으신가요?"
    - 음성 입력
4. **희망 직무**
    - "어떤 일을 하고 싶으신가요?"
    - 음성 입력
5. **근무 조건**
    - "언제, 어디서 일하고 싶으신가요?"
    - 시간대, 지역 등
6. **자기소개**
    - "자신에 대해 자유롭게 말씀해주세요"
    - 음성 입력

**음성 입력 플로우**

- 큰 마이크 버튼
- 녹음 중 시각적 피드백 (파형, 타이머)
- 재녹음 옵션
- 입력된 텍스트 실시간 표시
- 수정 버튼 (음성 재입력 또는 간단한 텍스트 수정)

### 3. 이력서 미리보기

- 입력한 모든 정보를 보기 좋게 정리
- 큰 글씨로 표시
- 섹션별 구분

### 4. 이력서 저장 & 공유

- 로컬 저장 (AsyncStorage)
- PDF 내보내기
- 텍스트 복사
- 공유 기능 (카카오톡, 이메일 등)

### 5. 내 이력서 관리

- 저장된 이력서 목록
- 수정하기
- 삭제하기

---

## 💰 수익 모델

### Phase 1: 사업자 없이 가능한 수익화

**Google AdMob 광고**

- 배너 광고: 하단 고정
- 전면 광고 (Interstitial):
    - 이력서 저장 완료 후
    - **PDF 변환 중** (로딩 화면과 함께)
- 보상형 광고: PDF 고급 템플릿 제공 (선택)

**광고 배치 전략**

- 사용자 경험 최소 방해
- 이력서 작성 중에는 광고 없음
- 미리보기/목록 화면에만 배너 광고
- **PDF 변환 시**: 로딩 인디케이터 표시 → 전면 광고 노출 → PDF 생성 완료
- 광고 시청 시간 = PDF 생성 시간으로 자연스러운 UX

### Phase 2: 향후 확장 (사업자 등록 후)

- 프리미엄 이력서 템플릿 판매
- 일자리 매칭 플랫폼 전환 시 수수료
- 기업 구인 광고 게재
- 이력서 컨설팅 서비스

---

## 🎨 UI/UX 디자인 원칙

### 시니어 친화적 디자인

1. **큰 글씨**: 최소 18sp 이상
2. **높은 대비**: 검정/흰색 기반
3. **큰 터치 영역**: 버튼 최소 60x60
4. **간단한 네비게이션**: 최대 3단계
5. **명확한 안내**: 각 단계마다 설명 제공
6. **에러 방지**: 확인 단계 추가

### 색상 팔레트

- Primary: #2563EB (파란색 - 신뢰감)
- Secondary: #10B981 (녹색 - 긍정)
- Background: #FFFFFF (흰색)
- Text: #1F2937 (진한 회색)
- Accent: #F59E0B (주황색 - 강조)

---

## 🛠 기술 스택

### Frontend

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router
- **State Management**: React Hooks (useState, useContext)

### Core Libraries

```json
{
  "expo-speech": "음성 합성 (TTS)",
  "expo-av": "오디오 녹음",
  "expo-file-system": "파일 저장",
  "expo-sharing": "공유 기능",
  "react-native-pdf": "PDF 생성",
  "@react-native-async-storage/async-storage": "로컬 저장",
  "expo-speech-recognition": "음성 인식 (STT)",
  "react-native-admob": "광고"
}

```

### API & Services

- **음성 인식**: Expo Speech Recognition (또는 Web Speech API fallback)
- **광고**: Google AdMob
- **저장소**: AsyncStorage (로컬)

---

## 📱 화면 구조

### 1. 스플래시/온보딩 (Splash/Onboarding)

```
/app/index.tsx
├── 앱 로고 & 소개
├── 사용 방법 간단 설명 (3페이지)
└── 시작하기 버튼

```

### 2. 홈 화면 (Home)

```
/app/(tabs)/index.tsx
├── "새 이력서 만들기" 큰 버튼
├── "내 이력서 보기" 버튼
└── 하단 배너 광고

```

### 3. 이력서 작성 플로우 (Create Resume)

```
/app/create/
├── step-1.tsx - 기본 정보
├── step-2.tsx - 경력 사항
├── step-3.tsx - 보유 기술
├── step-4.tsx - 희망 직무
├── step-5.tsx - 근무 조건
└── step-6.tsx - 자기소개

```

### 4. 이력서 미리보기 (Preview)

```
/app/preview.tsx
├── 전체 이력서 내용
├── 수정/저장/공유 버튼
└── 전면 광고 (저장 후)

```

### 5. 내 이력서 목록 (My Resumes)

```
/app/(tabs)/my-resumes.tsx
├── 저장된 이력서 카드 리스트
├── 각 이력서: 보기/수정/삭제
└── 하단 배너 광고

```

---

## 🗂 프로젝트 구조

```
voice-resume-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # 홈
│   │   └── my-resumes.tsx     # 내 이력서
│   ├── create/
│   │   ├── _layout.tsx
│   │   ├── step-1.tsx
│   │   ├── step-2.tsx
│   │   ├── step-3.tsx
│   │   ├── step-4.tsx
│   │   ├── step-5.tsx
│   │   └── step-6.tsx
│   ├── preview.tsx
│   ├── _layout.tsx
│   └── index.tsx              # 스플래시/온보딩
├── components/
│   ├── VoiceInput.tsx         # 음성 입력 컴포넌트
│   ├── ResumeCard.tsx         # 이력서 카드
│   ├── BigButton.tsx          # 큰 버튼
│   ├── AdBanner.tsx           # 배너 광고
│   ├── InterstitialAd.tsx     # 전면 광고 (PDF 변환 시 사용)
│   ├── LoadingWithAd.tsx      # 로딩 + 광고 모달
│   └── ProgressBar.tsx        # 진행도 표시
├── contexts/
│   └── ResumeContext.tsx      # 이력서 데이터 관리
├── utils/
│   ├── storage.ts             # AsyncStorage 헬퍼
│   ├── pdfGenerator.ts        # PDF 생성
│   └── speechRecognition.ts   # 음성 인식 헬퍼
├── types/
│   └── resume.ts              # TypeScript 타입 정의
├── constants/
│   └── styles.ts              # 공통 스타일 상수
├── app.json
├── package.json
├── tsconfig.json
└── tailwind.config.js

```

---

## 📊 데이터 모델

```tsx
interface Resume {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  basicInfo: {
    name: string;
    age: number;
    phone: string;
    email?: string;
  };
  experience: string;
  skills: string;
  desiredJob: string;
  workConditions: {
    location: string;
    time: string;
    type: string; // 정규직, 계약직, 파트타임 등
  };
  introduction: string;
}

```

---

## ✅ TODO LIST (우선순위 순)

### Phase 0: 프로젝트 초기 설정 (30분)

- [ ]  Expo 프로젝트 생성 (`npx create-expo-app voice-resume-app`)
- [ ]  TypeScript 설정
- [ ]  NativeWind 설정
- [ ]  Expo Router 설정
- [ ]  필수 라이브러리 설치
    - [ ]  expo-speech
    - [ ]  expo-av
    - [ ]  @react-native-async-storage/async-storage
    - [ ]  expo-file-system
    - [ ]  expo-sharing
    - [ ]  react-native-admob-native-ads (또는 expo-ads-admob)
- [ ]  기본 폴더 구조 생성

### Phase 1: 핵심 컴포넌트 개발 (2시간)

- [ ]  **VoiceInput 컴포넌트** (가장 중요!)
    - [ ]  마이크 버튼 UI
    - [ ]  음성 녹음 기능
    - [ ]  음성-텍스트 변환 (STT)
    - [ ]  녹음 중 시각적 피드백
    - [ ]  재녹음 기능
    - [ ]  텍스트 수정 기능
- [ ]  **BigButton 컴포넌트**
    - [ ]  큰 터치 영역 (최소 80x80)
    - [ ]  명확한 라벨
    - [ ]  로딩 상태
- [ ]  **ResumeCard 컴포넌트**
    - [ ]  이력서 요약 표시
    - [ ]  액션 버튼 (보기/수정/삭제)
- [ ]  **ProgressBar 컴포넌트**
    - [ ]  6단계 진행도 표시

### Phase 2: 데이터 관리 (1시간)

- [ ]  **ResumeContext 설정**
    - [ ]  이력서 상태 관리
    - [ ]  CRUD 함수
- [ ]  **Storage 유틸리티**
    - [ ]  이력서 저장
    - [ ]  이력서 불러오기
    - [ ]  이력서 삭제
- [ ]  **타입 정의** (resume.ts)

### Phase 3: 화면 개발 (3시간)

- [ ]  **온보딩 화면** (index.tsx)
    - [ ]  스플래시
    - [ ]  사용 가이드 3페이지
    - [ ]  권한 요청
- [ ]  **홈 화면** (tabs/index.tsx)
    - [ ]  새 이력서 만들기 버튼
    - [ ]  내 이력서 보기 버튼
    - [ ]  하단 배너 광고
- [ ]  **이력서 작성 플로우** (create/step-*.tsx)
    - [ ]  Step 1: 기본 정보
    - [ ]  Step 2: 경력 사항
    - [ ]  Step 3: 보유 기술
    - [ ]  Step 4: 희망 직무
    - [ ]  Step 5: 근무 조건
    - [ ]  Step 6: 자기소개
    - [ ]  각 단계마다 진행도 표시
    - [ ]  이전/다음 버튼
- [ ]  **미리보기 화면** (preview.tsx)
    - [ ]  전체 이력서 렌더링
    - [ ]  수정/저장/공유 버튼
    - [ ]  저장 후 전면 광고
- [ ]  **내 이력서 목록** (tabs/my-resumes.tsx)
    - [ ]  이력서 카드 리스트
    - [ ]  삭제 확인 다이얼로그

### Phase 4: 부가 기능 (2시간)

- [ ]  **PDF 생성**
    - [ ]  pdfGenerator.ts 구현
    - [ ]  이력서 → PDF 변환
    - [ ]  **PDF 변환 플로우**
        - [ ]  "PDF로 저장하기" 버튼 클릭
        - [ ]  로딩 모달 표시 ("PDF 생성 중...")
        - [ ]  전면 광고 로드 & 표시
        - [ ]  광고 표시 중 백그라운드에서 PDF 생성
        - [ ]  PDF 생성 완료 후 광고 닫기
        - [ ]  성공 메시지 & 공유 옵션
    - [ ]  저장 & 공유
- [ ]  **AdMob 통합**
    - [ ]  배너 광고 컴포넌트
    - [ ]  전면 광고 (Interstitial)
        - [ ]  이력서 저장 후
        - [ ]  **PDF 변환 중** (우선순위 높음)
    - [ ]  광고 프리로딩 (미리 로드해서 즉시 표시)
    - [ ]  광고 ID 설정
- [ ]  **공유 기능**
    - [ ]  텍스트 복사
    - [ ]  카카오톡 공유
    - [ ]  이메일 공유

### Phase 5: UX 개선 (1시간)

- [ ]  **스타일링**
    - [ ]  큰 글씨 적용 (18sp+)
    - [ ]  높은 대비 색상
    - [ ]  간격 조정
- [ ]  **피드백**
    - [ ]  로딩 인디케이터
    - [ ]  성공/에러 토스트
    - [ ]  확인 다이얼로그
- [ ]  **접근성**
    - [ ]  스크린 리더 지원
    - [ ]  키보드 네비게이션

### Phase 6: 테스트 & 최적화 (1시간)

- [ ]  실제 기기 테스트
- [ ]  음성 인식 정확도 테스트
- [ ]  광고 표시 테스트
- [ ]  버그 수정
- [ ]  성능 최적화

### Phase 7: 빌드 & 배포 준비 (30분)

- [ ]  앱 아이콘 & 스플래시 스크린
- [ ]  app.json 설정
- [ ]  EAS Build 설정 (선택)
- [ ]  개발 빌드 생성

---

## 🎯 오늘의 목표 (최소 기능)

### Must Have (필수)

1. ✅ 음성으로 6가지 정보 입력
2. ✅ 입력한 정보 미리보기
3. ✅ 이력서 저장 (로컬)
4. ✅ 저장된 이력서 목록 보기
5. ✅ AdMob 배너 광고 통합

### Nice to Have (시간 있으면)

1. PDF 내보내기
2. 공유 기능
3. 전면 광고
4. 이력서 수정 기능

### Future (다음에)

1. 음성 TTS (앱이 질문 읽어주기)
2. 이력서 템플릿 여러 개
3. 클라우드 동기화
4. 일자리 매칭 플랫폼 연동

---

## 💡 개발 팁

### 음성 인식 관련

- **Expo Speech Recognition**: Expo SDK 51+에서 사용 가능
- **대안**: `react-native-voice` 또는 Web Speech API
- **주의사항**:
    - 인터넷 연결 필요
    - 조용한 환경에서 테스트
    - 사용자에게 명확한 가이드 제공

### 광고 관련

- **AdMob 계정**: 구글 애드몹 가입 필요
- **테스트 ID**: 개발 중에는 테스트 광고 ID 사용
- **광고 배치**: 사용자 경험 해치지 않도록 주의
- **수익화**: 앱 출시 후 실제 광고 ID로 교체
- **PDF 변환 광고 구현**:
    
    ```tsx
    // PDF 생성 플로우 예시const generatePDF = async () => {  setLoading(true); // 로딩 시작    // 1. 전면 광고 프리로드  await interstitialAd.load();    // 2. 광고 표시  await interstitialAd.show();    // 3. 광고 표시 중 PDF 생성 (비동기)  const pdfUri = await createPDFFromResume(resumeData);    // 4. 광고 종료 후 완료 처리  setLoading(false);  showSuccessToast('PDF가 생성되었습니다!');  shareFile(pdfUri);};
    
    ```
    
- **주의사항**:
    - 광고 로드 실패 시에도 PDF는 정상 생성되어야 함
    - 광고 프리로딩으로 대기 시간 최소화
    - PDF 생성 시간이 짧으면 (1-2초) 광고 스킵 고려

### 사업자 없이 수익화

- **AdMob**: 사업자 없이도 가능 (개인 계정)
- **세금**: 연간 수익 일정 금액 이상 시 신고 필요
- **출금**: 은행 계좌만 있으면 가능
- **나중에**: 본격적인 사업 시 사업자 등록 권장

### 시니어 테스트

- 실제 타깃 사용자에게 테스트 필수
- 부모님, 친척 어르신들에게 사용해보기
- 피드백 적극 반영

---

## 📈 향후 확장 로드맵

### Version 1.1 (1개월 후)

- 이력서 템플릿 추가
- 음성 TTS (앱이 질문 읽어주기)
- 이력서 이메일 전송
- 통계 (조회수, 공유 횟수)

### Version 2.0 (3개월 후)

- 일자리 매칭 기능 추가
- 기업 구인공고 게시
- 간단한 채팅 (기업 ↔ 구직자)
- 프리미엄 템플릿 유료 판매

### Version 3.0 (6개월 후)

- AI 이력서 첨삭
- 면접 연습 (음성 기반)
- 커뮤니티 기능
- 교육 콘텐츠 제공

---

## 🚀 시작하기

1. **프로젝트 생성**
    
    ```bash
    npx create-expo-app voice-resume-app
    cd voice-resume-app
    
    ```
    
2. **필수 패키지 설치**
    
    ```bash
    npx expo install expo-speech expo-av @react-native-async-storage/async-storage
    npx expo install expo-file-system expo-sharing
    npm install nativewind
    npm install --save-dev tailwindcss
    
    ```
    
3. **개발 서버 실행**
    
    ```bash
    npx expo start
    
    ```
    
4. **기능 개발 시작**
    - TODO 리스트 순서대로 진행
    - 음성 입력 컴포넌트부터 시작 권장

---

## 📞 연락처 & 지원

- **개발 문의**: Claude Code를 통한 페어 프로그래밍
- **기술 지원**: Expo 공식 문서, React Native 커뮤니티
- **광고 관련**: Google AdMob 고객센터

---

## 📝 참고 자료

- [Expo Speech Recognition](https://docs.expo.dev/versions/latest/sdk/speech-recognition/)
- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Google AdMob 시작하기](https://admob.google.com/home/)
- [NativeWind 문서](https://www.nativewind.dev/)

---

**작성일**: 2025년 10월 23일

**목표 완성일**: 오늘!

**화이팅!** 💪

# 음성 이력서 앱 기획서

## Voice Resume App for Seniors (50+)

---

## 📋 프로젝트 개요

### 목적

50대 이상 디지털 취약계층이 복잡한 텍스트 입력 없이 음성으로 간편하게 이력서를 작성할 수 있는 모바일 앱

### 목표 사용자

- 50대 이상 중장년층
- 디지털 기기 사용에 어려움을 겪는 분들
- 재취업을 희망하는 어르신들

### 핵심 가치

- **간편성**: 음성으로 모든 정보 입력
- **접근성**: 큰 글씨, 명확한 UI, 간단한 네비게이션
- **실용성**: 즉시 사용 가능한 이력서 생성

### 💡 차별화 포인트

**"말하는 이력서" 콘셉트**

- 텍스트로 표현하기 어려운 성격, 열정, 진정성을 음성/영상으로 전달
- 글쓰기에 익숙하지 않은 어르신들도 자신있게 이력서 작성
- 고용주 입장에서도 더 생생한 지원자 정보 확인 가능

**향후 비전: 영상 이력서 플랫폼**

- 1분 자기소개 영상을 텍스트 이력서와 함께 제공
- "사람됨"과 "진정성"을 영상으로 어필
- 50대 이상의 경험과 노하우를 영상으로 효과적으로 전달
- 기업 입장에서 빠른 1차 서류 심사 가능

---

## 🎯 MVP 핵심 기능 (1일 개발 목표)

### 1. 온보딩 & 기본 설정

- 앱 소개 화면 (큰 글씨, 간단한 설명)
- 필수 권한 요청 (마이크, 저장소)
- 간단한 사용 가이드

### 2. 음성 이력서 작성

**필수 입력 항목** (6개 섹션)

1. **기본 정보**
    - 이름, 나이, 연락처
    - 음성 입력 → 텍스트 변환
2. **경력 사항**
    - "어떤 일을 하셨나요?" 질문
    - 자유 발화 → 텍스트 저장
3. **보유 기술/자격증**
    - "어떤 기술이나 자격증이 있으신가요?"
    - 음성 입력
4. **희망 직무**
    - "어떤 일을 하고 싶으신가요?"
    - 음성 입력
5. **근무 조건**
    - "언제, 어디서 일하고 싶으신가요?"
    - 시간대, 지역 등
6. **자기소개**
    - "자신에 대해 자유롭게 말씀해주세요"
    - 음성 입력

**음성 입력 플로우**

- 큰 마이크 버튼
- 녹음 중 시각적 피드백 (파형, 타이머)
- 재녹음 옵션
- 입력된 텍스트 실시간 표시
- 수정 버튼 (음성 재입력 또는 간단한 텍스트 수정)

### 3. 이력서 미리보기

- 입력한 모든 정보를 보기 좋게 정리
- 큰 글씨로 표시
- 섹션별 구분

### 4. 이력서 저장 & 공유

- 로컬 저장 (AsyncStorage)
- PDF 내보내기
- 텍스트 복사
- 공유 기능 (카카오톡, 이메일 등)

### 5. 내 이력서 관리

- 저장된 이력서 목록
- 수정하기
- 삭제하기

---

## 💰 수익 모델

### Phase 1: 사업자 없이 가능한 수익화

**Google AdMob 광고**

- 배너 광고: 하단 고정
- 전면 광고 (Interstitial):
    - 이력서 저장 완료 후
    - **PDF 변환 중** (로딩 화면과 함께)
- 보상형 광고: PDF 고급 템플릿 제공 (선택)

**광고 배치 전략**

- 사용자 경험 최소 방해
- 이력서 작성 중에는 광고 없음
- 미리보기/목록 화면에만 배너 광고
- **PDF 변환 시**: 로딩 인디케이터 표시 → 전면 광고 노출 → PDF 생성 완료
- 광고 시청 시간 = PDF 생성 시간으로 자연스러운 UX

### Phase 2: 향후 확장 (사업자 등록 후)

- 프리미엄 이력서 템플릿 판매
- 일자리 매칭 플랫폼 전환 시 수수료
- 기업 구인 광고 게재
- 이력서 컨설팅 서비스

---

## 🎨 UI/UX 디자인 원칙

### 시니어 친화적 디자인

1. **큰 글씨**: 최소 18sp 이상
2. **높은 대비**: 검정/흰색 기반
3. **큰 터치 영역**: 버튼 최소 60x60
4. **간단한 네비게이션**: 최대 3단계
5. **명확한 안내**: 각 단계마다 설명 제공
6. **에러 방지**: 확인 단계 추가

### 색상 팔레트

- Primary: #2563EB (파란색 - 신뢰감)
- Secondary: #10B981 (녹색 - 긍정)
- Background: #FFFFFF (흰색)
- Text: #1F2937 (진한 회색)
- Accent: #F59E0B (주황색 - 강조)

---

## 🛠 기술 스택

### Frontend

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router
- **State Management**: React Hooks (useState, useContext)

### Core Libraries

```json
{
  "expo-speech": "음성 합성 (TTS)",
  "expo-av": "오디오 녹음",
  "expo-file-system": "파일 저장",
  "expo-sharing": "공유 기능",
  "react-native-pdf": "PDF 생성",
  "@react-native-async-storage/async-storage": "로컬 저장",
  "expo-speech-recognition": "음성 인식 (STT)",
  "react-native-admob": "광고"
}

```

### API & Services

- **음성 인식**: Expo Speech Recognition (또는 Web Speech API fallback)
- **광고**: Google AdMob
- **저장소**: AsyncStorage (로컬)

---

## 📱 화면 구조

### 1. 스플래시/온보딩 (Splash/Onboarding)

```
/app/index.tsx
├── 앱 로고 & 소개
├── 사용 방법 간단 설명 (3페이지)
└── 시작하기 버튼

```

### 2. 홈 화면 (Home)

```
/app/(tabs)/index.tsx
├── "새 이력서 만들기" 큰 버튼
├── "내 이력서 보기" 버튼
└── 하단 배너 광고

```

### 3. 이력서 작성 플로우 (Create Resume)

```
/app/create/
├── step-1.tsx - 기본 정보
├── step-2.tsx - 경력 사항
├── step-3.tsx - 보유 기술
├── step-4.tsx - 희망 직무
├── step-5.tsx - 근무 조건
└── step-6.tsx - 자기소개

```

### 4. 이력서 미리보기 (Preview)

```
/app/preview.tsx
├── 전체 이력서 내용
├── 수정/저장/공유 버튼
└── 전면 광고 (저장 후)

```

### 5. 내 이력서 목록 (My Resumes)

```
/app/(tabs)/my-resumes.tsx
├── 저장된 이력서 카드 리스트
├── 각 이력서: 보기/수정/삭제
└── 하단 배너 광고

```

---

## 🗂 프로젝트 구조

```
voice-resume-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # 홈
│   │   └── my-resumes.tsx     # 내 이력서
│   ├── create/
│   │   ├── _layout.tsx
│   │   ├── step-1.tsx
│   │   ├── step-2.tsx
│   │   ├── step-3.tsx
│   │   ├── step-4.tsx
│   │   ├── step-5.tsx
│   │   └── step-6.tsx
│   ├── preview.tsx
│   ├── _layout.tsx
│   └── index.tsx              # 스플래시/온보딩
├── components/
│   ├── VoiceInput.tsx         # 음성 입력 컴포넌트
│   ├── ResumeCard.tsx         # 이력서 카드
│   ├── BigButton.tsx          # 큰 버튼
│   ├── AdBanner.tsx           # 배너 광고
│   ├── InterstitialAd.tsx     # 전면 광고 (PDF 변환 시 사용)
│   ├── LoadingWithAd.tsx      # 로딩 + 광고 모달
│   └── ProgressBar.tsx        # 진행도 표시
├── contexts/
│   └── ResumeContext.tsx      # 이력서 데이터 관리
├── utils/
│   ├── storage.ts             # AsyncStorage 헬퍼
│   ├── pdfGenerator.ts        # PDF 생성
│   └── speechRecognition.ts   # 음성 인식 헬퍼
├── types/
│   └── resume.ts              # TypeScript 타입 정의
├── constants/
│   └── styles.ts              # 공통 스타일 상수
├── app.json
├── package.json
├── tsconfig.json
└── tailwind.config.js

```

---

## 📊 데이터 모델

```tsx
interface Resume {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  basicInfo: {
    name: string;
    age: number;
    phone: string;
    email?: string;
  };
  experience: string;
  skills: string;
  desiredJob: string;
  workConditions: {
    location: string;
    time: string;
    type: string; // 정규직, 계약직, 파트타임 등
  };
  introduction: string;
}

```

---

## ✅ TODO LIST (우선순위 순)

### Phase 0: 프로젝트 초기 설정 (30분)

- [ ]  Expo 프로젝트 생성 (`npx create-expo-app voice-resume-app`)
- [ ]  TypeScript 설정
- [ ]  NativeWind 설정
- [ ]  Expo Router 설정
- [ ]  필수 라이브러리 설치
    - [ ]  expo-speech
    - [ ]  expo-av
    - [ ]  @react-native-async-storage/async-storage
    - [ ]  expo-file-system
    - [ ]  expo-sharing
    - [ ]  react-native-admob-native-ads (또는 expo-ads-admob)
- [ ]  기본 폴더 구조 생성

### Phase 1: 핵심 컴포넌트 개발 (2시간)

- [ ]  **VoiceInput 컴포넌트** (가장 중요!)
    - [ ]  마이크 버튼 UI
    - [ ]  음성 녹음 기능
    - [ ]  음성-텍스트 변환 (STT)
    - [ ]  녹음 중 시각적 피드백
    - [ ]  재녹음 기능
    - [ ]  텍스트 수정 기능
- [ ]  **BigButton 컴포넌트**
    - [ ]  큰 터치 영역 (최소 80x80)
    - [ ]  명확한 라벨
    - [ ]  로딩 상태
- [ ]  **ResumeCard 컴포넌트**
    - [ ]  이력서 요약 표시
    - [ ]  액션 버튼 (보기/수정/삭제)
- [ ]  **ProgressBar 컴포넌트**
    - [ ]  6단계 진행도 표시

### Phase 2: 데이터 관리 (1시간)

- [ ]  **ResumeContext 설정**
    - [ ]  이력서 상태 관리
    - [ ]  CRUD 함수
- [ ]  **Storage 유틸리티**
    - [ ]  이력서 저장
    - [ ]  이력서 불러오기
    - [ ]  이력서 삭제
- [ ]  **타입 정의** (resume.ts)

### Phase 3: 화면 개발 (3시간)

- [ ]  **온보딩 화면** (index.tsx)
    - [ ]  스플래시
    - [ ]  사용 가이드 3페이지
    - [ ]  권한 요청
- [ ]  **홈 화면** (tabs/index.tsx)
    - [ ]  새 이력서 만들기 버튼
    - [ ]  내 이력서 보기 버튼
    - [ ]  하단 배너 광고
- [ ]  **이력서 작성 플로우** (create/step-*.tsx)
    - [ ]  Step 1: 기본 정보
    - [ ]  Step 2: 경력 사항
    - [ ]  Step 3: 보유 기술
    - [ ]  Step 4: 희망 직무
    - [ ]  Step 5: 근무 조건
    - [ ]  Step 6: 자기소개
    - [ ]  각 단계마다 진행도 표시
    - [ ]  이전/다음 버튼
- [ ]  **미리보기 화면** (preview.tsx)
    - [ ]  전체 이력서 렌더링
    - [ ]  수정/저장/공유 버튼
    - [ ]  저장 후 전면 광고
- [ ]  **내 이력서 목록** (tabs/my-resumes.tsx)
    - [ ]  이력서 카드 리스트
    - [ ]  삭제 확인 다이얼로그

### Phase 4: 부가 기능 (2시간)

- [ ]  **PDF 생성**
    - [ ]  pdfGenerator.ts 구현
    - [ ]  이력서 → PDF 변환
    - [ ]  **PDF 변환 플로우**
        - [ ]  "PDF로 저장하기" 버튼 클릭
        - [ ]  로딩 모달 표시 ("PDF 생성 중...")
        - [ ]  전면 광고 로드 & 표시
        - [ ]  광고 표시 중 백그라운드에서 PDF 생성
        - [ ]  PDF 생성 완료 후 광고 닫기
        - [ ]  성공 메시지 & 공유 옵션
    - [ ]  저장 & 공유
- [ ]  **AdMob 통합**
    - [ ]  배너 광고 컴포넌트
    - [ ]  전면 광고 (Interstitial)
        - [ ]  이력서 저장 후
        - [ ]  **PDF 변환 중** (우선순위 높음)
    - [ ]  광고 프리로딩 (미리 로드해서 즉시 표시)
    - [ ]  광고 ID 설정
- [ ]  **공유 기능**
    - [ ]  텍스트 복사
    - [ ]  카카오톡 공유
    - [ ]  이메일 공유

### Phase 5: UX 개선 (1시간)

- [ ]  **스타일링**
    - [ ]  큰 글씨 적용 (18sp+)
    - [ ]  높은 대비 색상
    - [ ]  간격 조정
- [ ]  **피드백**
    - [ ]  로딩 인디케이터
    - [ ]  성공/에러 토스트
    - [ ]  확인 다이얼로그
- [ ]  **접근성**
    - [ ]  스크린 리더 지원
    - [ ]  키보드 네비게이션

### Phase 6: 테스트 & 최적화 (1시간)

- [ ]  실제 기기 테스트
- [ ]  음성 인식 정확도 테스트
- [ ]  광고 표시 테스트
- [ ]  버그 수정
- [ ]  성능 최적화

### Phase 7: 빌드 & 배포 준비 (30분)

- [ ]  앱 아이콘 & 스플래시 스크린
- [ ]  app.json 설정
- [ ]  EAS Build 설정 (선택)
- [ ]  개발 빌드 생성

---

## 🎯 오늘의 목표 (최소 기능)

### Must Have (필수)

1. ✅ 음성으로 6가지 정보 입력
2. ✅ 입력한 정보 미리보기
3. ✅ 이력서 저장 (로컬)
4. ✅ 저장된 이력서 목록 보기
5. ✅ AdMob 배너 광고 통합

### Nice to Have (시간 있으면)

1. PDF 내보내기
2. 공유 기능
3. 전면 광고
4. 이력서 수정 기능

### Future (다음에)

1. 음성 TTS (앱이 질문 읽어주기)
2. 이력서 템플릿 여러 개
3. 클라우드 동기화
4. **🎥 영상 이력서 (1분 자기소개 영상)**
5. 일자리 매칭 플랫폼 연동

---

## 💡 개발 팁

### 음성 인식 관련

- **Expo Speech Recognition**: Expo SDK 51+에서 사용 가능
- **대안**: `react-native-voice` 또는 Web Speech API
- **주의사항**:
    - 인터넷 연결 필요
    - 조용한 환경에서 테스트
    - 사용자에게 명확한 가이드 제공

### 광고 관련

- **AdMob 계정**: 구글 애드몹 가입 필요
- **테스트 ID**: 개발 중에는 테스트 광고 ID 사용
- **광고 배치**: 사용자 경험 해치지 않도록 주의
- **수익화**: 앱 출시 후 실제 광고 ID로 교체
- **PDF 변환 광고 구현**:
    
    ```tsx
    // PDF 생성 플로우 예시const generatePDF = async () => {  setLoading(true); // 로딩 시작    // 1. 전면 광고 프리로드  await interstitialAd.load();    // 2. 광고 표시  await interstitialAd.show();    // 3. 광고 표시 중 PDF 생성 (비동기)  const pdfUri = await createPDFFromResume(resumeData);    // 4. 광고 종료 후 완료 처리  setLoading(false);  showSuccessToast('PDF가 생성되었습니다!');  shareFile(pdfUri);};
    
    ```
    
- **주의사항**:
    - 광고 로드 실패 시에도 PDF는 정상 생성되어야 함
    - 광고 프리로딩으로 대기 시간 최소화
    - PDF 생성 시간이 짧으면 (1-2초) 광고 스킵 고려

### 사업자 없이 수익화

- **AdMob**: 사업자 없이도 가능 (개인 계정)
- **세금**: 연간 수익 일정 금액 이상 시 신고 필요
- **출금**: 은행 계좌만 있으면 가능
- **나중에**: 본격적인 사업 시 사업자 등록 권장

### 시니어 테스트

- 실제 타깃 사용자에게 테스트 필수
- 부모님, 친척 어르신들에게 사용해보기
- 피드백 적극 반영

---

## 📈 향후 확장 로드맵

### Version 1.1 (1개월 후)

- 이력서 템플릿 추가
- 음성 TTS (앱이 질문 읽어주기)
- 이력서 이메일 전송
- 통계 (조회수, 공유 횟수)

### Version 1.5 (2개월 후) - 🎥 영상 이력서 기능

**핵심 개념**: 1분 자기소개 영상을 텍스트 이력서와 함께 전송

**주요 기능**

- **영상 녹화** (1분 제한)
    - 간단한 가이드라인 제공
    - "자신을 소개해주세요" 프롬프트
    - 실시간 타이머 표시
    - 재녹화 가능
- **영상 미리보기**
    - 녹화한 영상 재생
    - 간단한 편집 (트리밍)
- **영상 + 텍스트 이력서 패키지**
    - PDF 이력서에 영상 링크 QR코드 삽입
    - 또는 영상 파일을 함께 공유
- **영상 저장 & 관리**
    - 로컬 저장 또는 클라우드 업로드
    - 여러 버전 관리 가능

**기술 스택**

- `expo-camera`: 영상 녹화
- `expo-av`: 영상 재생
- `expo-video-thumbnails`: 썸네일 생성
- 클라우드 스토리지 (Firebase Storage 또는 AWS S3)

**UX 고려사항**

- 큰 녹화 버튼, 명확한 안내
- "좋은 영상 이력서 만들기" 가이드 제공
    - 밝은 곳에서 촬영
    - 카메라를 정면으로
    - 또렷하게 말하기
- 프라이버시 설정 (공개/비공개)

**수익 모델 확장**

- 기본 영상 이력서: 무료 (광고 포함)
- 프리미엄 기능 (유료):
    - 3분 영상 허용
    - 광고 제거
    - 전문 템플릿 배경 추가
    - 자막 자동 생성
    - 영상 용량 무제한

**광고 전략**

- 영상 업로드 중 전면 광고
- 영상 처리 중 (압축, 업로드) 광고 노출

### Version 2.0 (3-4개월 후) - 일자리 매칭 플랫폼

- 일자리 매칭 기능 추가
- 기업 구인공고 게시
- **영상 이력서 기반 매칭**
    - 기업이 영상 이력서 열람
    - 더 빠른 서류 심사
    - "영상 먼저 보기" 필터
- 간단한 채팅 (기업 ↔ 구직자)
- 프리미엄 템플릿 유료 판매

**플랫폼 수익 모델**

- 기업 구인공고 게재료
- 프리미엄 구직자 프로필 (상단 노출)
- 매칭 성공 수수료
- 영상 이력서 프리미엄 업그레이드

### Version 3.0 (6개월 후)

- AI 이력서 첨삭
- **AI 영상 분석**
    - 말하기 속도, 명확성 분석
    - 표정, 제스처 피드백
    - 개선 제안
- **AI 면접 연습** (음성 + 영상 기반)
    - 모의 면접 질문
    - 실시간 피드백
    - 면접 영상 분석
- 커뮤니티 기능
- 교육 콘텐츠 제공

---

## 🚀 시작하기

1. **프로젝트 생성**
    
    ```bash
    npx create-expo-app voice-resume-app
    cd voice-resume-app
    
    ```
    
2. **필수 패키지 설치**
    
    ```bash
    npx expo install expo-speech expo-av @react-native-async-storage/async-storage
    npx expo install expo-file-system expo-sharing
    npm install nativewind
    npm install --save-dev tailwindcss
    
    ```
    
3. **개발 서버 실행**
    
    ```bash
    npx expo start
    
    ```
    
4. **기능 개발 시작**
    - TODO 리스트 순서대로 진행
    - 음성 입력 컴포넌트부터 시작 권장

---

## 📞 연락처 & 지원

- **개발 문의**: Claude Code를 통한 페어 프로그래밍
- **기술 지원**: Expo 공식 문서, React Native 커뮤니티
- **광고 관련**: Google AdMob 고객센터

---

## 📝 참고 자료

- [Expo Speech Recognition](https://docs.expo.dev/versions/latest/sdk/speech-recognition/)
- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Google AdMob 시작하기](https://admob.google.com/home/)
- [NativeWind 문서](https://www.nativewind.dev/)

---

**작성일**: 2025년 10월 23일

**목표 완성일**: 오늘!

**화이팅!** 💪


# 🎉 레쥬미 MVP 구현 완료 요약

**날짜:** 2025-10-23
**상태:** Step-2 AI 파싱 + PDF 생성 완료

---

## ✅ 완료된 주요 기능

### 1. **네이티브 음성 인식 (STT)**
- `expo-speech-recognition` 통합
- 한국어 음성 인식 (`ko-KR`)
- 실시간 결과 + 최종 결과
- 마이크 권한 자동 처리

### 2. **AI 파싱 (Azure OpenAI)**
- 경력 사항 구조화 (회사명, 직무, 기간, 업무)
- 스킬 분류 (기술/소프트/자격증)
- 음성 명령 파싱 ("회사명을 삼성으로 바꿔줘")
- 자기소개 자동 생성 (준비됨)

### 3. **PDF 생성 및 공유**
- 50+ 연령층 친화적 1페이지 템플릿
- HTML/CSS 기반 (확장 가능)
- `expo-sharing`으로 카카오톡/이메일 공유
- iOS/Android 파일 시스템 저장

### 4. **Step-2 완전 통합**
- 음성 입력 → AI 파싱 → 편집 → 저장
- 텍스트 수정 + 음성 명령 둘 다 지원
- 모달 기반 파싱 결과 편집기
- 사용자 친화적 UX

---

## 📦 생성된 파일 목록

### 핵심 모듈
```
utils/
  ✅ speechRecognition.ts   - expo-speech-recognition 네이티브 통합
  ✅ aiParser.ts            - Azure OpenAI 파싱 (4가지 메서드)
  ✅ pdfGenerator.ts        - HTML to PDF 변환
  ✅ config.ts              - Azure API 설정 관리
```

### UI 컴포넌트
```
components/
  ✅ VoiceInputWithAI.tsx           - AI 파싱 기능이 있는 음성 입력
  ✅ ParsedExperienceEditor.tsx     - 파싱 결과 편집 (텍스트 + 음성 명령)
```

### 화면
```
app/
  ✅ create/step-1.tsx    - 기본 정보 (텍스트 입력 버그 수정)
  ✅ create/step-2.tsx    - 경력 사항 (AI 파싱 완전 통합)
  ✅ preview.tsx          - 이력서 미리보기 (PDF 다운로드 추가)
```

### 문서
```
📄 TESTING_GUIDE.md        - iOS/Android 테스트 방법 상세 가이드
📄 IMPLEMENTATION_GUIDE.md - 구현 세부사항 및 작동 원리
📄 QUICK_START.md          - 빠른 시작 가이드
📄 CLAUDE.md (업데이트)    - AI 기능 반영
📄 .env.example            - Azure 설정 템플릿
```

---

## 🔧 설치된 라이브러리

```json
{
  "expo-speech-recognition": "latest",  // STT
  "@azure/openai": "latest",             // AI 파싱
  "react-native-html-to-pdf": "latest",  // PDF 생성
  "expo-speech": "~14.0.7",              // TTS (보조)
  "expo-sharing": "~14.0.7"              // PDF 공유
}
```

---

## 🎯 테스트 방법

### 빠른 테스트 (iOS - Mac 사용자)
```bash
# 1. Azure API 키 설정
echo "EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT=https://..." > .env

# 2. 네이티브 빌드
npx expo prebuild --platform ios

# 3. iPhone 연결 후 실행
npx expo run:ios --device

# 4. Step-2에서 음성 입력 + AI 파싱 테스트
```

### 빠른 테스트 (Android - 모든 OS)
```bash
# 1. Azure API 키 설정
echo "EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT=https://..." > .env

# 2. 네이티브 빌드
npx expo prebuild --platform android

# 3. Android 폰 USB 연결 (USB 디버깅 켜기)
npx expo run:android

# 4. Step-2에서 음성 입력 + AI 파싱 테스트
```

**상세 가이드:** `TESTING_GUIDE.md` 참고

---

## 🚀 현재 상태 및 다음 단계

### ✅ 현재 완료
- [x] Step-1: 기본 정보 입력 (텍스트 입력 버그 수정)
- [x] Step-2: 경력 사항 (음성 + AI 파싱 + 음성 명령)
- [x] Step-3~5: 기본 음성 입력 (AI 통합 대기)
- [x] Step-6: 자기소개 입력 (AI 생성 대기)
- [x] PDF 생성 및 공유 기능
- [x] 테스트 가이드 작성

### ⏳ 다음 작업 (Phase 1)
1. **Step-2 테스트 및 검증**
   - 실제 디바이스에서 음성 인식 테스트
   - AI 파싱 정확도 측정
   - 음성 명령 인식률 확인
   - 50+ 연령층 사용성 피드백

2. **AI 프롬프트 개선** (필요 시)
   - 한국어 경력 표현 패턴 학습
   - 파싱 정확도 향상
   - 음성 명령 패턴 확장

### 🎯 다음 작업 (Phase 2)
1. **Step-3 AI 통합** - 보유 스킬 자동 분류
   - `aiParser.parseSkills()` 사용
   - VoiceInputWithAI 컴포넌트 재사용

2. **Step-6 AI 통합** - 자기소개 자동 생성
   - `aiParser.generateIntroduction()` 사용
   - 이력서 전체 정보 기반 생성

3. **전체 플로우 통합 테스트**

### 🚀 MVP 배포 준비 (Phase 3)
- [ ] 50+ 연령층 베타 테스터 모집
- [ ] UI/UX 개선 (피드백 반영)
- [ ] 에러 처리 강화
- [ ] 앱 아이콘 & 스플래시 스크린
- [ ] 앱 스토어 배포 준비

---

## 💡 핵심 기술 스택

### Frontend
- **React Native** + **Expo Router** (v54)
- **TypeScript** - 타입 안전성
- **NativeWind** - Tailwind CSS for RN

### AI & Voice
- **expo-speech-recognition** - 네이티브 STT
- **Azure OpenAI API** - GPT-4 기반 파싱
- **Prompt Engineering** - 구조화된 데이터 추출

### Storage & Sharing
- **AsyncStorage** - 로컬 데이터 저장
- **react-native-html-to-pdf** - PDF 생성
- **expo-sharing** - 파일 공유

### Design
- **50+ 친화 디자인** - 18sp+ 큰 글씨, 높은 대비
- **접근성 우선** - 큰 버튼, 간단한 네비게이션

---

## 🎨 사용자 플로우

```
1. 홈 화면
   ↓
2. "새 이력서 작성" 버튼
   ↓
3. Step-1: 기본 정보 (이름, 나이, 연락처)
   ↓
4. Step-2: 경력 사항
   - 🎤 음성 입력
   - ✨ AI로 분석
   - ✏️ 수정 (텍스트 or 음성 명령)
   - 💾 저장
   ↓
5. Step-3~6: 나머지 정보 입력
   ↓
6. 미리보기 화면
   - 📄 PDF로 다운로드
   - 📤 공유하기
   ↓
7. 완료!
```

---

## 📊 예상 성능

### 응답 속도
- **음성 인식 시작**: < 1초
- **음성 → 텍스트 변환**: 실시간 (말하는 동안)
- **AI 파싱 (Azure OpenAI)**: 3-10초
- **음성 명령 처리**: 2-5초
- **PDF 생성**: 2-3초

### 정확도
- **한국어 음성 인식**: 85-95% (iOS/Android 기본 엔진)
- **AI 파싱**: 90-95% (Azure OpenAI GPT-4)

---

## 🤝 협업 & 다음 미팅 안건

### 제미나이 동업자님께
1. **Step-2 테스트 피드백** 받기
   - 음성 인식 정확도
   - AI 파싱 결과 품질
   - UX 개선 사항

2. **AI 프롬프트 튜닝**
   - 더 정확한 경력 추출
   - 한국어 표현 패턴 반영
   - 음성 명령 패턴 확장

3. **MVP 완성 우선순위 논의**
   - Step-3, 6 AI 통합 vs. 전체 테스트 먼저?
   - 베타 테스터 모집 시기
   - 수익화 전략 (무료 vs. 유료 기능)

---

## 🐛 알려진 이슈

1. **Expo Go에서 음성 인식 불가**
   - 해결: 네이티브 빌드 필수 (`npx expo run:ios/android`)

2. **환경 변수 재로드 이슈**
   - 해결: `.env` 파일 수정 후 앱 재시작

3. **Android 에뮬레이터 마이크 제한**
   - 해결: 실제 Android 폰 사용 권장

---

## 📈 다음 버전 계획

### v1.1 (AI 완성)
- Step-3 AI 스킬 분류
- Step-6 AI 자기소개 생성
- 이력서 편집 기능

### v1.2 (프리미엄)
- 여러 PDF 템플릿
- 비디오 이력서 (1분 자기소개)
- 이력서 분석 및 제안

### v2.0 (수익화)
- AdMob 광고 통합
- 프리미엄 기능 (무제한 이력서, 고급 템플릿)
- 구독 모델

---

**🎉 MVP의 핵심 기능이 완성되었습니다! 이제 테스트 및 피드백 수집 단계입니다.** 🚀
