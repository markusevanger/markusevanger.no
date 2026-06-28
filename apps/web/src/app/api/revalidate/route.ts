import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: string
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature', isValidSignature },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'Bad request' },
        { status: 400 }
      )
    }

    // Revalidate based on document type
    // Note: Pages are under [locale] routes (/en, /no)
    switch (body._type) {
      case 'frontpage':
      case 'project':
      case 'siteSettings':
        revalidatePath('/en')
        revalidatePath('/no')
        break
      case 'cv':
      case 'education':
      case 'workExperience':
      case 'skill':
      case 'skillCategory':
        revalidatePath('/en/cv')
        revalidatePath('/no/cv')
        break
      default:
        // Revalidate everything for unknown types
        revalidatePath('/en')
        revalidatePath('/no')
        revalidatePath('/en/cv')
        revalidatePath('/no/cv')
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
