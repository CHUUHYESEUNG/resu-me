import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Resume, ResumeFormData } from '../types/resume';
import { storage } from '../utils/storage';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: ResumeFormData | null;
  loading: boolean;
  // CRUD operations
  loadResumes: () => Promise<void>;
  saveResume: (resume: Resume) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  getResume: (id: string) => Promise<Resume | null>;
  // Current resume operations
  setCurrentResume: (resume: ResumeFormData | null) => void;
  updateCurrentResumeField: (field: keyof ResumeFormData, value: any) => void;
  clearCurrentResume: () => void;
  createResumeFromFormData: (formData: ResumeFormData) => Resume;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
};

interface ResumeProviderProps {
  children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeFormData | null>(null);
  const [loading, setLoading] = useState(false);

  // 초기 로드
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const loadedResumes = await storage.getAllResumes();
      setResumes(loadedResumes);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (resume: Resume) => {
    try {
      await storage.saveResume(resume);
      await loadResumes(); // 리스트 갱신
    } catch (error) {
      console.error('Failed to save resume:', error);
      throw error;
    }
  };

  const deleteResume = async (id: string) => {
    try {
      await storage.deleteResume(id);
      await loadResumes(); // 리스트 갱신
    } catch (error) {
      console.error('Failed to delete resume:', error);
      throw error;
    }
  };

  const getResume = async (id: string): Promise<Resume | null> => {
    try {
      return await storage.getResume(id);
    } catch (error) {
      console.error('Failed to get resume:', error);
      return null;
    }
  };

  const updateCurrentResumeField = (field: keyof ResumeFormData, value: any) => {
    setCurrentResume(prev => {
      if (!prev) {
        // 초기 상태 생성
        const initialFormData: ResumeFormData = {
          basicInfo: { name: '', age: '', phone: '', email: '' },
          experience: '',
          skills: '',
          desiredJob: '',
          workConditions: { location: '', time: '', type: '' },
          introduction: '',
        };
        return { ...initialFormData, [field]: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const clearCurrentResume = () => {
    setCurrentResume(null);
  };

  const createResumeFromFormData = (formData: ResumeFormData): Resume => {
    return {
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      basicInfo: {
        name: formData.basicInfo.name,
        age: parseInt(formData.basicInfo.age) || 0,
        phone: formData.basicInfo.phone,
        email: formData.basicInfo.email,
      },
      experience: formData.experience,
      skills: formData.skills,
      desiredJob: formData.desiredJob,
      workConditions: formData.workConditions,
      introduction: formData.introduction,
    };
  };

  const value: ResumeContextType = {
    resumes,
    currentResume,
    loading,
    loadResumes,
    saveResume,
    deleteResume,
    getResume,
    setCurrentResume,
    updateCurrentResumeField,
    clearCurrentResume,
    createResumeFromFormData,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};
