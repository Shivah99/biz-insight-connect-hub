
export enum UserRole {
  GENERAL = "general",
  BUSINESS = "business",
  ADMIN = "admin"
}

export enum BusinessType {
  PRIVATE = "Private",
  CORPORATION = "Corporation",
  PARTNERSHIP = "Partnership",
  SOLE_PROPRIETORSHIP = "Sole Proprietorship",
  LLC = "LLC",
  NONPROFIT = "Nonprofit",
  OTHER = "Other"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website: string;
  industry: string;
  foundedYear: number;
  logoUrl: string;
  productsAndServices: ProductService[];
  financialStats: FinancialStats;
  ownerId: string;
}

export interface ProductService {
  id: string;
  name: string;
  description: string;
  price?: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface FinancialStats {
  revenue: TimeSeriesData[];
  cagr: number;
  profitMargin: number;
  roi: number;
  customerRetentionRate: number;
}

export interface TimeSeriesData {
  year: number;
  value: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}
