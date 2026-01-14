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
      description: 'Upload a certificate PDF (URL will be available for the button below)',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{ type: 'button' }],
      description: 'Optional buttons (e.g., certificate, reference links)',
    }),
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
