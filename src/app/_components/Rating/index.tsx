'use server'
import React, { ReactNode } from 'react'
import { StarHalfIcon, StarIcon } from 'lucide-react'
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import { Review } from '../../../payload/payload-types'

import { GRAPHQL_API_URL } from '@/_api/shared'
import { RATING } from '@/_graphql/reviews'
import { Score } from '@/_blocks/ReviewBlock'

export async function OverallScore({ pid }: { pid: string }) {
  let token: RequestCookie | undefined
  const rating = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    next: { tags: [`mutation_rating_${pid}`] },
    body: JSON.stringify({
      query: RATING,
      variables: {
        slug: pid,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.calculateAverageRating
    })
  return <div className={'items-center flex gap-1'}><Score rating={rating} />{' '}<span className={'text-sm font-semibold'}>{(rating/2).toFixed(2)}</span></div>
}

