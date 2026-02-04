export type User = {
  id: string;
  name: string;
  email: string;
  businessName: string;
  avatarUrl: string;
  plan: Plan;
};

export type Plan = {
  id: string;
  name: string;
  price: number | "custom";
  description: string;
  features: string[];
  isPopular?: boolean;
  limits: {
    apiRequests: number;
  };
};

export type CatalogFile = {
  id: string;
  name: string;
  uploadedAt: Date;
  status: "Processing" | "Validated" | "Error";
  size: string;
};

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
};

export type UsageData = {
  date: string;
  requests: number;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "Admin" | "Developer" | "Viewer";
};

export type ApiSnippetInput = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  apiKey?: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
};
