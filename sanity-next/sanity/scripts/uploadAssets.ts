/**
 * Script to upload images and documents to Sanity
 *
 * Usage: pnpm upload-assets
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// Load env from parent directory
config({ path: join(process.cwd(), '..', '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  console.log('Make sure these are in the parent .env.local file')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
})

// Path to old 2.0 public folder
const OLD_PUBLIC = join(process.cwd(), '..', '..', '2.0', 'public')

interface AssetUpload {
  filePath: string
  documentId: string
  fieldName: string
  type: 'image' | 'file'
}

const assets: AssetUpload[] = [
  // Site Settings
  { filePath: 'markus.jpg', documentId: 'siteSettings', fieldName: 'profileImage', type: 'image' },
  { filePath: 'markus1.jpeg', documentId: 'siteSettings', fieldName: 'cvProfileImage', type: 'image' },
  { filePath: 'v5-red.webp', documentId: 'siteSettings', fieldName: 'logoImage', type: 'image' },

  // Project Images
  { filePath: 'projectImages/polaris.webp', documentId: 'project-polaris', fieldName: 'image', type: 'image' },
  { filePath: 'projectImages/pawcast.webp', documentId: 'project-pawcast', fieldName: 'image', type: 'image' },
  { filePath: 'projectImages/karbon.webp', documentId: 'project-karbon', fieldName: 'image', type: 'image' },

  // Work Experience Certificates
  { filePath: 'documents/pmgrafisksør_attest.pdf', documentId: 'work-polaris', fieldName: 'certificate', type: 'file' },
  { filePath: 'documents/Attest - Clear Karbon Exchange AS - Markus Evanger.pdf', documentId: 'work-karbon', fieldName: 'certificate', type: 'file' },
]

async function uploadAsset(asset: AssetUpload) {
  const fullPath = join(OLD_PUBLIC, asset.filePath)

  if (!existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${fullPath}`)
    return
  }

  console.log(`📤 Uploading ${asset.filePath}...`)

  try {
    const fileBuffer = readFileSync(fullPath)
    const filename = asset.filePath.split('/').pop() || 'file'

    let uploadedAsset
    if (asset.type === 'image') {
      uploadedAsset = await client.assets.upload('image', fileBuffer, { filename })
    } else {
      uploadedAsset = await client.assets.upload('file', fileBuffer, { filename })
    }

    // Patch the document with the asset reference
    await client
      .patch(asset.documentId)
      .set({
        [asset.fieldName]: {
          _type: asset.type,
          asset: {
            _type: 'reference',
            _ref: uploadedAsset._id,
          },
        },
      })
      .commit()

    console.log(`✅ Uploaded and linked: ${asset.filePath} -> ${asset.documentId}.${asset.fieldName}`)
  } catch (error) {
    console.error(`❌ Failed to upload ${asset.filePath}:`, error)
  }
}

async function main() {
  console.log('🚀 Starting asset upload...')
  console.log(`📁 Looking for files in: ${OLD_PUBLIC}\n`)

  for (const asset of assets) {
    await uploadAsset(asset)
  }

  console.log('\n✨ Asset upload complete!')
}

main()
