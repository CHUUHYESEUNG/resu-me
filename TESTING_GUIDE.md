# 🧪 레쥬미 테스트 가이드

## 📱 네이티브 빌드 및 테스트 방법

음성 인식 기능은 **Expo Go에서 작동하지 않습니다**. 반드시 네이티브 빌드가 필요합니다.

---

## 🍎 iOS 테스트 (macOS에서만 가능)

### 1단계: 사전 준비

```bash
# Xcode가 설치되어 있는지 확인
xcode-select --version

# 없다면 App Store에서 Xcode 설치 필요 (무료, 약 12GB)
```

### 2단계: 네이티브 프로젝트 생성

```bash
# 프로젝트 루트에서 실행
npx expo prebuild --platform ios

# 완료되면 ios/ 폴더가 생성됨
```

**이 명령어가 하는 일:**
- `ios/` 폴더 생성
- `app.json`의 권한 설정을 네이티브 iOS 설정으로 변환
- Expo 모듈들을 네이티브 코드와 연결

### 3단계: iOS 시뮬레이터에서 실행

```bash
# iOS 시뮬레이터 실행 (자동으로 Xcode 시뮬레이터 열림)
npx expo run:ios
```

**주의:** 시뮬레이터에서는 마이크가 제대로 작동하지 않을 수 있습니다!

### 4단계: 실제 iPhone에서 테스트 (권장!)

#### 방법 A: USB 연결 (가장 쉬움)

1. iPhone을 맥에 USB로 연결
2. iPhone에서 "이 컴퓨터 신뢰" 허용
3. 터미널에서:
   ```bash
   npx expo run:ios --device
   ```
4. 연결된 디바이스 목록이 나오면 선택

#### 방법 B: Apple Developer 계정으로 배포 (복잡함)

- Apple Developer 계정 필요 ($99/년)
- TestFlight를 통한 배포
- 처음에는 방법 A 추천!

### 5단계: 앱 실행 후 테스트

1. 앱이 자동으로 설치되고 실행됨
2. 홈 화면에서 "새 이력서 작성"
3. Step-1: 기본 정보 입력
4. Step-2:
   - 마이크 권한 요청 팝업 → **"허용"** 선택
   - 마이크 버튼 눌러 경력 말하기
   - "AI로 분석" 버튼 클릭

---

## 🤖 Android 테스트 (Windows/Mac/Linux 모두 가능)

### 1단계: Android Studio 설치

```bash
# Android Studio 다운로드
# https://developer.android.com/studio

# 설치 후 SDK 설정 확인
```

### 2단계: 네이티브 프로젝트 생성

```bash
# 프로젝트 루트에서 실행
npx expo prebuild --platform android

# 완료되면 android/ 폴더가 생성됨
```

### 3단계-A: 에뮬레이터에서 실행

```bash
# Android Studio에서 AVD Manager 열기
# 에뮬레이터 생성 (Pixel 6 추천)
# 에뮬레이터 시작

# 터미널에서 실행
npx expo run:android
```

**주의:** 에뮬레이터에서 마이크 테스트하려면 추가 설정 필요!

### 3단계-B: 실제 Android 폰에서 테스트 (권장!)

#### USB 디버깅 활성화

1. **Android 폰 설정:**
   - 설정 → 휴대전화 정보 → 빌드 번호 7번 연속 탭
   - "개발자 옵션" 활성화됨
   - 설정 → 개발자 옵션 → USB 디버깅 켜기

2. **폰을 컴퓨터에 USB로 연결:**
   ```bash
   # 연결 확인
   adb devices

   # 디바이스가 보이면 성공!
   # List of devices attached
   # ABC123456789    device
   ```

3. **앱 실행:**
   ```bash
   npx expo run:android
   ```

4. **앱이 자동으로 설치 및 실행됨**

### 4단계: 앱 실행 후 테스트

1. 홈 화면에서 "새 이력서 작성"
2. Step-1: 기본 정보 입력
3. Step-2:
   - 마이크 권한 요청 → **"허용"** 선택
   - 마이크 버튼 눌러 경력 말하기
   - "AI로 분석" 버튼 클릭

---

## 🔍 문제 해결

### 문제 1: `npx expo prebuild` 실패

**해결책:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install

