# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**레쥬미 (Resu-me)** - "말하는 이력서" (Voice Resume App)

A React Native mobile app built with Expo Router that helps seniors (50+) and digitally underserved individuals create resumes using voice input instead of complex text entry. The app focuses on accessibility with large fonts (minimum 18sp), high contrast UI, and simplified navigation.

**Target Users:** 50+ age group, people with difficulty using digital devices, job seekers

**Core Value:** Simplicity (voice input), Accessibility (senior-friendly design), Practicality (instant resume generation)

## Development Commands

```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific (for testing without voice features)
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser

# Native build (REQUIRED for voice recognition)
npx expo prebuild   # Generate native project files
npx expo run:ios    # Build and run on iOS
npx expo run:android # Build and run on Android

# Code quality
npm run lint       # Run ESLint and Prettier checks
npm run format     # Auto-fix linting and formatting issues
```

## Environment Setup

Create a `.env` file in the project root with your Azure OpenAI credentials:

```bash
EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
EXPO_PUBLIC_AZURE_OPENAI_API_KEY=your-api-key-here
EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT=gpt-4
```

**Security:** The `.env` file is already added to `.gitignore`. Never commit API keys to GitHub.

## Architecture

### Routing Structure (Expo Router)

The app uses Expo Router's file-based routing with the following structure:

- **`app/index.tsx`** - Onboarding screen (3-page introduction)
- **`app/(tabs)/`** - Main app with bottom tabs
  - `index.tsx` - Home screen
  - `my-resumes.tsx` - Saved resumes list
- **`app/create/`** - 6-step resume creation flow
  - `step-1.tsx` through `step-6.tsx` - Sequential form steps
- **`app/preview.tsx`** - Resume preview and sharing

Navigation is managed by Expo Router. Use `router.push()`, `router.back()`, `router.replace()` for navigation.

### State Management

**Global State: ResumeContext** (`contexts/ResumeContext.tsx`)

The app uses React Context for state management. All resume-related state and operations are centralized in `ResumeContext`:

- `resumes: Resume[]` - All saved resumes
- `currentResume: ResumeFormData | null` - Draft resume being created/edited
- `loading: boolean` - Loading state

**Key Methods:**
- `updateCurrentResumeField(field, value)` - Update a single field during multi-step creation
- `createResumeFromFormData(formData)` - Convert form data to Resume object
- `saveResume(resume)` - Persist to AsyncStorage
- `loadResumes()` - Load all resumes from storage
- `deleteResume(id)` - Remove resume from storage

**Usage Pattern:**
```typescript
const { currentResume, updateCurrentResumeField } = useResume();

// In step screens, update current draft:
updateCurrentResumeField('experience', value);

// In final step (step-6), save the complete resume:
const newResume = createResumeFromFormData(currentResume!);
await saveResume(newResume);
```

### Data Models

**`types/resume.ts`** defines two interfaces:

1. **`Resume`** - Stored resume with id, timestamps, and typed fields
   - `basicInfo: { name, age: number, phone, email? }`
   - `experience: string` (voice input)
   - `skills: string` (voice input)
   - `desiredJob: string` (voice input)
   - `workConditions: { location, time, type }`
   - `introduction: string` (voice input)

2. **`ResumeFormData`** - Form state during creation (age as string, no id/timestamps)

### Data Persistence

**`utils/storage.ts`** wraps AsyncStorage with typed helpers:
- Key: `@resumes`
- All operations handle Date serialization/deserialization
- CRUD operations: `getAllResumes()`, `saveResume()`, `deleteResume()`, `getResume(id)`

### Voice Input & AI Integration

**Speech-to-Text:**
- **`utils/speechRecognition.ts`** - Native speech recognition using `expo-speech-recognition`
- Korean language support (`ko-KR`)
- Real-time and final results
- Permission handling (microphone access)

**AI Parsing (Azure OpenAI):**
- **`utils/aiParser.ts`** - Structured data extraction from voice input
  - `parseExperience()` - Extract company names, positions, dates from career text
  - `parseSkills()` - Classify skills into technical/soft/certifications
  - `parseVoiceCommand()` - Parse voice editing commands (e.g., "change company name to Samsung")
  - `generateIntroduction()` - AI-generated self-introduction from resume data
