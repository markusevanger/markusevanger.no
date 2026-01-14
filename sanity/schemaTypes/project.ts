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
      type: 'blockContent',
    }),
    defineField({
      name: 'description_no',
      title: 'Description (Norwegian)',
      type: 'blockContent',
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
      name: 'buttons',
      title: 'Buttons (Featured Projects)',
      type: 'array',
      of: [{ type: 'button' }],
      description: 'Action buttons for featured projects (e.g., Demo, GitHub, Report)',
      hidden: ({ parent }) => parent?.projectType === 'small',
    }),
    defineField({
      name: 'link',
      title: 'Link (Small Projects)',
      type: 'url',
      description: 'Single link for small projects (the entire row is clickable)',
      hidden: ({ parent }) => parent?.projectType !== 'small',
    }),
    defineField({
      name: 'reportDocument',
      title: 'Report/Documentation (PDF)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Upload a PDF report (the URL will be available for buttons)',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
    }),
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
