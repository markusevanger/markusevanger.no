import { defineField, defineType } from 'sanity'
import { Home, Sparkles, FolderKanban } from 'lucide-react'

export default defineType({
  name: 'frontpage',
  title: 'Frontpage',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'hero', title: 'Hero Section', icon: Sparkles, default: true },
    { name: 'portfolio', title: 'Portfolio Section', icon: FolderKanban },
  ],
  fieldsets: [
    { name: 'heroTitle', title: 'Title', options: { collapsible: true, collapsed: false } },
    { name: 'heroDescription', title: 'Description', options: { collapsible: true, collapsed: false } },
    { name: 'portfolioTitle', title: 'Section Title', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle_en',
      title: 'English',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'hero',
      fieldset: 'heroTitle',
    }),
    defineField({
      name: 'heroTitle_no',
      title: 'Norwegian',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'hero',
      fieldset: 'heroTitle',
    }),
    defineField({
      name: 'heroDescription_en',
      title: 'English',
      type: 'heroBlockContent',
      description: 'Use inline "Age Placeholder" for dynamic age content',
      group: 'hero',
      fieldset: 'heroDescription',
    }),
    defineField({
      name: 'heroDescription_no',
      title: 'Norwegian',
      type: 'heroBlockContent',
      description: 'Use inline "Age Placeholder" for dynamic age content',
      group: 'hero',
      fieldset: 'heroDescription',
    }),
    defineField({
      name: 'heroButtons',
      title: 'Hero Buttons',
      type: 'array',
      of: [{ type: 'button' }],
      group: 'hero',
    }),

    // Portfolio Section
    defineField({
      name: 'portfolioTitle_en',
      title: 'English',
      type: 'string',
      group: 'portfolio',
      fieldset: 'portfolioTitle',
    }),
    defineField({
      name: 'portfolioTitle_no',
      title: 'Norwegian',
      type: 'string',
      group: 'portfolio',
      fieldset: 'portfolioTitle',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Select projects to feature in the carousel',
      group: 'portfolio',
    }),
    defineField({
      name: 'smallProjects',
      title: 'Small Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Select projects for the small projects list',
      group: 'portfolio',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Frontpage',
      }
    },
  },
})
