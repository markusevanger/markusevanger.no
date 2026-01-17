import { defineField, defineType } from 'sanity'
import { FileUser, PanelTop, Heading, FileStack, MessageCircle } from 'lucide-react'

export default defineType({
  name: 'cv',
  title: 'CV Page',
  type: 'document',
  icon: FileUser,
  groups: [
    { name: 'header', title: 'Header', icon: PanelTop, default: true },
    { name: 'sections', title: 'Section Titles', icon: Heading },
    { name: 'content', title: 'Content', icon: FileStack },
    { name: 'bottom', title: 'Bottom Section', icon: MessageCircle },
  ],
  fieldsets: [
    { name: 'pageTitle', title: 'Page Title', options: { collapsible: true, collapsed: false } },
    { name: 'backButton', title: 'Back Button', options: { collapsible: true, collapsed: false } },
    { name: 'projectsTitle', title: 'Projects', options: { collapsible: true, collapsed: false } },
    { name: 'educationTitle', title: 'Education', options: { collapsible: true, collapsed: false } },
    { name: 'workTitle', title: 'Work Experience', options: { collapsible: true, collapsed: false } },
    { name: 'skillsTitle', title: 'Skills', options: { collapsible: true, collapsed: false } },
    { name: 'contactText', title: 'Contact Text', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Header
    defineField({
      name: 'pageTitle_en',
      title: 'English',
      type: 'string',
      group: 'header',
      fieldset: 'pageTitle',
    }),
    defineField({
      name: 'pageTitle_no',
      title: 'Norwegian',
      type: 'string',
      group: 'header',
      fieldset: 'pageTitle',
    }),
    defineField({
      name: 'backButtonText_en',
      title: 'English',
      type: 'string',
      group: 'header',
      fieldset: 'backButton',
    }),
    defineField({
      name: 'backButtonText_no',
      title: 'Norwegian',
      type: 'string',
      group: 'header',
      fieldset: 'backButton',
    }),

    // Section Titles
    defineField({
      name: 'projectsSectionTitle_en',
      title: 'English',
      type: 'string',
      group: 'sections',
      fieldset: 'projectsTitle',
    }),
    defineField({
      name: 'projectsSectionTitle_no',
      title: 'Norwegian',
      type: 'string',
      group: 'sections',
      fieldset: 'projectsTitle',
    }),
    defineField({
      name: 'educationSectionTitle_en',
      title: 'English',
      type: 'string',
      group: 'sections',
      fieldset: 'educationTitle',
    }),
    defineField({
      name: 'educationSectionTitle_no',
      title: 'Norwegian',
      type: 'string',
      group: 'sections',
      fieldset: 'educationTitle',
    }),
    defineField({
      name: 'workSectionTitle_en',
      title: 'English',
      type: 'string',
      group: 'sections',
      fieldset: 'workTitle',
    }),
    defineField({
      name: 'workSectionTitle_no',
      title: 'Norwegian',
      type: 'string',
      group: 'sections',
      fieldset: 'workTitle',
    }),
    defineField({
      name: 'skillsSectionTitle_en',
      title: 'English',
      type: 'string',
      group: 'sections',
      fieldset: 'skillsTitle',
    }),
    defineField({
      name: 'skillsSectionTitle_no',
      title: 'Norwegian',
      type: 'string',
      group: 'sections',
      fieldset: 'skillsTitle',
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
      title: 'English',
      type: 'string',
      group: 'bottom',
      fieldset: 'contactText',
    }),
    defineField({
      name: 'contactText_no',
      title: 'Norwegian',
      type: 'string',
      group: 'bottom',
      fieldset: 'contactText',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'CV Page',
      }
    },
  },
})
