import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'cs56jnxu',
    dataset: 'production',
  },
  studioHost: 'markusevanger',
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: '../src/lib/sanity.types.ts',
    overloadClientMethods: true,
  },
})
