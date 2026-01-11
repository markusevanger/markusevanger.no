import { defineField, defineType } from 'sanity'
import { FileUser } from 'lucide-react'

export default defineType({
  name: 'cv',
  title: 'CV Page',
  type: 'document',
  icon: FileUser,
  fields: [
    // Header
    defineField({
      name: 'pageTitle_en',
      title: 'Page Title (English)',
      type: 'string',
      group: 'header',
    }),
    defineField({
      name: 'pageTitle_no',
      title: 'Page Title (Norwegian)',
      type: 'string',
      group: 'header',
    }),
    defineField({
      name: 'backButtonText_en',
      title: 'Back Button Text (English)',
      type: 'string',
      group: 'header',
    }),
    defineField({
      name: 'backButtonText_no',
      title: 'Back Button Text (Norwegian)',
      type: 'string',
      group: 'header',
    }),

    // Section Titles
    defineField({
      name: 'projectsSectionTitle_en',
      title: 'Projects Section Title (English)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'projectsSectionTitle_no',
      title: 'Projects Section Title (Norwegian)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'educationSectionTitle_en',
      title: 'Education Section Title (English)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'educationSectionTitle_no',
      title: 'Education Section Title (Norwegian)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'workSectionTitle_en',
      title: 'Work Experience Section Title (English)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'workSectionTitle_no',
      title: 'Work Experience Section Title (Norwegian)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'skillsSectionTitle_en',
      title: 'Skills Section Title (English)',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'skillsSectionTitle_no',
      title: 'Skills Section Title (Norwegian)',
      type: 'string',
      group: 'sections',
    }),

    // Content References
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Projects to display on CV page',
      group: 'content',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'education' }] }],
      group: 'content',
    }),
    defineField({
      name: 'workExperience',
      title: 'Work Experience',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'workExperience' }] }],
      group: 'content',
    }),
    defineField({
      name: 'skillCategories',
      title: 'Skill Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skillCategory' }] }],
      group: 'content',
    }),

    // Bottom Section
    defineField({
      name: 'contactText_en',
      title: 'Contact Text (English)',
      type: 'string',
      group: 'bottom',
    }),
    defineField({
      name: 'contactText_no',
      title: 'Contact Text (Norwegian)',
      type: 'string',
      group: 'bottom',
    }),
  ],
  groups: [
    { name: 'header', title: 'Header' },
    { name: 'sections', title: 'Section Titles' },
    { name: 'content', title: 'Content' },
    { name: 'bottom', title: 'Bottom Section' },
  ],
  preview: {
    prepare() {
      return {
        title: 'CV Page',
      }
    },
  },
})
