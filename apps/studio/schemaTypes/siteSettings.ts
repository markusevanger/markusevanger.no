import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

// The 8 silhouette-anchor positions (4 corners + 4 edge midpoints), single
// source for both the dropdown options and the array-item preview label.
const ANCHOR_POSITIONS = [
  { title: '↖ Top-left', value: 'tl' },
  { title: '↑ Top', value: 't' },
  { title: '↗ Top-right', value: 'tr' },
  { title: '← Left', value: 'l' },
  { title: '→ Right', value: 'r' },
  { title: '↙ Bottom-left', value: 'bl' },
  { title: '↓ Bottom', value: 'b' },
  { title: '↘ Bottom-right', value: 'br' },
] as const

const ANCHOR_LABELS: Record<string, string> = Object.fromEntries(
  ANCHOR_POSITIONS.map((p) => [p.value, p.title]),
)

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    {
      name: 'personal',
      title: 'Personal Info',
      default: true,
    },
    {
      name: 'social',
      title: 'Social Links',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'homepage',
      title: 'Homepage',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Your Name',
      type: 'string',
      group: 'personal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'personal',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'birthDate',
      title: 'Birth Date',
      type: 'date',
      group: 'personal',
      description: 'Used for the dynamic age counter on the homepage',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'cvProfileImage',
      title: 'Profile Image (CV Page)',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
    }),
    // Footer fields
    defineField({
      name: 'contactText_en',
      title: 'Contact Text (English)',
      type: 'string',
      group: 'footer',
      description: 'Text shown before the email, e.g. "Get in touch:"',
    }),
    defineField({
      name: 'contactText_no',
      title: 'Contact Text (Norwegian)',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'madeByText_en',
      title: 'Made By Text (English)',
      type: 'string',
      group: 'footer',
      description: 'Text shown at the bottom, e.g. "Made with love by Markus"',
    }),
    defineField({
      name: 'madeByText_no',
      title: 'Made By Text (Norwegian)',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'silhouetteAnchors',
      title: 'Project Blob Anchors',
      type: 'array',
      group: 'homepage',
      description:
        'Pin up to 8 skills around the blob (4 corners + 4 edge midpoints). On the homepage, each project’s blob leans toward the position(s) of the skills it uses — a skill pulls toward the anchor that shares its category. Keep technical disciplines on the left, design on the right.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'skill',
              title: 'Anchor Skill',
              type: 'reference',
              to: [{ type: 'skill' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'corner',
              title: 'Position',
              type: 'string',
              options: {
                list: [...ANCHOR_POSITIONS],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'skill.name', corner: 'corner' },
            prepare({ title, corner }) {
              return {
                title: title || 'No skill selected',
                subtitle: ANCHOR_LABELS[corner as string] || 'No position',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
