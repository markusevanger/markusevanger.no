import siteSettings from './siteSettings'
import frontpage from './frontpage'
import cv from './cv'
import project from './project'
import education from './education'
import workExperience from './workExperience'
import skill from './skill'
import skillCategory from './skillCategory'
import button from './button'
import blockContent from './blockContent'
import heroBlockContent from './heroBlockContent'

export const schemaTypes = [
  // Singleton documents
  siteSettings,
  frontpage,
  cv,
  // Content types
  project,
  education,
  workExperience,
  skill,
  skillCategory,
  // Object types
  button,
  blockContent,
  heroBlockContent,
]
