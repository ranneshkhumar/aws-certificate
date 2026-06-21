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
  level: string;
  displayOrder: number;
  examDuration?: string;
  totalQuestions?: number;
  examCost?: number;
  examMode?: string;
  domains?: {
    id: string;
    name: string;
    weightage: number;
    displayOrder: number;
    topics: {
      id: string;
      name: string;
      displayOrder: number;
    }[];
  }[];
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
  domains: {
    id: string;
    name: string;
    weightage: number;
    displayOrder: number;
    topics: {
      id: string;
      name: string;
      displayOrder: number;
    }[];
  }[];
}

export interface CareerPathwayListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CareerPathwayDetail {
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
      examCode: string;
      badgeImageUrl: string | null;
      level: {
        id: string;
        name: string;
      };
    };
  }[];
  opportunities: {
    id: string;
    title: string;
    displayOrder: number;
  }[];
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
}
