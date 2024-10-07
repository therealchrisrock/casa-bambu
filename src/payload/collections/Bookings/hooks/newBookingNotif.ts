import type { CollectionAfterChangeHook } from 'payload/types'

import generateEmailHTML from '../../../email/generateEmailHTML'
import type { Booking } from '../../../payload-types'

export const newBookingNotif: CollectionAfterChangeHook<Booking> = async ({
  operation,
  doc,
  req,
}) => {
  // && !checkRole(['admin'], req.user)
  if (operation === 'create' && doc.type === 'reservation' && doc.bookingStatus === 'pending') {
    req.payload.sendEmail({
      to: 'help@casambuwestbay.com',
      from: 'help@casambuwestbay.com',
      subject: 'A New Booking Request Awaits your review',
      html: await generateEmailHTML({
        headline: `Booking for ${doc.startDate} - ${doc.endDate}`,
        content: `<a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/bookings/${doc.id}">See here for details</a>`,
      }),
    })
  }
}
