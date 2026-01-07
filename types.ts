
export enum ServiceCategory {
  CONSULTANCY = 'Consultancy',
  DESIGN = 'Design',
  DEVELOPMENT = 'Development',
  MARKETING = 'Marketing',
  SOFTWARE = 'Software'
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export type TaskCategory = 'Inquiry Handling' | 'Post Management' | 'Website Admin' | 'Strategy' | 'Branding' | 'Sourcing';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToId: string; // References TeamMember.id
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  fullDescription: string;
  category: ServiceCategory;
  isComingSoon: boolean;
  pricing: PricingTier[];
  benefits: string[];
  process: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email: string;
  linkedin: string;
  whatsapp?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  role: 'Director' | 'Member' | 'Advisor';
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  image: string;
  isApproved: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  logoImage?: string;
  faviconImage?: string;
  footerLogoImage?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  maintenanceMode: boolean;
  socialLinks: Record<string, string>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

export interface AppState {
  config: SiteConfig;
  services: Service[];
  posts: BlogPost[];
  team: TeamMember[];
  tasks: Task[];
  testimonials: Testimonial[];
  submissions: ContactSubmission[];
  isAuthenticated: boolean;
  isDarkMode: boolean;
  adminPassword?: string; // Persistent admin password
}