# 다시 prebuild
npx expo prebuild --clean
```

### 문제 2: iOS에서 "코드 서명 오류"

**해결책:**
```bash
# Xcode에서 직접 실행
open ios/resume.xcworkspace

# Xcode에서:
# 1. 왼쪽 네비게이터에서 프로젝트 선택
# 2. Signing & Capabilities 탭
# 3. Team → "Add an Account" (무료 Apple ID 사용 가능)
# 4. Bundle Identifier 변경 (com.yourname.resume)
```

### 문제 3: Android에서 `adb devices` 결과가 비어있음

**해결책:**
- USB 케이블 교체 (데이터 전송 가능한 케이블인지 확인)
- 폰에서 "USB 디버깅 허용" 팝업 승인
- USB 연결 모드를 "파일 전송"으로 변경

### 문제 4: 음성 인식이 작동하지 않음

**체크리스트:**
1. 네이티브 빌드로 실행했는지 확인 (Expo Go ❌)
2. 마이크 권한을 허용했는지 확인
3. `.env` 파일에 Azure API 키가 있는지 확인
4. 콘솔 에러 메시지 확인:
   ```bash
   # iOS
   npx expo run:ios --configuration Debug

   # Android
   npx expo run:android --variant debug
   ```

### 문제 5: AI 파싱이 작동하지 않음

**체크리스트:**
1. `.env` 파일 확인:
   ```bash
   cat .env
   # 엔드포인트, API 키, deployment 이름 확인
   ```
2. Azure OpenAI 콘솔에서 API 호출 가능한지 테스트
3. 앱 재시작 (환경 변수 재로드)

---

## 🎯 Step-2 AI 파싱 테스트 시나리오

### 시나리오 1: 간단한 경력

**말하기:**
> "저는 2010년부터 2020년까지 삼성전자에서 소프트웨어 엔지니어로 일했습니다."

**기대 결과:**
- 회사명: 삼성전자
- 직무: 소프트웨어 엔지니어
- 시작일: 2010
- 종료일: 2020

### 시나리오 2: 복잡한 경력 (여러 회사)

**말하기:**
> "저는 2010년부터 2015년까지 삼성에서 일했고, 그 다음에 2015년부터 2020년까지 카카오에서 개발자로 일했습니다. 현재는 네이버에서 시니어 엔지니어로 근무 중입니다."

**기대 결과:**
- 3개 회사 추출
- 각각의 기간과 직무 정확히 파싱

### 시나리오 3: 음성 명령 수정

**파싱 후 말하기:**
> "첫 번째 회사명을 삼성전자로 바꿔줘"

**기대 결과:**
- 회사명이 "삼성" → "삼성전자"로 변경됨

---

## 📊 성능 측정

### 타이밍 체크

- **음성 인식 시작**: 즉시 (< 1초)
- **음성 인식 → 텍스트 변환**: 실시간 (말하는 동안)
- **AI 파싱 (Azure OpenAI)**: 3-10초
- **음성 명령 처리**: 2-5초

### 정확도 체크

- **한국어 음성 인식 정확도**: 85-95% (iOS/Android 기본 STT 엔진)
- **AI 파싱 정확도**: 90-95% (Azure OpenAI GPT-4)

---

## 🚀 빠른 테스트 (요약)

### iOS (Mac 사용자)
```bash
# 1. 네이티브 빌드
npx expo prebuild --platform ios

# 2. iPhone 연결 후 실행
npx expo run:ios --device

# 3. Step-2에서 음성 입력 + AI 파싱 테스트
```

### Android (모든 OS)
```bash
# 1. 네이티브 빌드
npx expo prebuild --platform android

# 2. Android 폰 USB 연결 후 실행
npx expo run:android

# 3. Step-2에서 음성 입력 + AI 파싱 테스트
```

---

## 📝 테스트 후 피드백 수집

다음 사항들을 확인해주세요:

- [ ] 음성 인식 정확도 (한국어)
- [ ] AI 파싱 정확도 (회사명, 직무, 기간)
- [ ] 음성 명령 인식률
- [ ] UI/UX 사용성 (50+ 연령층 관점)
- [ ] 응답 속도 (네트워크 영향)
- [ ] 에러 처리 (권한 거부, 네트워크 오류 등)

---

**테스트 중 문제가 생기면 콘솔 로그를 확인하고 알려주세요!** 🐛
