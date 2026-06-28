import { defineField, defineType } from 'sanity'
import { GraduationCap } from 'lucide-react'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: GraduationCap,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'dates', title: 'Dates' },
    { name: 'links', title: 'Links & References' },
  ],
  fields: [
    defineField({
      name: 'institution_en',
      title: 'Institution (English)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution_no',
      title: 'Institution (Norwegian)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree_en',
      title: 'Degree/Program (English)',
      type: 'string',
      group: 'content',
      description: 'e.g., "Bachelor in Informatics"',
    }),
    defineField({
      name: 'degree_no',
      title: 'Degree/Program (Norwegian)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'location_en',
      title: 'Location (English)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'location_no',
      title: 'Location (Norwegian)',
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
      name: 'period_en',
      title: 'Period (English)',
      type: 'string',
      group: 'dates',
      description: 'e.g., "Aug 2022 - Jun 2025"',
    }),
    defineField({
      name: 'period_no',
      title: 'Period (Norwegian)',
      type: 'string',
      group: 'dates',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      group: 'dates',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      group: 'dates',
      description: 'Leave empty if ongoing',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      group: 'links',
      of: [{ type: 'button' }],
      description: 'Action buttons (e.g., related projects, reports, links)',
    }),
  ],
  preview: {
    select: {
      title: 'institution_en',
      subtitle: 'degree_en',
      period: 'period_en',
    },
    prepare({ title, subtitle, period }) {
      return {
        title,
        subtitle: `${subtitle || ''} (${period || ''})`,
      }
    },
  },
})
