import { defineMigration, at, set } from 'sanity/migrate'

export default defineMigration({
  title: 'Set linkType to external for all existing buttons',
  documentTypes: ['project', 'workExperience', 'frontpage'],

  migrate: {
    document(doc, context) {
      const mutations: ReturnType<typeof at>[] = []

      // Helper to process buttons array at a given path
      const processButtons = (buttons: unknown[] | undefined, path: string) => {
        if (!Array.isArray(buttons)) return

        buttons.forEach((button, index) => {
          if (
            button &&
            typeof button === 'object' &&
            'link' in button &&
            !('linkType' in button)
          ) {
            mutations.push(at(`${path}[${index}].linkType`, set('external')))
          }
        })
      }

      // Check for buttons in different locations based on document type
      if (doc._type === 'project' && 'buttons' in doc) {
        processButtons(doc.buttons as unknown[], 'buttons')
      }

      if (doc._type === 'workExperience' && 'buttons' in doc) {
        processButtons(doc.buttons as unknown[], 'buttons')
      }

      if (doc._type === 'frontpage' && 'heroButtons' in doc) {
        processButtons(doc.heroButtons as unknown[], 'heroButtons')
      }

      return mutations
    },
  },
})
