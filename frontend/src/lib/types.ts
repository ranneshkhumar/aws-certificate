// ── Certification Types ────────────────────────────────

export interface CertificationLevel {
  id: string;
  name: string;
  displayOrder: number;
}

export interface CertificationListItem {
  id: string;
  title: string;
  slug: string;
  examCode: string;
  badgeImageUrl: string | null;
  level: string | { id: string; name: string };
  displayOrder: number;
  examDuration?: string;
  totalQuestions?: number;
  examCost?: number;
  examMode?: string;
  domains?: DomainListItem[];
}

export interface TopicListItem {
  id: string;
  name: string;
  displayOrder: number;
}

export interface DomainListItem {
  id: string;
  name: string;
  weightage: number;
  displayOrder: number;
  topics: TopicListItem[];
}

export interface CertificationDetail {
  id: string;
  title: string;
  slug: string;
  examCode: string;
  examDuration: string;
  totalQuestions: number;
  examCost: number;
  examMode: string;
  badgeImageUrl: string | null;
  displayOrder: number;
  level: {
    id: string;
    name: string;
  };
  domains: DomainListItem[];
}

// ── Domain Types ───────────────────────────────────────

export interface Domain {
  id: string;
  certificationId: string;
  name: string;
  weightage: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Topic Types ────────────────────────────────────────

export interface Topic {
  id: string;
  domainId: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Career Role Types ──────────────────────────────────

export interface CareerRoleListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    certifications: number;
    opportunities: number;
  };
}

export interface CareerRoleDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  certifications: RoleCertification[];
  opportunities: CareerOpportunity[];
}

export interface RoleCertification {
  id: string;
  roleId: string;
  certificationId: string;
  pathOrder: number;
  certification: {
    id: string;
    title: string;
    slug: string;
    examCode: string;
    badgeImageUrl: string | null;
    level: {
      id: string;
      name: string;
    };
  };
}

// ── Pathway Types ──────────────────────────────────────

export interface PathwayEntry {
  pathOrder: number;
  certification: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface PathwayResponse {
  roleId: string;
  pathway: {
    pathOrder: number;
    certification: {
      id: string;
      title: string;
      slug: string;
      examCode: string;
      badgeImageUrl: string | null;
      level: {
        id: string;
        name: string;
      };
    };
  }[];
}

// ── Career Opportunity Types ───────────────────────────

export interface CareerOpportunity {
  id: string;
  roleId: string;
  title: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Learner Pathway Types ──────────────────────────────

export interface LearnerPathwayListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface LearnerPathwayDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  pathway: {
    pathOrder: number;
    certification: {
      id: string;
      title: string;
      slug: string;
    };
  }[];
  opportunities: {
    id: string;
    title: string;
    displayOrder: number;
  }[];
}

// ── API Error Types ────────────────────────────────────

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
}

// ── Level Grouping Type (for pathway builder) ──────────

export interface LevelGroup {
  levelName: string;
  certifications: {
    id: string;
    title: string;
    slug: string;
    examCode: string;
    displayOrder: number;
  }[];
}
