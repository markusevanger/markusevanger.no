import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'cs56jnxu',
    dataset: 'production',
  },
  studioHost: 'markusevanger',
  deployment: {
    appId: 'y62kef4639wtg9fnf7chb2r2',
  },
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: '../src/lib/sanity.types.ts',
    overloadClientMethods: true,
  },
})
