import { defineField, defineType } from 'sanity'
import { FolderKanban } from 'lucide-react'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: FolderKanban,
  fields: [
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_no',
      title: 'Title (Norwegian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title_en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Featured', value: 'featured' },
          { title: 'Small', value: 'small' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle_en',
      title: 'Subtitle (English)',
      type: 'string',
      description: 'Short description shown under title (e.g., "React, TypeScript")',
    }),
    defineField({
      name: 'subtitle_no',
      title: 'Subtitle (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      type: 'text',
    }),
    defineField({
      name: 'description_no',
      title: 'Description (Norwegian)',
      type: 'text',
    }),
    defineField({
      name: 'period_en',
      title: 'Period (English)',
      type: 'string',
      description: 'e.g., "Summer 2024"',
    }),
    defineField({
      name: 'period_no',
      title: 'Period (Norwegian)',
      type: 'string',
      description: 'e.g., "Sommer 2024"',
    }),
    defineField({
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageAlt_en',
      title: 'Image Alt Text (English)',
      type: 'string',
    }),
    defineField({
      name: 'imageAlt_no',
      title: 'Image Alt Text (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'For small projects linking to X/Twitter, etc.',
    }),
    defineField({
      name: 'reportDocument',
      title: 'Report/Documentation (PDF)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'buttonText_en',
      title: 'Button Text (English)',
      type: 'string',
      description: 'Custom button label (defaults to "View Project")',
    }),
    defineField({
      name: 'buttonText_no',
      title: 'Button Text (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title_en',
      subtitle: 'subtitle_en',
      media: 'image',
      type: 'projectType',
    },
    prepare({ title, subtitle, media, type }) {
      return {
        title,
        subtitle: `${type === 'featured' ? '⭐ Featured' : '📁 Small'} - ${subtitle || ''}`,
        media,
      }
    },
  },
})
