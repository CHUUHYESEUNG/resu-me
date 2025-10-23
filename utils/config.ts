// Azure OpenAI Configuration
// 환경 변수를 사용하거나, 테스트용으로 여기에 직접 입력하세요

export const azureConfig = {
  // Azure OpenAI API 엔드포인트 (예: https://your-resource.openai.azure.com/)
  endpoint: process.env.EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT || '',

  // Azure OpenAI API 키
  apiKey: process.env.EXPO_PUBLIC_AZURE_OPENAI_API_KEY || '',

  // 배포 이름 (Azure Portal에서 생성한 deployment name)
  deploymentName: process.env.EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT || 'gpt-4',

  // API 버전
  apiVersion: process.env.EXPO_PUBLIC_AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
};

// 설정이 올바른지 확인하는 함수
export const validateAzureConfig = (): boolean => {
  if (!azureConfig.endpoint || !azureConfig.apiKey) {
    console.warn('Azure OpenAI 설정이 필요합니다. utils/config.ts를 확인하세요.');
    return false;
  }
  return true;
};
