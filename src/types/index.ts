/**
 * src/types/index.ts
 *
 * Global TypeScript interfaces and types shared across the entire project.
 * Import from here: import type { Blog, Project } from "@/types";
 */

// ─── Database Models ──────────────────────────────────────────────────────────

export interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  status: "published" | "draft";
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  client?: string;
  tech_stack?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  category: string;
  is_active: boolean;
}

export interface Solution {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  category: string;
  is_active: boolean;
}

export interface Career {
  id: number;
  title: string;
  dept: string;
  type: string;
  location: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface JobApplication {
  ApplicationId: number;
  FullName: string;
  Email: string;
  Phone?: string;
  Position: string;
  ResumeUrl?: string;
  Message?: string;
  Status: "pending" | "reviewed" | "shortlisted" | "rejected";
  CreatedAt: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
  employee_count?: string;
  division_status?: string;
  company_count?: string;
  status: "open" | "resolved";
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
  is_active: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  order_index: number;
}

export interface AdminUser {
  id: number;
  username: string;
  created_at: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Component Props ──────────────────────────────────────────────────────────

export interface PageHeroProps {
  badge?: string;
  badgeColor?: "green" | "blue" | "grey";
  accent?: "green" | "blue" | "grey";
  title: React.ReactNode;
  subtitle?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
