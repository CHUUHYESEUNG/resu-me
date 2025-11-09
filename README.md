# 🎤 레쥬미 (Resu-me)

50+ 시니어가 **말로만 이력서를 완성**할 수 있도록 만든 Expo 기반 모바일 앱입니다. 마이크 버튼을 누르고 말하면 음성이 텍스트로 바뀌고, Azure OpenAI가 경력을 자동으로 정리해 PDF까지 만들어 줍니다.

## 한눈에 보기
- **6단계 음성 이력서**: 기본 정보부터 자기소개까지 단계별 진행 (`app/create/step-1~6.tsx`)
- **AI 경력 파싱**: Step-2에서 음성으로 말한 내용을 구조화해주는 `VoiceInputWithAI` + Azure OpenAI (`components/VoiceInputWithAI.tsx`, `utils/aiParser.ts`)
- **PDF 저장 & 공유**: 한 번 작성한 이력서를 재사용하고 PDF로 저장 (`app/preview.tsx`, `utils/pdfGenerator.ts`)
- **시니어 친화 디자인**: 큰 글씨, 높은 대비, 단순한 네비게이션 (`constants/styles.ts`)
- **오프라인 보관**: AsyncStorage로 기기 안에 안전하게 저장 (`utils/storage.ts`, `contexts/ResumeContext.tsx`)

## 화면 흐름
1. **온보딩** – 음성 이력서 소개 → `(app/index.tsx)`
2. **홈 탭** – “새 이력서 만들기” 또는 “내 이력서 보기” → `app/(tabs)/index.tsx`
3. **작성 플로우 (6 Step)** – 음성 입력 + 텍스트 보완
4. **미리보기 & 저장** – 공유, PDF 다운로드 → `app/preview.tsx`
5. **내 이력서 관리** – 목록, 열람, 삭제 → `app/(tabs)/my-resumes.tsx`

## 기술 스택
- **Runtime**: React Native 0.81 + Expo Router 6, TypeScript
- **음성 인식**: `expo-speech-recognition` (iOS `SFSpeechRecognizer`, Android `SpeechRecognizer`)
- **AI**: Azure OpenAI (GPT-4o/4), `@azure/openai`
- **UI/Styling**: NativeWind, Tailwind 프리셋, Safe Area Context
- **데이터/PDF**: AsyncStorage, `react-native-html-to-pdf`, `expo-sharing`

## 요구 사항
- Node.js 20.19 이상
- npm 10+ (또는 Yarn), Expo CLI (npx 사용 가능)
- iOS: Xcode 15+, 실제 기기 권장 (Expo Go에서는 음성 인식 불가)
- Android: Android Studio + SDK, 실제 단말 권장 (에뮬레이터는 마이크 제한 있음)

## 시작하기
```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (UI 확인만 가능, 음성 인식 X)
npm run start

# 3. 네이티브 빌드 후 실기기 실행 (음성 인식/OAI 사용 O)
npm run ios    # 또는 npm run android
```

> `expo-speech-recognition`은 Expo Go에서 동작하지 않습니다. **반드시** `npx expo run:<platform>` 으로 만든 개발 빌드를 사용하세요.

## 환경 변수 (.env)
프로젝트 루트에 `.env`를 만들고 아래 값을 채웁니다.

```bash
EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
EXPO_PUBLIC_AZURE_OPENAI_API_KEY=<your-api-key>
EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT=gpt-4o
EXPO_PUBLIC_AZURE_OPENAI_MODEL_NAME=gpt-4o
EXPO_PUBLIC_AZURE_OPENAI_API_VERSION=2024-12-01-preview
```

- 키가 없으면 AI 파싱 없이 음성 텍스트 입력만 사용 가능합니다.
- `.env`는 이미 `.gitignore`에 포함되어 있으니 절대 커밋하지 마세요.

## npm 스크립트
| 명령 | 설명 |
| --- | --- |
| `npm run start` | Metro 번들러 + Expo 개발 서버 실행 |
| `npm run ios` / `npm run android` | 네이티브 개발 빌드 및 기기 실행 |
| `npm run prebuild` | `ios/`, `android/` 디렉터리 생성 (권한/네이티브 모듈 반영) |
| `npm run lint` | ESLint + Prettier 체크 |
| `npm run format` | ESLint/Prettier 자동 수정 |
| `npm run web` | 웹 미리보기 (음성 인식 미지원) |

## 폴더 구조 하이라이트
```
app/
  index.tsx                # 온보딩
  (tabs)/                  # 홈 & 내 이력서 탭
  create/step-1~6.tsx      # 6단계 작성 플로우
  preview.tsx              # 미리보기 / 공유 / PDF
components/
  VoiceInput*.tsx          # 음성 입력 UI
  ResumeCard.tsx           # 이력서 리스트 카드
contexts/ResumeContext.tsx # 전역 상태 + AsyncStorage 연동
utils/
  speechRecognition.ts     # expo-speech-recognition 래퍼
  aiParser.ts              # Azure OpenAI 파서/명령 처리
  pdfGenerator.ts          # HTML → PDF 변환
  storage.ts               # AsyncStorage CRUD
types/resume.ts            # Resume 타입 정의
```

## 핵심 모듈 살펴보기
- `components/VoiceInputWithAI.tsx` – 음성 입력 + AI 파싱 버튼 + 결과 모달 연동
- `utils/aiParser.ts` – 경력/스킬 파싱, 음성 명령 해석, Azure OpenAI 초기화
- `app/preview.tsx` – 텍스트 공유, PDF 생성/공유 UX
- `contexts/ResumeContext.tsx` – CRUD, Form → Resume 변환, 전역 Provider
- `utils/pdfGenerator.ts` – 50+ 친화 템플릿 HTML을 생성하고 `react-native-html-to-pdf` 호출

## 문제 해결 가이드
- **음성 인식이 안 될 때**
  - `npx expo prebuild` 이후 `npm run ios/android`로 실행했는지 확인
  - iOS: 설정 > 레쥬미 > 마이크/음성 인식 권한 허용
  - Android: 실제 기기 사용 + 마이크 권한 허용
- **AI 파싱 실패**
  - `.env` 값 재확인 → 앱 재시작 (환경 변수는 런타임에 캐시됨)
  - Azure Portal에서 배포 이름/버전이 README와 일치하는지 확인
- **PDF 생성 오류**
  - `react-native-html-to-pdf`는 네이티브 모듈이므로 Expo Go 불가
  - 저장 공간 50MB 이상 확보, Android에서는 저장소 권한 필요

## 추가 문서
- `summary.md` – 전체 기획 및 UX 원칙
- `QUICK_START.md` – 설치/테스트 체크리스트
- `IMPLEMENTATION_GUIDE.md` – Step-2 AI 파싱 상세
- `TESTING_GUIDE.md` – 기기별 테스트 방법
- `README_expo-speech-recognition.md` – 음성 인식 모듈 참고 자료

## 로드맵 스냅샷
- Step-3 스킬 파싱 & Step-6 자동 자기소개 (AI 확대)
- 여러 PDF 템플릿 및 편집 기능
- AdMob 등 수익화 모듈 연동

필요한 내용이 더 있다면 이 README에 자유롭게 추가해주세요. 🙌
