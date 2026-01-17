import { defineField, defineType } from 'sanity'
import { Wrench } from 'lucide-react'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  icon: Wrench,
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "React", "TypeScript", "Photoshop"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      description: 'Optional link (e.g., GitHub profile, documentation)',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      description: 'Optional icon for the skill',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
