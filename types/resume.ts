export interface Resume {
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

export interface ResumeFormData {
  basicInfo: {
    name: string;
    age: string;
    phone: string;
    email: string;
  };
  experience: string;
  skills: string;
  desiredJob: string;
  workConditions: {
    location: string;
    time: string;
    type: string;
  };
  introduction: string;
}
