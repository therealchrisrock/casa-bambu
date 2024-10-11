import React, { Suspense } from 'react'

import { Form, Page } from '../../../payload/payload-types'

import { ClientFormBlock } from '@/_blocks/FormBlock/component'
type Props = Extract<Page['layout'][0], { blockType: 'formBlock' }>

export async function FormBlock(props: Props) {
  const { form, ...otherProps } = props
  let id
  if (typeof form === 'object' && form.id) {
    id = form.id
  } else {
    id = form
  }
  if (!id) return
  const data = await fetchForm(id)
  const componentProps = {
    form: data,
    ...otherProps,
  }
  console.log(componentProps)
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        {data && <ClientFormBlock {...componentProps} />}
      </Suspense>
    </section>
  )
}
async function fetchForm(id: string) {
  const form: Form = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/forms/${id}`).then(
    res => res.json(),
  )
  return form
}
