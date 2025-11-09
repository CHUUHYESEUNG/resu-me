// Speech Recognition Helper using expo-speech-recognition
import {
  ExpoSpeechRecognitionModule,
  addSpeechRecognitionListener,
} from 'expo-speech-recognition';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

class SpeechRecognitionHelper {
  private isListening: boolean = false;
  private eventSubscriptions: Array<{ remove: () => void }> = [];

  async checkPermission(): Promise<boolean> {
    try {
      console.log('[Speech] Checking permission...');
      const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();
      console.log('[Speech] Permission check result:', JSON.stringify(result));

      // granted, denied, undetermined 등 확인
      if (result.granted === true || result.status === 'granted') {
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Speech] Error checking permission:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      console.log('[Speech] Requesting permission...');
      if (
        !ExpoSpeechRecognitionModule ||
        typeof ExpoSpeechRecognitionModule.requestPermissionsAsync !== 'function'
      ) {
        throw new Error('requestPermissionsAsync API is unavailable on this platform.');
      }

      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      console.log('[Speech] Permission request result:', JSON.stringify(result));

      // granted, denied 등 확인
      if (result.granted === true || result.status === 'granted') {
        console.log('[Speech] Permission granted!');
        // iOS 권한 팝업 후 앱 재개 대기 (중요!) - 2초로 증가
        console.log('[Speech] Waiting for app to resume and permission state to update...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 권한 상태 재확인 (iOS 권한 팝업 후 상태 동기화 확인)
        console.log('[Speech] Double-checking permission state...');
        const recheckResult = await ExpoSpeechRecognitionModule.getPermissionsAsync();
        console.log('[Speech] Recheck result:', JSON.stringify(recheckResult));

        if (recheckResult.granted === true || recheckResult.status === 'granted') {
          console.log('[Speech] Permission state confirmed');
          return true;
        } else {
          console.error('[Speech] Permission state mismatch after grant');
          return false;
        }
      }

      console.warn('[Speech] Permission denied or status:', result.status || result);
      return false;
    } catch (error) {
      console.error('[Speech] Error requesting permission:', error);
      throw error;
    }
  }

  async startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: Error) => void,
    options: SpeechRecognitionOptions = {}
  ): Promise<void> {
    try {
      console.log('[Speech] Starting speech recognition...');

      // 이미 listening 중이면 먼저 stop
      if (this.isListening) {
        console.log('[Speech] Already listening, stopping first...');
        await this.stopListening();
      }

      // 권한 확인
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        console.log('[Speech] No permission, requesting...');
        const granted = await this.requestPermission();
        if (!granted) {
          throw new Error(
            '음성 인식 권한이 거부되었습니다.\n\niPhone 설정 > 레쥬미 > 마이크 및 음성 인식 권한을 허용해주세요.'
          );
        }
      }

      console.log('[Speech] Permission granted, setting up listener...');

      this.cleanupListeners();

      console.log('[Speech] About to register listeners...');

      try {
      console.log('[Speech] Registering result listener...');

      // 네이티브 모듈이 준비될 때까지 추가 대기 (500ms로 증가)
      console.log('[Speech] Waiting for native module to be ready...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const resultSubscription = addSpeechRecognitionListener('result', (event) => {
        try {
          console.log('[Speech] Result event received:', event);
          const [primary] = event.results ?? [];
          if (!primary) {
            return;
          }

          let transcript = primary.transcript;
          if (!transcript && primary.segments?.length) {
            transcript = primary.segments.map((segment) => segment.segment).join(' ');
          }

          if (!transcript) {
            return;
          }

          onResult({
            transcript,
            isFinal: event.isFinal,
          });
        } catch (callbackError) {
          console.error('[Speech] Result handler failure:', callbackError);
          if (onError) {
            onError(callbackError as Error);
          }
        }
      });
        this.eventSubscriptions.push(resultSubscription);

        const errorSubscription = addSpeechRecognitionListener('error', (event) => {
          console.error('[Speech] Recognition error event:', event);
          this.isListening = false;
          if (onError) {
            const errorMessage = event.message || event.error || '음성 인식 오류';
            onError(new Error(errorMessage));
          }
          this.cleanupListeners();
        });
        this.eventSubscriptions.push(errorSubscription);

        const endSubscription = addSpeechRecognitionListener('end', () => {
          console.log('[Speech] Recognition ended');
          this.isListening = false;
          this.cleanupListeners();
        });
        this.eventSubscriptions.push(endSubscription);

        console.log('[Speech] Event listeners registered');
      } catch (listenerError) {
        console.error('[Speech] Error registering listeners:', listenerError);
        this.cleanupListeners();
        throw new Error('음성 인식 리스너 등록 실패: ' + listenerError);
      }

      console.log('[Speech] Starting recognition with options:', options);

      try {
        // 음성 인식 시작 - 더 간단한 옵션으로
        await ExpoSpeechRecognitionModule.start({
          lang: options.language || 'ko-KR',
          interimResults: options.interimResults ?? false,
          maxAlternatives: 1,
          continuous: options.continuous ?? false,
          requiresOnDeviceRecognition: false,
          addsPunctuation: false,
        });

        this.isListening = true;
        console.log('[Speech] Recognition started successfully');
      } catch (startError) {
        console.error('[Speech] Error starting recognition:', startError);
        this.cleanupListeners();
        throw new Error('음성 인식 시작 실패: ' + startError);
      }
    } catch (error) {
      console.error('[Speech] Error starting speech recognition:', error);
      this.isListening = false;
      if (onError) {
        onError(error as Error);
      }
      this.cleanupListeners();
    }
  }

  async stopListening(): Promise<void> {
    try {
      console.log('[Speech] Stopping recognition...');

      this.cleanupListeners();

      if (this.isListening) {
        await ExpoSpeechRecognitionModule.stop();
      }

      this.isListening = false;
      console.log('[Speech] Recognition stopped');
    } catch (error) {
      console.error('[Speech] Error stopping speech recognition:', error);
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  private cleanupListeners() {
    if (this.eventSubscriptions.length === 0) {
      return;
    }

    this.eventSubscriptions.forEach((subscription) => {
      try {
        subscription?.remove?.();
      } catch (error) {
        console.warn('[Speech] Failed to remove listener:', error);
      }
    });
    this.eventSubscriptions = [];
  }
}

export const speechRecognition = new SpeechRecognitionHelper();
