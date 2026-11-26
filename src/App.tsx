/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { AuthLayout } from './components/auth/AuthLayout';
import { ConfirmDialog } from './components/ConfirmDialog';
import { InterviewEditModal } from './components/InterviewEditModal';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { TopBar } from './components/TopBar';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { ProfilePage } from './pages/ProfilePage';
import {
  ApplicationFormValues,
  ApplicationStatus,
  JobApplication,
  PageRoute,
  ToastMessage,
} from './types/application';
import { isInterviewScheduled } from './utils/formatters';
import {
  clearAllStoredApplications,
  loadInitialApplications,
  persistApplications,
  restoreSampleApplications,
} from './utils/storage';

const SESSION_KEY = 'careertrack_demo_session_v1';

interface DemoSession {
  email: string;
  name: string;
}

function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'Student';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function loadDemoSession(): DemoSession | null {
  try {
    const rawSession =
      sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
    if (!rawSession) return null;
    const parsed = JSON.parse(rawSession) as Partial<DemoSession>;
    if (parsed && typeof parsed.email === 'string' && parsed.email.trim()) {
      return {
        email: parsed.email,
        name:
          typeof parsed.name === 'string' && parsed.name.trim()
            ? parsed.name
            : deriveNameFromEmail(parsed.email),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => loadDemoSession());

  const [initialState] = useState(() => loadInitialApplications());
  const [applications, setApplications] = useState<JobApplication[]>(
    initialState.applications
  );
  const [isDemoData, setIsDemoData] = useState<boolean>(initialState.isDemoData);
  const [activePage, setActivePage] = useState<PageRoute>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [viewingApplication, setViewingApplication] =
    useState<JobApplication | null>(null);
  const [editingInterviewApp, setEditingInterviewApp] =
    useState<JobApplication | null>(null);

  // Confirmation dialog states
  const [pendingDeleteApp, setPendingDeleteApp] =
    useState<JobApplication | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist applications to browser localStorage
  useEffect(() => {
    persistApplications(applications, isDemoData);
  }, [applications, isDemoData]);

  // Demo Login / Logout handlers
  const handleLogin = (email: string, rememberMe: boolean) => {
    const nextSession: DemoSession = {
      email,
      name: deriveNameFromEmail(email),
    };
    try {
      const serialized = JSON.stringify(nextSession);
      sessionStorage.setItem(SESSION_KEY, serialized);
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, serialized);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore storage errors gracefully
    }
    setSession(nextSession);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage errors gracefully
    }
    setSession(null);
    setMobileMenuOpen(false);
    setActivePage('dashboard');
  };

  const handleUpdateUserName = (nextName: string) => {
    if (!session) return;
    const updated: DemoSession = { ...session, name: nextName };
    setSession(updated);
    try {
      const serialized = JSON.stringify(updated);
      sessionStorage.setItem(SESSION_KEY, serialized);
      if (localStorage.getItem(SESSION_KEY)) {
        localStorage.setItem(SESSION_KEY, serialized);
      }
    } catch {
      // Ignore storage errors gracefully
    }
  };

  // Entry Screen: Frontend Demo Login Page
  if (!session) {
    return (
      <AuthLayout>
        <LoginPage onLogin={handleLogin} />
      </AuthLayout>
    );
  }

  // CRUD Handlers (localStorage-backed)
  const handleOpenAddModal = () => {
    setEditingApplication(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (app: JobApplication) => {
    setEditingApplication(app);
    setFormModalOpen(true);
  };

  const handleFormSubmit = (values: ApplicationFormValues) => {
    const now = new Date().toISOString();

    if (editingApplication) {
      setApplications((prev) =>
        prev.map((item) =>
          item.id === editingApplication.id
            ? {
                ...item,
                ...values,
                updatedAt: now,
              }
            : item
        )
      );
      setIsDemoData(false);
      setFormModalOpen(false);
      setEditingApplication(null);
      addToast(
        'Application updated',
        `${values.companyName} — ${values.jobTitle} saved.`
      );
    } else {
      const newRecord: JobApplication = {
        id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...values,
        createdAt: now,
        updatedAt: now,
      };
      setApplications((prev) => [newRecord, ...prev]);
      setIsDemoData(false);
      setFormModalOpen(false);
      addToast(
        'Application added',
        `${values.companyName} — ${values.jobTitle} added to your tracker.`
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteApp) return;
    const deleted = pendingDeleteApp;
    setApplications((prev) => prev.filter((item) => item.id !== deleted.id));
    setIsDemoData(false);
    setPendingDeleteApp(null);
    addToast(
      'Application deleted',
      `${deleted.companyName} — ${deleted.jobTitle} removed.`,
      'danger'
    );
  };

  const handleSaveInterview = (
    id: string,
    updates: {
      interviewDate: string;
      interviewTime: string;
      interviewType: string;
      status: ApplicationStatus;
      personalNotes: string;
    }
  ) => {
    const target = applications.find((a) => a.id === id);
    const now = new Date().toISOString();

    setApplications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: now,
            }
          : item
      )
    );
    setIsDemoData(false);
    setEditingInterviewApp(null);

    if (target) {
      addToast(
        'Interview details updated',
        `${target.companyName} schedule saved.`
      );
    }
  };

  const handleConfirmClearAll = () => {
    clearAllStoredApplications();
    setApplications([]);
    setIsDemoData(false);
    setConfirmClearOpen(false);
    addToast(
      'Data cleared',
      'All saved applications have been removed from local storage.',
      'info'
    );
  };

  const handleRestoreDemoData = () => {
    const sample = restoreSampleApplications();
    setApplications(sample);
    setIsDemoData(true);
    addToast(
      'Sample data loaded',
      'Loaded 10 demonstration applications into your workspace.',
      'info'
    );
  };

  const scheduledInterviewCount = applications.filter((app) =>
    isInterviewScheduled(app)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        totalCount={applications.length}
        interviewCount={scheduledInterviewCount}
        isDemoData={isDemoData}
        userName={session.name}
        userEmail={session.email}
        onLogout={handleLogout}
        onRequestClearData={() => setConfirmClearOpen(true)}
        onRestoreDemoData={handleRestoreDemoData}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopBar
          activePage={activePage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddModal={handleOpenAddModal}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              applications={applications}
              isDemoData={isDemoData}
              onNavigate={setActivePage}
              onOpenAddModal={handleOpenAddModal}
              onViewApplication={setViewingApplication}
              onEditInterview={setEditingInterviewApp}
              onRequestClearData={() => setConfirmClearOpen(true)}
              onRestoreDemoData={handleRestoreDemoData}
            />
          )}

          {activePage === 'applications' && (
            <ApplicationsPage
              applications={applications}
              onOpenAddModal={handleOpenAddModal}
              onViewApplication={setViewingApplication}
              onEditApplication={handleOpenEditModal}
              onDeleteApplication={setPendingDeleteApp}
              onRestoreDemoData={handleRestoreDemoData}
            />
          )}

          {activePage === 'interviews' && (
            <InterviewsPage
              applications={applications}
              onEditInterview={setEditingInterviewApp}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage
              applications={applications}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activePage === 'profile' && (
            <ProfilePage
              userName={session.name}
              userEmail={session.email}
              totalApplications={applications.length}
              onUpdateName={handleUpdateUserName}
              onLogout={handleLogout}
              onNotify={addToast}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Application Modal */}
      <ApplicationFormModal
        open={formModalOpen}
        editingApplication={editingApplication}
        onClose={() => {
          setFormModalOpen(false);
          setEditingApplication(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={viewingApplication}
        onClose={() => setViewingApplication(null)}
        onEdit={handleOpenEditModal}
        onDelete={setPendingDeleteApp}
      />

      {/* Edit Interview Modal */}
      <InterviewEditModal
        application={editingInterviewApp}
        onClose={() => setEditingInterviewApp(null)}
        onSave={handleSaveInterview}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={pendingDeleteApp !== null}
        title="Delete application?"
        description={
          pendingDeleteApp
            ? `Are you sure you want to permanently remove your application to ${pendingDeleteApp.companyName} for ${pendingDeleteApp.jobTitle}?`
            : ''
        }
        confirmLabel="Delete Application"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteApp(null)}
      />

      {/* Clear Sample / All Data Confirmation Dialog */}
      <ConfirmDialog
        open={confirmClearOpen}
        title={isDemoData ? 'Clear sample data?' : 'Clear all applications?'}
        description="This will remove all currently saved job applications from your browser storage. You can reload the sample dataset anytime from the sidebar."
        confirmLabel="Clear All Data"
        variant="danger"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setConfirmClearOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
