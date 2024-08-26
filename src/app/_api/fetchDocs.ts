import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import type { Config } from '../../payload/payload-types'
import { ORDERS } from '../_graphql/orders'
import { PAGES } from '../_graphql/pages'
import { PRODUCTS } from '../_graphql/products'
import { GRAPHQL_API_URL } from './shared'
import { payloadToken } from './token'

import { BOOKINGS } from '@/_graphql/bookings'
import { Where } from 'payload/types'

const queryMap = {
  pages: {
    query: PAGES,
    key: 'Pages',
  },
  products: {
    query: PRODUCTS,
    key: 'Products',
  },
  orders: {
    query: ORDERS,
    key: 'Orders',
  },
  bookings: {
    query: BOOKINGS,
    key: 'Bookings',
  },
}

export const fetchDocs = async <T, W extends Where = {}>(
  collection: keyof Config['collections'],
  draft?: boolean,
  where?: W,
): Promise<T[]> => {
  if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`)

  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }
  const docs: T[] = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
    },
    cache: 'no-store',
    next: { tags: [collection, JSON.stringify(where ?? {})] },
    body: JSON.stringify({
      query: queryMap[collection].query,
      variables: {
        where: where ?? {},
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')

      return res?.data?.[queryMap[collection].key]?.docs
    })

  return docs
}
