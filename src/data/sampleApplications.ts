import { JobApplication } from '../types/application';

export const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-sample-1',
    companyName: 'Stripe',
    jobTitle: 'Software Engineer Intern, Payments Infrastructure',
    jobLocation: 'San Francisco, CA (Hybrid)',
    applicationDate: '2026-11-04',
    interviewDate: '2026-11-26',
    interviewTime: '10:30',
    interviewType: 'Technical Integration Round',
    status: 'Interviewing',
    jobDescription:
      'Build resilient payment processing APIs, distributed ledger reconciliation services, and developer-facing SDK tooling in Go, Ruby, and TypeScript.',
    personalNotes:
      'Completed Bug Squash OA in 42 minutes. Review REST idempotency keys and webhook retry patterns before Thursday.',
    createdAt: '2026-11-04T09:15:00.000Z',
    updatedAt: '2026-11-19T14:20:00.000Z',
  },
  {
    id: 'app-sample-2',
    companyName: 'Linear',
    jobTitle: 'Product Engineering Intern',
    jobLocation: 'Remote (US / Canada)',
    applicationDate: '2026-11-10',
    interviewDate: '2026-11-29',
    interviewTime: '14:00',
    interviewType: 'Frontend Architecture & Sync Engine Chat',
    status: 'Interviewing',
    jobDescription:
      'Craft high-precision React + TypeScript interfaces, local-first IndexedDB sync layers, and keyboard-first workflows.',
    personalNotes:
      'Prepare portfolio walkthrough of state optimistic updates and keyboard command palette implementation.',
    createdAt: '2026-11-10T11:30:00.000Z',
    updatedAt: '2026-11-21T16:45:00.000Z',
  },
  {
    id: 'app-sample-3',
    companyName: 'Datadog',
    jobTitle: 'Backend Engineer Intern, Metrics Query',
    jobLocation: 'New York, NY (On-site)',
    applicationDate: '2026-10-18',
    interviewDate: '2026-12-03',
    interviewTime: '11:00',
    interviewType: 'Final Systems & Coding Loop',
    status: 'Interviewing',
    jobDescription:
      'Optimize time-series ingestion pipelines and distributed query execution across petabyte-scale telemetry clusters.',
    personalNotes:
      'Recruiter confirmed 2x45m rounds: algorithms + time-series caching design.',
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-11-20T09:10:00.000Z',
  },
  {
    id: 'app-sample-4',
    companyName: 'Figma',
    jobTitle: 'Software Engineer, New Grad (Core Editor)',
    jobLocation: 'San Francisco, CA',
    applicationDate: '2026-09-24',
    interviewDate: '2026-10-28',
    interviewTime: '13:30',
    interviewType: 'Final Virtual Onsite',
    status: 'Selected',
    jobDescription:
      'Work on multiplayer canvas rendering performance, WebGL shaders, and real-time CRDT document state synchronization.',
    personalNotes:
      'Received verbal offer on Nov 12! Written offer package delivered; deadline to respond is Dec 10.',
    createdAt: '2026-09-24T15:20:00.000Z',
    updatedAt: '2026-11-14T18:00:00.000Z',
  },
  {
    id: 'app-sample-5',
    companyName: 'Cloudflare',
    jobTitle: 'Systems Engineer Intern, Edge Workers',
    jobLocation: 'Austin, TX (Hybrid)',
    applicationDate: '2026-11-15',
    interviewDate: '',
    interviewTime: '',
    interviewType: '',
    status: 'Screening',
    jobDescription:
      'Improve V8 isolate cold-start latency and build Rust-based edge networking diagnostics.',
    personalNotes:
      'Recruiter phone screen scheduled via email reply; awaiting calendar invite confirmation.',
    createdAt: '2026-11-15T17:45:00.000Z',
    updatedAt: '2026-11-22T10:15:00.000Z',
  },
  {
    id: 'app-sample-6',
    companyName: 'Plaid',
    jobTitle: 'Full-Stack Software Engineer Intern',
    jobLocation: 'New York, NY (Hybrid)',
    applicationDate: '2026-11-18',
    interviewDate: '',
    interviewTime: '',
    interviewType: '',
    status: 'Applied',
    jobDescription:
      'Develop consumer bank connection flows, TypeScript React components, and bank OAuth reliability tooling.',
    personalNotes:
      'Applied with alumni referral from CS Career Fair. Submitted tailored fintech resume.',
    createdAt: '2026-11-18T12:00:00.000Z',
    updatedAt: '2026-11-18T12:00:00.000Z',
  },
  {
    id: 'app-sample-7',
    companyName: 'Atlassian',
    jobTitle: 'Frontend Engineer Intern',
    jobLocation: 'Seattle, WA (Remote-friendly)',
    applicationDate: '2026-10-05',
    interviewDate: '2026-10-21',
    interviewTime: '15:00',
    interviewType: 'Data Structures & React Pairing',
    status: 'Rejected',
    jobDescription:
      'Build collaborative Jira workflow boards and accessible design system primitives.',
    personalNotes:
      'Good feedback on React component structure, needed faster edge-case handling on graph traversal problem.',
    createdAt: '2026-10-05T08:45:00.000Z',
    updatedAt: '2026-10-29T11:00:00.000Z',
  },
  {
    id: 'app-sample-8',
    companyName: 'Ramp',
    jobTitle: 'Software Engineer Intern, Core Spend',
    jobLocation: 'New York, NY',
    applicationDate: '2026-09-12',
    interviewDate: '2026-10-02',
    interviewTime: '10:00',
    interviewType: 'Technical Assessment & Hiring Manager',
    status: 'Selected',
    jobDescription:
      'Build automated corporate expense policies, real-time card transaction rules, and Python/TypeScript workflows.',
    personalNotes:
      'Offer received for Summer 2027 cohort. Team focuses on high-throughput ledger automation.',
    createdAt: '2026-09-12T13:10:00.000Z',
    updatedAt: '2026-10-16T16:30:00.000Z',
  },
  {
    id: 'app-sample-9',
    companyName: 'Vercel',
    jobTitle: 'Developer Experience Engineer Intern',
    jobLocation: 'Remote',
    applicationDate: '2026-08-27',
    interviewDate: '',
    interviewTime: '',
    interviewType: '',
    status: 'Rejected',
    jobDescription:
      'Enhance build diagnostics, CLI tooling, and Next.js telemetry dashboards.',
    personalNotes:
      'Received automated update after initial resume review; reapply in spring with open-source CLI contributions.',
    createdAt: '2026-08-27T19:00:00.000Z',
    updatedAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'app-sample-10',
    companyName: 'Notion',
    jobTitle: 'Software Engineer Intern, Workspace Search',
    jobLocation: 'San Francisco, CA',
    applicationDate: '2026-11-21',
    interviewDate: '',
    interviewTime: '',
    interviewType: '',
    status: 'Applied',
    jobDescription:
      'Improve full-text block indexing, query ranking, and collaborative document search latency.',
    personalNotes:
      'Submitted application directly on Notion Careers portal with search-engine course project link.',
    createdAt: '2026-11-21T20:10:00.000Z',
    updatedAt: '2026-11-21T20:10:00.000Z',
  },
];
