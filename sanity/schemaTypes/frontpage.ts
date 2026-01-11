import { defineField, defineType } from 'sanity'
import { Home } from 'lucide-react'

export default defineType({
  name: 'frontpage',
  title: 'Frontpage',
  type: 'document',
  icon: Home,
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle_en',
      title: 'Hero Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle_no',
      title: 'Hero Title (Norwegian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription_en',
      title: 'Hero Description (English)',
      type: 'text',
      description: 'Use {{age}} as placeholder for dynamic age',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription_no',
      title: 'Hero Description (Norwegian)',
      type: 'text',
      description: 'Use {{age}} as placeholder for dynamic age',
      group: 'hero',
    }),
    defineField({
      name: 'workplaceText_en',
      title: 'Workplace Text (English)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'workplaceText_no',
      title: 'Workplace Text (Norwegian)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'workplaceUrl',
      title: 'Workplace URL',
      type: 'url',
      group: 'hero',
    }),

    // Portfolio Section
    defineField({
      name: 'portfolioTitle_en',
      title: 'Portfolio Section Title (English)',
      type: 'string',
      group: 'portfolio',
    }),
    defineField({
      name: 'portfolioTitle_no',
      title: 'Portfolio Section Title (Norwegian)',
      type: 'string',
      group: 'portfolio',
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
    defineField({
      name: 'madeByText_en',
      title: 'Made By Text (English)',
      type: 'string',
      group: 'bottom',
    }),
    defineField({
      name: 'madeByText_no',
      title: 'Made By Text (Norwegian)',
      type: 'string',
      group: 'bottom',
    }),
    defineField({
      name: 'copiedNotification_en',
      title: 'Copied Notification (English)',
      type: 'string',
      group: 'bottom',
    }),
    defineField({
      name: 'copiedNotification_no',
      title: 'Copied Notification (Norwegian)',
      type: 'string',
      group: 'bottom',
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'portfolio', title: 'Portfolio Section' },
    { name: 'bottom', title: 'Bottom Section' },
  ],
  preview: {
    prepare() {
      return {
        title: 'Frontpage',
      }
    },
  },
})
