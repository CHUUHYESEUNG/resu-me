import AsyncStorage from '@react-native-async-storage/async-storage';
import { Resume } from '../types/resume';

const RESUMES_KEY = '@resumes';

export const storage = {
  // 모든 이력서 가져오기
  async getAllResumes(): Promise<Resume[]> {
    try {
      const resumesJson = await AsyncStorage.getItem(RESUMES_KEY);
      if (!resumesJson) return [];

      const resumes = JSON.parse(resumesJson);
      // Date 객체로 변환
      return resumes.map((resume: any) => ({
        ...resume,
        createdAt: new Date(resume.createdAt),
        updatedAt: new Date(resume.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading resumes:', error);
      return [];
    }
  },

  // 이력서 저장
  async saveResume(resume: Resume): Promise<void> {
    try {
      const resumes = await this.getAllResumes();
      const existingIndex = resumes.findIndex(r => r.id === resume.id);

      if (existingIndex >= 0) {
        // 기존 이력서 업데이트
        resumes[existingIndex] = {
          ...resume,
          updatedAt: new Date(),
        };
      } else {
        // 새 이력서 추가
        resumes.push(resume);
      }

      await AsyncStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  },

  // 이력서 삭제
  async deleteResume(id: string): Promise<void> {
    try {
      const resumes = await this.getAllResumes();
      const filteredResumes = resumes.filter(r => r.id !== id);
      await AsyncStorage.setItem(RESUMES_KEY, JSON.stringify(filteredResumes));
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },

  // 특정 이력서 가져오기
  async getResume(id: string): Promise<Resume | null> {
    try {
      const resumes = await this.getAllResumes();
      return resumes.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error getting resume:', error);
      return null;
    }
  },

  // 모든 데이터 삭제 (테스트용)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RESUMES_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
