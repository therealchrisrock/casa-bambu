import type { CollectionAfterChangeHook } from 'payload/types'

import generateEmailHTML from '../../../email/generateEmailHTML'
import type { Booking } from '../../../payload-types'
import { checkRole } from '../../Users/checkRole'
import { format } from 'date-fns'

export const newBookingNotif: CollectionAfterChangeHook<Booking> = async ({
  doc,
  req,
}) => {
  if (!checkRole(['admin'], req.user)){
    const from = format(new Date(doc.startDate), 'd MMM, yyyy')
    const to = format(new Date(doc.endDate), 'd MMM, yyyy')
    req.payload.sendEmail({
      to: 'contact@casabambuwestbay.com',
      from: 'contact@casabambuwestbay.com',
      subject: `New Booking Request for ${doc.product?.title} (${from} - ${to})`,
      html: await generateEmailHTML({
        headline: `New Booking Request for ${doc.product?.title}`,
        content: `
          <div style="padding-bottom: 15px">
            <ul style="padding-bottom: 10px" >
              <li><b>Start Date:</b>${from}</li>
              <li><b>End Date:</b>${to}</li>
              <li><b>Listing:${doc.product?.title}</b></li>
            </ul>
            <div>
              <b>Message from the customer:</b>
            </div>
            <p>${doc.introduction}</p>
          </div>
        `,
        cta: {
          buttonLabel: 'See Here for Details',
          url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/bookings/${doc.id}`,
        },
      }),
    })
    // req.payload.sendEmail({
    //   to: req.user.email,
    //   from: 'contact@casabambuwestbay.com',
    //   subject: `Your Booking Request is Under Review`,
    //   html: await generateEmailHTML({
    //     headline: `New Booking Request at the ${doc.product?.title}`,
    //     content: `
    //       <div style="padding-bottom: 15px">
    //         <h4 style="padding-bottom: 10px" ><b>${from} - ${to}</b></h4>
    //         <div>
    //           <b>Message from the customer:</b>
    //         </div>
    //         <p>${doc.introduction}</p>
    //       </div>
    //     `,
    //     cta: {
    //       buttonLabel: 'See Here for Details',
    //       url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/bookings/${doc.id}`,
    //     },
    //   }),
    // })
  }
}
