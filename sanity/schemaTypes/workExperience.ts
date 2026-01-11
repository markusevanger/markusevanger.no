import { defineField, defineType } from 'sanity'
import { Briefcase } from 'lucide-react'

export default defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  icon: Briefcase,
  fields: [
    defineField({
      name: 'company_en',
      title: 'Company (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company_no',
      title: 'Company (Norwegian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position_en',
      title: 'Position (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position_no',
      title: 'Position (Norwegian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      description: 'e.g., "Summers 2022, 2023, 2024"',
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
      description: 'Leave empty if current position',
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company Website',
      type: 'url',
    }),
    defineField({
      name: 'certificate',
      title: 'Certificate/Reference (PDF)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'certificateLabel_en',
      title: 'Certificate Link Label (English)',
      type: 'string',
      description: 'e.g., "View Certificate"',
    }),
    defineField({
      name: 'certificateLabel_no',
      title: 'Certificate Link Label (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
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
      title: 'company_en',
      subtitle: 'position_en',
      period: 'period_en',
    },
    prepare({ title, subtitle, period }) {
      return {
        title,
        subtitle: `${subtitle} (${period || ''})`,
      }
    },
  },
})
