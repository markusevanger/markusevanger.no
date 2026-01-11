import type { SanityImageSource } from '@sanity/image-url'

export type Language = 'en' | 'no'

// Base type for localized documents
type LocalizedDocument = {
  [key: string]: unknown
}

export interface SiteSettings extends LocalizedDocument {
  name: string
  email: string
  birthDate: string
  githubUrl?: string
  linkedinUrl?: string
  profileImage?: SanityImageSource
  cvProfileImage?: SanityImageSource
  logoImage?: SanityImageSource
}

export interface Project extends LocalizedDocument {
  _id: string
  title_en: string
  title_no: string
  subtitle_en?: string
  subtitle_no?: string
  description_en?: string
  description_no?: string
  period_en?: string
  period_no?: string
  image?: SanityImageSource
  imageAlt_en?: string
  imageAlt_no?: string
  demoUrl?: string
  githubUrl?: string
  externalUrl?: string
  reportUrl?: string
  buttonText_en?: string
  buttonText_no?: string
  order?: number
}

export interface Education extends LocalizedDocument {
  _id: string
  institution_en: string
  institution_no: string
  degree_en?: string
  degree_no?: string
  location_en?: string
  location_no?: string
  description_en?: string
  description_no?: string
  period_en?: string
  period_no?: string
  externalUrl?: string
  relatedProjects?: Project[]
  order?: number
}

export interface WorkExperience extends LocalizedDocument {
  _id: string
  company_en: string
  company_no: string
  position_en: string
  position_no: string
  description_en?: string
  description_no?: string
  period_en?: string
  period_no?: string
  companyUrl?: string
  certificateUrl?: string
  certificateLabel_en?: string
  certificateLabel_no?: string
  order?: number
}

export interface Skill extends LocalizedDocument {
  _id: string
  name: string
  url?: string
  icon?: SanityImageSource
}

export interface SkillCategory extends LocalizedDocument {
  _id: string
  name_en: string
  name_no: string
  skills: Skill[]
  order?: number
}

export interface Frontpage extends LocalizedDocument {
  heroTitle_en: string
  heroTitle_no: string
  heroDescription_en: string
  heroDescription_no: string
  workplaceText_en?: string
  workplaceText_no?: string
  workplaceUrl?: string
  portfolioTitle_en: string
  portfolioTitle_no: string
  featuredProjects: Project[]
  smallProjects: Project[]
  contactText_en: string
  contactText_no: string
  madeByText_en: string
  madeByText_no: string
  copiedNotification_en: string
  copiedNotification_no: string
}

export interface CVPage extends LocalizedDocument {
  pageTitle_en?: string
  pageTitle_no?: string
  backButtonText_en: string
  backButtonText_no: string
  projectsSectionTitle_en: string
  projectsSectionTitle_no: string
  educationSectionTitle_en: string
  educationSectionTitle_no: string
  workSectionTitle_en: string
  workSectionTitle_no: string
  skillsSectionTitle_en: string
  skillsSectionTitle_no: string
  featuredProjects: Project[]
  education: Education[]
  workExperience: WorkExperience[]
  skillCategories: SkillCategory[]
  contactText_en: string
  contactText_no: string
}

// Helper to get localized field
export function t(
  obj: Record<string, unknown>,
  field: string,
  lang: Language
): string {
  const key = `${field}_${lang}`
  const fallbackKey = `${field}_en`
  return (obj[key] as string) || (obj[fallbackKey] as string) || ''
}
