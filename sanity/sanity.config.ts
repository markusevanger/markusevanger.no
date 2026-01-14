import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { lucideIconPicker } from 'sanity-plugin-lucide-icon-picker'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemaTypes'

// Singleton document types that should only have one instance
const singletonTypes = new Set(['siteSettings', 'frontpage', 'cv'])

// Define custom desk structure for singletons
const singletonListItem = (
  S: any,
  typeName: string,
  title: string
) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
    )

export default defineConfig({
  name: 'default',
  title: 'Markus Evanger Portfolio',

  projectId: 'cs56jnxu',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton pages
            S.listItem()
              .title('Settings')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    singletonListItem(S, 'siteSettings', 'Site Settings'),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    singletonListItem(S, 'frontpage', 'Frontpage'),
                    singletonListItem(S, 'cv', 'CV Page'),
                  ])
              ),
            S.divider(),
            // Regular document lists
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('education').title('Education'),
            S.documentTypeListItem('workExperience').title('Work Experience'),
            S.divider(),
            S.documentTypeListItem('skillCategory').title('Skill Categories'),
            S.documentTypeListItem('skill').title('Skills'),
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
