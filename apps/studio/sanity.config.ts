import React from 'react'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { lucideIconPicker } from 'sanity-plugin-lucide-icon-picker'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemaTypes'
import { Home, FileUser, Settings, FolderKanban, GraduationCap, Briefcase, Layers, Wrench } from 'lucide-react'

// Singleton document types that should only have one instance
const singletonTypes = new Set(['siteSettings', 'frontpage', 'cv'])

// Define custom desk structure for singletons
const singletonListItem = (
  S: any,
  typeName: string,
  title: string,
  icon?: React.ComponentType
) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .icon(icon)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
    )

export default defineConfig({
  name: 'default',
  title: 'markusevanger.no',

  projectId: 'cs56jnxu',
  dataset: 'production',

  icon: () => React.createElement('img', {
    src: '/static/favicon-32x32.png',
    alt: 'markusevanger.no',
    style: { width: '100%', height: '100%', objectFit: 'contain' }
  }),


  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton pages
            singletonListItem(S, 'siteSettings', 'Site Settings', Settings),
            S.divider(),
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    singletonListItem(S, 'frontpage', 'Frontpage', Home),
                    singletonListItem(S, 'cv', 'CV Page', FileUser),
                  ])
              ),
            S.divider(),
            // Regular document lists
            S.documentTypeListItem('project').title('Projects').icon(FolderKanban),
            S.documentTypeListItem('education').title('Education').icon(GraduationCap),
            S.documentTypeListItem('workExperience').title('Work Experience').icon(Briefcase),
            S.divider(),
            S.documentTypeListItem('skillCategory').title('Skill Categories').icon(Layers),
            S.documentTypeListItem('skill').title('Skills').icon(Wrench),
          ]),
    }),
    visionTool(),
    lucideIconPicker(),
    media(),
  ],

  schema: {
    types: schemaTypes,
    // Prevent singletons from being created via "New document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
})
