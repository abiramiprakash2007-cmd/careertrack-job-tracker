import { SAMPLE_APPLICATIONS } from '../data/sampleApplications';
import { JobApplication } from '../types/application';

const STORAGE_KEY = 'careertrack_applications_v1';
const DEMO_FLAG_KEY = 'careertrack_is_demo_v1';

export interface StorageLoadResult {
  applications: JobApplication[];
  isDemoData: boolean;
}

export function loadInitialApplications(): StorageLoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // First launch: seed demonstration data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPLICATIONS));
      localStorage.setItem(DEMO_FLAG_KEY, 'true');
      return {
        applications: SAMPLE_APPLICATIONS,
        isDemoData: true,
      };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { applications: [], isDemoData: false };
    }

    const isDemoData = localStorage.getItem(DEMO_FLAG_KEY) === 'true';
    return {
      applications: parsed as JobApplication[],
      isDemoData,
    };
  } catch {
    return {
      applications: SAMPLE_APPLICATIONS,
      isDemoData: true,
    };
  }
}

export function persistApplications(applications: JobApplication[], isDemoData?: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    if (typeof isDemoData === 'boolean') {
      localStorage.setItem(DEMO_FLAG_KEY, isDemoData ? 'true' : 'false');
    }
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearAllStoredApplications(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(DEMO_FLAG_KEY, 'false');
  } catch {
    // Ignore storage errors gracefully
  }
}

export function restoreSampleApplications(): JobApplication[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPLICATIONS));
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
  } catch {
    // Ignore storage errors gracefully
  }
  return SAMPLE_APPLICATIONS;
}
