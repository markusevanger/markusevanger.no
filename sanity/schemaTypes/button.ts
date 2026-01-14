import { defineType, defineField } from 'sanity'
import { MousePointerClick } from 'lucide-react'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  icon: MousePointerClick,
  fields: [
    defineField({
      name: 'text_en',
      title: 'Button Text (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text_no',
      title: 'Button Text (Norwegian)',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Button Type',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Ghost', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      description: 'Optional icon to display with button text',
    }),
  ],
  preview: {
    select: {
      title: 'text_en',
      type: 'type',
    },
    prepare({ title, type }) {
      return {
        title: title || 'Untitled Button',
        subtitle: type || 'primary',
      }
    },
  },
})