- **`utils/config.ts`** - Azure OpenAI configuration management

**Components:**
- **`VoiceInput`** (`components/VoiceInput.tsx`) - Basic voice input with text editing
- **`VoiceInputWithAI`** (`components/VoiceInputWithAI.tsx`) - Enhanced with AI parsing button
- **`ParsedExperienceEditor`** (`components/ParsedExperienceEditor.tsx`) - Edit AI-parsed structured data with text or voice commands

**Current Implementation:**
- ✅ Step-2 (경력 사항) - Full AI parsing integration
- ⏳ Step-3, Step-6 - AI parsing modules ready, pending integration

### Design System

**`constants/styles.ts`** defines senior-friendly design tokens:

- **Colors**: Primary (#2563EB blue), Secondary (#10B981 green), Accent (#F59E0B orange)
- **FontSizes**: Minimum 16px (xs) up to 36px (3xl) - all larger than typical mobile apps
- **ButtonSizes**: Minimum 60px height (small) up to 88px (large) for easy tapping
- **Spacing & BorderRadius**: Consistent spacing scale

**Design Principles:**
- Large fonts (18sp+ base)
- High contrast (dark text on white)
- Large touch targets (60x60 minimum)
- Simple navigation (max 3 levels)
- Clear instructions at each step

### Reusable Components

**`components/`** contains senior-friendly UI components:

- **`BigButton`** - Large, accessible button with variants (primary/secondary/outline) and sizes
- **`ProgressBar`** - Shows current step in 6-step creation flow
- **`VoiceInput`** - Voice recording + text input combo with re-record and clear options
- **`ResumeCard`** - List item for displaying saved resumes

All components use design tokens from `constants/styles.ts` and are built with React Native core components (no external UI library).

## Multi-Step Form Pattern

The 6-step resume creation flow maintains state across screens:

1. User starts at `app/create/step-1.tsx`
2. Each step calls `updateCurrentResumeField(field, value)` before navigating
3. State persists in `ResumeContext.currentResume` across all steps
4. Final step (step-6) converts form data to Resume and saves to AsyncStorage
5. After saving, user is redirected to preview screen

**Navigation pattern in steps:**
```typescript
const handleNext = () => {
  updateCurrentResumeField('fieldName', value);
  router.push('/create/step-X');
};

const handleBack = () => {
  updateCurrentResumeField('fieldName', value);
  router.back();
};
```

## Permissions

The app requires microphone permissions for voice input:
- **iOS**: Configured in `app.json` under `expo-av` plugin
- **Android**: `RECORD_AUDIO` permission in `app.json`

## Styling

Uses **NativeWind** (Tailwind CSS for React Native) alongside inline styles with design tokens. Import `global.css` in `app/_layout.tsx`.

Most components use inline styles with imported constants for consistency and type safety.

## Important Notes

1. **Voice Recognition**: Implemented using `expo-speech-recognition`. Requires native build (`npx expo prebuild`) to test. Does not work in Expo Go.

2. **Resume Lifecycle**: Always use `clearCurrentResume()` when starting a new resume creation to avoid draft conflicts.

3. **Type Safety**: `Resume` uses `age: number`, but `ResumeFormData` uses `age: string` (form input). Conversion happens in `createResumeFromFormData()`.

4. **Date Handling**: AsyncStorage serializes Date objects as strings. The storage utility handles conversion in both directions.

5. **Navigation State**: The app uses `router.replace()` after onboarding and after completing resume creation to prevent back navigation to those screens.

## Implemented Features

✅ **Native Voice Recognition** - Using `expo-speech-recognition`
✅ **AI Parsing** - Azure OpenAI integration for structured data extraction
✅ **PDF Generation** - Using `react-native-html-to-pdf` with senior-friendly 1-page template
✅ **Voice Commands** - Edit parsed data using natural language voice commands

## In Progress

⏳ **Step-2 AI Integration** - Fully implemented and ready for testing
⏳ **PDF Export** - Module ready, pending integration in preview screen

## Future Features (Roadmap)

- Resume editing capability
- AI parsing for all steps (Step-3 Skills, Step-6 Introduction)
- Multiple PDF templates (for premium users)
- Video resume feature (1-minute self-introduction)
- AdMob integration for monetization
- Resume analytics and suggestions
