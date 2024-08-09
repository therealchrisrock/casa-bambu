import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

import type { Order } from '../../../payload-types'

export const noConflictReservation: BeforeChangeHook<Order> = async ({
  data, // incoming data to update or create with
  req, // full express request
  operation, // name of the operation ie. 'create', 'update'
  originalDoc, // original document
}) => {
  console.log('no conflict reservation')
  // if (!originalDoc.items[0]) return
  // // console.log({
  // //   // data, // incoming data to update or create with
  // //   // req, // full express request
  // //   // operation, // name of the operation ie. 'create', 'update'
  // //   o: originalDoc.items[0].id, // original document
  // // })
  try {
    const schedule = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-availability?id=${originalDoc.items[0].id}`,
      {
        method: 'GET',
      },
    )

    const res = await schedule.json()
    console.log(res)
    return
  } catch (e) {
    console.log(e)
    return
  }
  return data
}
