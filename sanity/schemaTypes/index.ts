import siteSettings from './siteSettings'
import frontpage from './frontpage'
import cv from './cv'
import project from './project'
import education from './education'
import workExperience from './workExperience'
import skill from './skill'
import skillCategory from './skillCategory'

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
]
