/**
 * Mock data for development
 * Realistic mock data so the app is fully usable without a live backend
 * TODO: Replace with real API calls when backend is ready
 */

import type { Audit, AppNotification, Establishment, Auditor, AuditChecklistItem } from '@/types';

// Mock auditor (the logged-in user)
export const mockAuditor: Auditor = {
  id: 'aud-001',
  name: 'Ahmad bin Ibrahim',
  email: 'ahmad.ibrahim@halal.gov.my',
  employeeId: 'HA-2023-0042',
  avatarUrl: undefined,
  fcmToken: undefined,
};

// Mock establishments
export const mockEstablishments: Establishment[] = [
  {
    id: 'est-001',
    name: 'Nasi Kandar Pelita Sdn Bhd',
    address: 'No. 12, Jalan SS15/4G, Subang Jaya, 47500 Selangor',
    latitude: 3.0738,
    longitude: 101.5870,
    contactPerson: 'Encik Ravi Kumar',
    contactPhone: '+6012-345-6789',
  },
  {
    id: 'est-002',
    name: 'Ayamas Food Corporation',
    address: 'Lot 5, Jalan Universiti, Petaling Jaya, 46200 Selangor',
    latitude: 3.1209,
    longitude: 101.6538,
    contactPerson: 'Puan Sarah Abdullah',
    contactPhone: '+6019-876-5432',
  },
  {
    id: 'est-003',
    name: 'MyDin Hypermarket (Shah Alam)',
    address: 'No. 25, Persiaran Sukan, Seksyen 13, Shah Alam, 40100 Selangor',
    latitude: 3.0733,
    longitude: 101.5185,
    contactPerson: 'Tuan Haji Ismail',
    contactPhone: '+6017-234-5678',
  },
  {
    id: 'est-004',
    name: 'KFC Malaysia - Central Kitchen',
    address: 'Lot 10, Jalan Teknologi 3/4, Kota Damansara, 47810 Selangor',
    latitude: 3.1501,
    longitude: 101.5916,
    contactPerson: 'Encik Wong Chee Keong',
    contactPhone: '+6016-789-0123',
  },
  {
    id: 'est-005',
    name: 'Ramly Food Processing Sdn Bhd',
    address: 'No. 8, Jalan Kilang, Taman Industri Bolton, Batu Caves, 68100 Selangor',
    latitude: 3.2379,
    longitude: 101.6840,
    contactPerson: 'Dato Ramly bin Mokni',
    contactPhone: '+6013-456-7890',
  },
  {
    id: 'est-006',
    name: 'Gardenia Bakeries (KL) Sdn Bhd',
    address: 'Lot 3, Jalan Pelabur 23/1, Shah Alam, 40300 Selangor',
    latitude: 3.0524,
    longitude: 101.5850,
    contactPerson: 'Puan Lim Siew Mei',
    contactPhone: '+6014-567-8901',
  },
];

// Checklist template items for all audits
export const defaultChecklistItems: AuditChecklistItem[] = [
  {
    id: 'chk-001',
    category: 'Halal Slaughter Compliance',
    description: 'All meat and poultry products are sourced from Halal-certified slaughterhouses with valid JAKIM approval.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-002',
    category: 'Halal Slaughter Compliance',
    description: 'Slaughtering is performed by Muslim slaughtermen (slaughterer must be a Muslim of sound mind).',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-003',
    category: 'Ingredient Sourcing',
    description: 'All ingredients, additives, and processing aids used are Halal-certified or from permitted sources.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-004',
    category: 'Ingredient Sourcing',
    description: 'No use of alcohol (ethanol) or intoxicating substances in any product formulation.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-005',
    category: 'Ingredient Sourcing',
    description: 'Gelatin, if used, is from Halal-certified sources (fish or Halal-slaughtered animals only).',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-006',
    category: 'Storage & Handling',
    description: 'Halal and non-Halal products are physically segregated during storage with clear labelling.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-007',
    category: 'Storage & Handling',
    description: 'Storage areas are free from najis (impurities) and cross-contamination risks.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-008',
    category: 'Storage & Handling',
    description: 'Cold chain is maintained for temperature-sensitive products throughout storage.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-009',
    category: 'Hygiene & Sanitation',
    description: 'Production facilities maintain cleanliness standards in compliance with GMP/HACCP requirements.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-010',
    category: 'Hygiene & Sanitation',
    description: 'Staff handling food products maintain personal hygiene (clean attire, hairnets, gloves).',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-011',
    category: 'Hygiene & Sanitation',
    description: 'Pest control measures are in place and documented. No signs of pest infestation.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-012',
    category: 'Labelling Compliance',
    description: 'Product labels accurately display Halal certification logo with valid certification number.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-013',
    category: 'Labelling Compliance',
    description: 'All ingredients are listed on product labels in accordance with Food Act 1983.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-014',
    category: 'Labelling Compliance',
    description: 'No misleading claims or ambiguous statements regarding Halal status on packaging.',
    result: null,
    notes: '',
    photoUrls: [],
  },
  {
    id: 'chk-015',
    category: 'Documentation & Traceability',
    description: 'Supplier Halal certificates are current and on file for all raw materials.',
    result: null,
    notes: '',
    photoUrls: [],
  },
];

