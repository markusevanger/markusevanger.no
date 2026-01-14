import { defineType, defineArrayMember } from 'sanity'
import { Clock, Briefcase } from 'lucide-react'

export default defineType({
  name: 'heroBlockContent',
  title: 'Hero Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
      of: [
        {
          name: 'agePlaceholder',
          type: 'object',
          title: 'Age Placeholder',
          icon: Clock,
          fields: [
            {
              name: 'label',
              type: 'string',
              initialValue: 'age',
              hidden: true,
            },
          ],
          preview: {
            prepare() {
              return { title: '{{age}}' }
            },
          },
        },
        {
          name: 'workplacePlaceholder',
          type: 'object',
          title: 'Workplace Link',
          icon: Briefcase,
          fields: [
            {
              name: 'label',
              type: 'string',
              initialValue: 'workplace',
              hidden: true,
            },
          ],
          preview: {
            prepare() {
              return { title: '{{workplace}}' }
            },
          },
        },
      ],
    }),
  ],
})
