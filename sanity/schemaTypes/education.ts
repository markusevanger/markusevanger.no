import { defineField, defineType } from 'sanity'
import { GraduationCap } from 'lucide-react'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: GraduationCap,
  fields: [
    defineField({
      name: 'institution_en',
      title: 'Institution (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution_no',
      title: 'Institution (Norwegian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree_en',
      title: 'Degree/Program (English)',
      type: 'string',
      description: 'e.g., "Bachelor in Informatics"',
    }),
    defineField({
      name: 'degree_no',
      title: 'Degree/Program (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'location_en',
      title: 'Location (English)',
      type: 'string',
    }),
    defineField({
      name: 'location_no',
      title: 'Location (Norwegian)',
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
      description: 'e.g., "Aug 2022 - Jun 2025"',
    }),
    defineField({
      name: 'period_no',
      title: 'Period (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave empty if ongoing',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Link',
      type: 'url',
      description: 'Link to institution website, etc.',
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
