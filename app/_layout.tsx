import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ResumeProvider } from '../contexts/ResumeContext';
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    const errorUtils = (globalThis as any).ErrorUtils;
    if (!errorUtils?.getGlobalHandler || !errorUtils?.setGlobalHandler) {
      return;
    }

    const defaultHandler = errorUtils.getGlobalHandler();
    const globalHandler = (error: Error, isFatal?: boolean) => {
      console.log('[GlobalError]', error?.message, error?.stack);
      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    };

    errorUtils.setGlobalHandler(globalHandler);
    return () => {
      errorUtils.setGlobalHandler(defaultHandler);
    };
  }, []);

  return (
    <ResumeProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563EB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: '이력서 작성',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="preview"
          options={{
            title: '이력서 미리보기',
          }}
        />
      </Stack>
    </ResumeProvider>
  );
}