// Mock audits
export const mockAudits: Audit[] = [
  {
    id: 'audit-001',
    establishmentId: 'est-001',
    establishment: mockEstablishments[0],
    auditorId: 'aud-001',
    scheduledAt: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    type: 'renewal',
    status: 'scheduled',
    checklist: defaultChecklistItems.map(item => ({ ...item })),
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'audit-002',
    establishmentId: 'est-002',
    establishment: mockEstablishments[1],
    auditorId: 'aud-001',
    scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    type: 'initial',
    status: 'scheduled',
    checklist: defaultChecklistItems.map(item => ({ ...item })),
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
  },
  {
    id: 'audit-003',
    establishmentId: 'est-003',
    establishment: mockEstablishments[2],
    auditorId: 'aud-001',
    scheduledAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    type: 'surprise',
    status: 'in_progress',
    checklist: defaultChecklistItems.map((item, idx) => ({
      ...item,
      result: idx < 5 ? 'pass' : null,
      notes: idx < 2 ? 'All requirements met' : '',
    })),
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 'audit-004',
    establishmentId: 'est-004',
    establishment: mockEstablishments[3],
    auditorId: 'aud-001',
    scheduledAt: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
    type: 'renewal',
    status: 'scheduled',
    checklist: defaultChecklistItems.map(item => ({ ...item })),
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
  },
  {
    id: 'audit-005',
    establishmentId: 'est-005',
    establishment: mockEstablishments[4],
    auditorId: 'aud-001',
    scheduledAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    type: 'renewal',
    status: 'completed',
    checklist: defaultChecklistItems.map(item => ({ ...item, result: 'pass' as const })),
    overallRemarks: 'Excellent compliance across all categories. Facility maintains high standards of Halal integrity.',
    finalResult: 'passed',
    submittedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 'audit-006',
    establishmentId: 'est-006',
    establishment: mockEstablishments[5],
    auditorId: 'aud-001',
    scheduledAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    type: 'follow-up',
    status: 'completed',
    checklist: defaultChecklistItems.map((item, idx) => ({
      ...item,
      result: idx < 13 ? 'pass' as const : 'fail' as const,
      notes: idx >= 13 ? 'Labelling errors identified on 2 SKUs' : '',
    })),
    overallRemarks: 'Majority of areas in compliance. Labelling violations require immediate corrective action. Follow-up audit required within 30 days.',
    finalResult: 'conditional_pass',
    submittedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
  },
];

// Mock notifications
export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    auditId: 'audit-001',
    title: 'New Audit Assigned',
    body: 'You have been assigned an audit at Nasi Kandar Pelita Sdn Bhd on May 18, 2026',
    read: false,
    receivedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'notif-002',
    auditId: 'audit-002',
    title: 'New Audit Assigned',
    body: 'You have been assigned an audit at Ayamas Food Corporation on May 20, 2026',
    read: false,
    receivedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-003',
    auditId: 'audit-003',
    title: 'Audit Reminder',
    body: 'Your surprise audit at MyDin Hypermarket (Shah Alam) started 2 days ago. Please complete and submit.',
    read: true,
    receivedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: 'notif-004',
    auditId: 'audit-004',
    title: 'New Audit Assigned',
    body: 'You have been assigned an audit at KFC Malaysia - Central Kitchen on May 23, 2026',
    read: true,
    receivedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'notif-005',
    auditId: 'audit-005',
    title: 'Audit Completed',
    body: 'Your audit at Ramly Food Processing Sdn Bhd has been approved by the supervisor.',
    read: true,
    receivedAt: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
  },
];

// Mock auditor stats
export const mockAuditorStats = {
  auditsThisMonth: 4,
  auditsThisYear: 23,
  totalAuditsCompleted: 87,
  passRate: 78,
};
