import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

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
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
