import { defineField, defineType } from 'sanity'
import { FolderKanban } from 'lucide-react'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: FolderKanban,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'links', title: 'Links' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_no',
      title: 'Title (Norwegian)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
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
      group: 'meta',
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
      group: 'content',
      description: 'Short description shown under title (e.g., "React, TypeScript")',
    }),
    defineField({
      name: 'subtitle_no',
      title: 'Subtitle (Norwegian)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'description_no',
      title: 'Description (Norwegian)',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      group: 'meta',
      options: { dateFormat: 'MMMM yyyy' },
      description: 'Month granularity — only the month and year are shown. Pick any day in the month.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      group: 'meta',
      options: { dateFormat: 'MMMM yyyy' },
      description: 'Leave empty for a single-month project. Ignored if "Ongoing" is on.',
      hidden: ({ parent }) => parent?.ongoing === true,
    }),
    defineField({
      name: 'ongoing',
      title: 'Ongoing',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Project is still in progress — shows "… – present" instead of an end month.',
    }),
    defineField({
      name: 'image',
      title: 'Project Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'silhouette',
      title: 'Silhouette (SVG path)',
      type: 'text',
      rows: 3,
      group: 'media',
      description:
        'Optional SVG shape for the topographic-field preview. Paste full SVG markup or a bare path "d" straight from Figma. Preview shapes on /dev. Falls back to the default badge if empty.',
    }),
    defineField({
      name: 'imageAlt_en',
      title: 'Image Alt Text (English)',
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'imageAlt_no',
      title: 'Image Alt Text (Norwegian)',
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons (Featured Projects)',
      type: 'array',
      group: 'links',
      of: [{ type: 'button' }],
      description: 'Action buttons for featured projects (e.g., Demo, GitHub, Report)',
      hidden: ({ parent }) => parent?.projectType === 'small',
    }),
    defineField({
      name: 'link',
      title: 'Link (Small Projects)',
      type: 'url',
      group: 'links',
      description: 'Single link for small projects (the entire row is clickable)',
      hidden: ({ parent }) => parent?.projectType !== 'small',
    }),
    defineField({
      name: 'reportDocument',
      title: 'Report/Documentation (PDF)',
      type: 'file',
      group: 'links',
      options: {
        accept: '.pdf',
      },
      description: 'Upload a PDF report (the URL will be available for buttons)',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title_en',
      subtitle: 'subtitle_en',
      media: 'image',
      type: 'projectType',
      startDate: 'startDate',
    },
    prepare({ title, subtitle, media, type, startDate }) {
      const year = startDate ? String(startDate).slice(0, 4) : '—'
      return {
        title,
        subtitle: `${type === 'featured' ? '⭐ Featured' : '📁 Small'} · ${year}${subtitle ? ` · ${subtitle}` : ''}`,
        media,
      }
    },
  },
})
