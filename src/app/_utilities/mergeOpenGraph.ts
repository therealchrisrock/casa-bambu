import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  siteName: 'Casa Bambu',
  title: 'Casa Bambu',
  description: 'Experience the ultimate vacation at Casa Bambu in West Bay, Roatan, Honduras. Our luxurious rental properties offer stunning views, modern amenities, and easy access to pristine beaches. Book your stay today and enjoy a tropical paradise like no other.',
  images: [
    {
      url: 'https://res.cloudinary.com/deep2qpb8/image/upload/f_auto,q_auto/v1/media/llcl08mz6d9mymlxe5ct',
    },
  ],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
