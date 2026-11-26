export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interviewing'
  | 'Selected'
  | 'Rejected';

export type PageRoute =
  | 'dashboard'
  | 'applications'
  | 'interviews'
  | 'analytics'
  | 'profile';

export type AuthView = 'login' | 'signup' | 'forgot-password';

export type SortOption = 'date-desc' | 'date-asc' | 'company-asc' | 'interview-asc';

export interface JobApplication {
  id: string;
  userId?: string;
  companyName: string;
  jobTitle: string;
  jobLocation: string;
  applicationDate: string; // YYYY-MM-DD
  interviewDate: string;   // YYYY-MM-DD or ''
  interviewTime: string;   // HH:mm or ''
  interviewType: string;   // e.g., Technical Screen, Final Loop, HR Call
  status: ApplicationStatus;
  jobDescription: string;
  personalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormValues {
  companyName: string;
  jobTitle: string;
  jobLocation: string;
  applicationDate: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  status: ApplicationStatus;
  jobDescription: string;
  personalNotes: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'danger';
}
