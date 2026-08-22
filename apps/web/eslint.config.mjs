import { defineConfig, globalIgnores } from 'eslint/config'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

export default defineConfig([
  ...coreWebVitals,
  ...typescript,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'src/lib/sanity.types.ts']),
])
