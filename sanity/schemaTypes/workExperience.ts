import { defineField, defineType } from 'sanity'
import { Briefcase } from 'lucide-react'

export default defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  icon: Briefcase,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'dates', title: 'Dates' },
    { name: 'links', title: 'Links & Documents' },
  ],
  fields: [
    defineField({
      name: 'company_en',
      title: 'Company (English)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company_no',
      title: 'Company (Norwegian)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position_en',
      title: 'Position (English)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position_no',
      title: 'Position (Norwegian)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
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
      description: 'e.g., "Summers 2022, 2023, 2024"',
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
      description: 'Leave empty if current position',
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company Website',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'certificate',
      title: 'Certificate/Reference (PDF)',
      type: 'file',
      group: 'links',
      options: {
        accept: '.pdf',
      },
      description: 'Upload a certificate PDF (URL will be available for the button below)',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      group: 'links',
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
