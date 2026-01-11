import { defineField, defineType } from 'sanity'
import { Layers } from 'lucide-react'

export default defineType({
  name: 'skillCategory',
  title: 'Skill Category',
  type: 'document',
  icon: Layers,
  fields: [
    defineField({
      name: 'name_en',
      title: 'Category Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Development", "Hosting", "Creative"',
    }),
    defineField({
      name: 'name_no',
      title: 'Category Name (Norwegian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name_en',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
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
      title: 'name_en',
      skills: 'skills',
    },
    prepare({ title }) {
      return {
        title,
      }
    },
  },
})
