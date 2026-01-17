import { defineType, defineField } from 'sanity'
import { MousePointerClick } from 'lucide-react'
import { ButtonPreview } from '../components/ButtonPreview'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  icon: MousePointerClick,
  fieldsets: [
    { name: 'text', title: 'Text', options: { collapsible: true } },
    { name: 'link', title: 'Link', options: { collapsible: true } },
    { name: 'style', title: 'Style', options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: 'buttonPreview',
      title: 'Preview',
      type: 'string',
      components: {
        input: ButtonPreview,
      },
    }),
    defineField({
      name: 'text_en',
      title: 'Button Text (English)',
      type: 'string',
      fieldset: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text_no',
      title: 'Button Text (Norwegian)',
      type: 'string',
      fieldset: 'text',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      fieldset: 'link',
      options: {
        list: [
          { title: 'External URL', value: 'external' },
          { title: 'Internal Page', value: 'internal' },
        ],
        layout: 'radio',
      },
      initialValue: 'external',
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'url',
      fieldset: 'link',
      description: 'External URL (https://...)',
      hidden: ({ parent }) => parent?.linkType === 'internal',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string }
          if (parent?.linkType !== 'internal' && !value) {
            return 'Link URL is required for external links'
          }
          return true
        }),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Page',
      type: 'reference',
      fieldset: 'link',
      to: [{ type: 'frontpage' }, { type: 'cv' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string }
          if (parent?.linkType === 'internal' && !value) {
            return 'Internal page is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'type',
      title: 'Button Type',
      type: 'string',
      fieldset: 'style',
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
      fieldset: 'style',
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
