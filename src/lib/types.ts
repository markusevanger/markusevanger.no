// Re-export generated types from Sanity TypeGen
export type {
  SiteSettings,
  Project,
  Education,
  WorkExperience,
  Skill,
  SkillCategory,
  Frontpage,
  Cv as CVPage,
  SiteSettingsQueryResult,
  FrontpageQueryResult,
  CvPageQueryResult,
  BlockContent,
  HeroBlockContent,
} from './sanity.types'

import type { FrontpageQueryResult, CvPageQueryResult, BlockContent, HeroBlockContent } from './sanity.types'

// Helper types for component props (extracted from query results)
export type FeaturedProject = NonNullable<NonNullable<FrontpageQueryResult>['featuredProjects']>[number]
export type SmallProject = NonNullable<NonNullable<FrontpageQueryResult>['smallProjects']>[number]
export type CVFeaturedProject = NonNullable<NonNullable<CvPageQueryResult>['featuredProjects']>[number]
export type CVEducation = NonNullable<NonNullable<CvPageQueryResult>['education']>[number]
export type CVWorkExperience = NonNullable<NonNullable<CvPageQueryResult>['workExperience']>[number]
export type CVSkillCategory = NonNullable<NonNullable<CvPageQueryResult>['skillCategories']>[number]
export type CVSkill = NonNullable<NonNullable<CVSkillCategory>['skills']>[number]

export type Language = 'en' | 'no'

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

// Helper to get localized Portable Text field
export function tPortableText(
  obj: Record<string, unknown>,
  field: string,
  lang: Language
): BlockContent | null {
  const key = `${field}_${lang}`
  const fallbackKey = `${field}_en`
  return (obj[key] as BlockContent) || (obj[fallbackKey] as BlockContent) || null
}

// Helper to get localized Hero Portable Text field
export function tHeroPortableText(
  obj: Record<string, unknown>,
  field: string,
  lang: Language
): HeroBlockContent | null {
  const key = `${field}_${lang}`
  const fallbackKey = `${field}_en`
  return (obj[key] as HeroBlockContent) || (obj[fallbackKey] as HeroBlockContent) || null
}
