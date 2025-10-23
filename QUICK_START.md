# 🚀 레쥬미 - 빠른 시작 가이드

## 1️⃣ 환경 설정 (5분)

### Azure OpenAI API 키 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```bash
EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
EXPO_PUBLIC_AZURE_OPENAI_API_KEY=your-api-key-here
EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT=gpt-4
```

**Azure OpenAI API 키가 없다면?**
- 현재는 음성 인식만 테스트하고, AI 파싱은 나중에 추가 가능
- AI 파싱 없이도 앱의 대부분 기능은 작동합니다

---

## 2️⃣ 개발 서버 실행 (1분)

```bash
# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 시작
npx expo start
```

**브라우저나 Expo Go로 실행?**
- ⚠️ 음성 인식은 작동하지 않습니다
- UI만 확인하고 싶을 때 사용하세요

---

## 3️⃣ 네이티브 빌드 및 실행 (10분)

### iOS (Mac 사용자)

```bash
# 1. 네이티브 프로젝트 생성
npx expo prebuild --platform ios

# 2. iPhone 연결 후 실행
npx expo run:ios --device
```

### Android (모든 OS)

```bash
# 1. 네이티브 프로젝트 생성
npx expo prebuild --platform android

# 2. Android 폰 USB 연결 (USB 디버깅 켜기)
adb devices

# 3. 앱 실행
npx expo run:android
```

**상세 가이드:** `TESTING_GUIDE.md` 참고

---

## 4️⃣ Step-2 AI 파싱 테스트

### 사용 플로우

1. **홈 화면** → "새 이력서 작성" 버튼 탭
2. **Step-1** → 이름, 나이, 연락처 입력
3. **Step-2 (경력 사항):**
   - 🎤 **마이크 버튼** 탭 → 권한 허용
   - 음성 입력: "저는 2010년부터 2020년까지 삼성전자에서 소프트웨어 엔지니어로 일했습니다"
   - ✨ **"AI로 분석" 버튼** 탭
   - 3-10초 대기 (Azure OpenAI 처리 중)
   - 파싱 결과 확인 및 수정
   - 💾 "저장하고 계속" 탭

### 테스트 시나리오

**시나리오 1: 간단한 경력**
```
음성: "저는 5년간 식당에서 일했습니다"
기대 결과: 회사명, 직무, 기간 추출
```

**시나리오 2: 복잡한 경력 (여러 회사)**
```
음성: "삼성에서 3년, 그 다음 카카오에서 5년 일했어요"
기대 결과: 2개 회사 각각 파싱
```

**시나리오 3: 음성 명령 수정**
```
파싱 후: "회사명을 삼성전자로 바꿔줘"
기대 결과: 회사명 변경됨
```

---

## 5️⃣ PDF 생성 테스트

1. Step-6까지 완료 후 이력서 저장
2. "내 이력서" 탭에서 저장된 이력서 선택
3. 미리보기 화면에서 **"📄 PDF로 다운로드"** 버튼 탭
4. PDF 생성 완료 후 "공유하기" 선택
5. 카카오톡, 이메일 등으로 공유 가능

---

## 🐛 문제 해결

### 음성 인식이 안 됨
```bash
# 1. 네이티브 빌드로 실행했는지 확인
# Expo Go ❌ / npx expo run:ios ✅

# 2. 마이크 권한 확인
# 설정 → 레쥬미 앱 → 마이크 권한 켜기

# 3. 콘솔 로그 확인
npx expo run:ios --configuration Debug
```

### AI 파싱이 안 됨
```bash
# 1. .env 파일 확인
cat .env

# 2. Azure API 키 유효성 확인
# Azure Portal에서 키 상태 확인

# 3. 앱 재시작 (환경 변수 재로드)
```

### PDF 생성 실패
```bash
# 1. 저장공간 확인
# 최소 50MB 필요

# 2. 네이티브 빌드 확인
# react-native-html-to-pdf는 네이티브 모듈

# 3. 권한 확인 (Android)
# 저장소 권한 필요
```

---

## 📋 체크리스트

### 개발 환경
- [ ] Node.js 20.19+ 설치
- [ ] npm 또는 yarn 설치
- [ ] iOS: Xcode 설치 (Mac만)
- [ ] Android: Android Studio + SDK 설치

### 설정
- [ ] `npm install` 실행
- [ ] `.env` 파일 생성 (Azure API 키)
- [ ] `.gitignore`에 `.env` 포함 확인

### 빌드
- [ ] `npx expo prebuild` 성공
- [ ] iOS: `npx expo run:ios` 성공
- [ ] Android: `npx expo run:android` 성공

### 기능 테스트
- [ ] 음성 인식 작동
- [ ] AI 파싱 작동 (경력 추출)
- [ ] 음성 명령 수정 작동
- [ ] PDF 생성 및 공유 작동

---

## 🎯 MVP 완성 로드맵

### ✅ 완료 (현재)
- Step-1: 기본 정보 입력
- Step-2: 경력 사항 (음성 + AI 파싱 + 음성 명령)
- PDF 생성 및 공유

### ⏳ 다음 작업
- Step-3: 보유 스킬 (AI 파싱 통합)
- Step-6: 자기소개 (AI 자동 생성)
- 전체 플로우 통합 테스트

### 🚀 MVP 배포 준비
- 50+ 연령층 사용성 테스트
- AI 프롬프트 정확도 개선
- 에러 처리 강화
- 앱 아이콘 & 스플래시 스크린

---

## 📞 도움이 필요하면?

- **구현 가이드:** `IMPLEMENTATION_GUIDE.md`
- **테스트 가이드:** `TESTING_GUIDE.md`
- **프로젝트 개요:** `CLAUDE.md`

**질문이나 버그 발견 시 콘솔 로그와 함께 제보해주세요!** 🙏
