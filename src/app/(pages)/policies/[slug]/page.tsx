import { draftMode } from 'next/headers'
import { fetchDoc } from '@/_api/fetchDoc'
import { notFound, redirect} from 'next/navigation'
import { Policy } from '../../../../payload/payload-types'
import { Gutter } from '@/_components/Gutter'
import RichText from '@/_components/RichText'

export default async function PolicyPage({ params: { slug }, searchParams }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Policy | null = null

  try {
    page = await fetchDoc<Policy>({
      collection: 'policies',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  if (!page) {
    return notFound()
  }
  if (page.attachment && typeof page.attachment === 'object' && page.attachment?.url) {
    redirect(page.attachment.url)
  }
  return (
    <Gutter narrow={true} top={true}>
      <div className={'prose'}>
        <h1 className={'mb-4'}>{page.title}</h1>
        <RichText content={page.body} />
      </div>
    </Gutter>
  )

}
