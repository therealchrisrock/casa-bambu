import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
// import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import payload from 'payload'
import { usePayloadAPI } from 'payload/components/hooks'

type CalendarEvent = { id: string; title: string; start: Date; end: Date; product_id: string }
const FALLBACK_COLORS = [
  // '#FF6347', // Tomato (red)
  // '#4682B4', // Steel Blue
  // '#32CD32', // Lime Green
  // '#FFD700', // Gold
  '#8A2BE2', // Blue Violet
  '#FF69B4', // Hot Pink
  '#00CED1', // Dark Turquoise
  '#FFA500', // Orange
  '#ADFF2F', // Green Yellow
  '#DC143C', // Crimson
  '#40E0D0', // Turquoise
  '#FF4500', // Orange Red
  '#DAA520', // Goldenrod
  '#7B68EE', // Medium Slate Blue
  '#6A5ACD', // Slate Blue
  '#20B2AA', // Light Sea Green
  '#87CEEB', // Sky Blue
  '#FFB6C1', // Light Pink
  '#00FA9A', // Medium Spring Green
  '#BA55D3', // Medium Orchid
]
const STATIC_COLOR_MAP: Record<string, string> = {
  '66944696afd4294367b19199': '#FF6347', // Tomato (red)
  '66944696afd4294367b19191': '#4682B4', // Steel Blue
  '66944696afd4294367b19189': '#FFD700', // Lime Green
}
// import { AppointmentModal } from './AppointmentModal'
//
// export type EventData = {
//   id: string
//   title: string
//   start: string
//   end: string
//   raw: any
// }
//
// let eventGuid = 0
// let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
//
// export const INITIAL_EVENTS = [
//   {
//     id: createEventId(),
//     title: 'All-day event',
//     start: todayStr,
//   },
//   {
//     id: createEventId(),
//     title: 'Timed event',
//     start: todayStr + 'T12:00:00',
//   },
// ]
//
// export function createEventId() {
//   return String(eventGuid++)
// }
//
// function CalendarView() {
//   const { openModal } = useAppointments()
//   // const currentEvents = useEvent()
//   const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS)
//
//   const {
//     routes: { api, admin: adminUrl },
//     admin,
//     serverURL,
//   } = useConfig()
//   const [
//     {
//       data: { docs: appointments },
//       isLoading,
//     },
//   ] = usePayloadAPI(`${serverURL}${api}/${Orders.slug}`)
//
//   useEffect(() => {
//     if (!appointments) return
//     console.log(appointments)
//     setCurrentEvents(appointments.map((e: any) => formatEventData(e)))
//   }, [appointments])
//
//   function handleDateSelect(selectInfo) {
//     let title = prompt('Please enter a new title for your event')
//     let calendarApi = selectInfo.view.calendar
//
//     calendarApi.unselect() // clear date selection
//
//     if (title) {
//       calendarApi.addEvent({
//         id: createEventId(),
//         title,
//         start: selectInfo.startStr,
//         end: selectInfo.endStr,
//         allDay: selectInfo.allDay,
//       })
//     }
//   }
//
//   function handleEventClick(clickInfo) {
//     console.log('clickinfo', clickInfo.event.extendedProps.raw)
//     window.location.href = `${adminUrl}/collections/orders/${clickInfo.event.extendedProps.raw.id}`
//     // openModal({ type: 'edit', appointment: clickInfo.event.extendedProps.raw })
//     // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
//     //   clickInfo.event.remove()
//     // }
//   }
//
//   // function handleEvents(events) {
//   //   setCurrentEvents(events)
//   // }
//
//   return (
//     <>
//       <AppointmentProvider>
//         <DefaultTemplate className="demo-app">
//           <div className={`${baseClass}__content gutter--left gutter--right`}>
//             <FullCalendar
//               plugins={[dayGridPlugin, interactionPlugin]}
//               initialView="dayGridMonth"
//               initialDate={}
//               // editable={true}
//               // selectable={true}
//               selectMirror={true}
//               dayMaxEvents={true}
//               weekends={true}
//               // events={appointments.map((e: any) => formatEventData(e))}
//               events={currentEvents} // alternatively, use the `events` setting to fetch from a feed
//               // initialEvents={INIT} // alternatively, use the `events` setting to fetch from a feed
//               // select={handleDateSelect}
//               eventContent={renderEventContent} // custom render function
//               eventClick={handleEventClick}
//               // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
//               /* you can update a remote database when these fire:
//                 eventAdd={function(){}}
//                 eventChange={function(){}}
//                 eventRemove={function(){}}
//                 */
//             />
//           </div>
//         </DefaultTemplate>
//       </AppointmentProvider>
//       <AppointmentModal />
//     </>
//   )
// }
//
// function renderEventContent(eventInfo) {
//   return (
//     <>
//       <i>{eventInfo.event.title}</i>
//     </>
//   )
// }
//
//
// function formatEventData(e: any): EventData {
//   const res = e.items[0]
//   const title = res.product.title
//   const start = res.startDate
//   const end = res.endDate
//   return {
//     id: e.id,
//     title,
//     start,
//     end,
//     raw: e,
//   }
// }
//
// export const Calendar = () => {
//   const d = new Date();
//   let month = d.getMonth();
//
//   return (
//     <AppointmentProvider>
//       <CalendarView />
//     </AppointmentProvider>
//   )
// }
import { DefaultTemplate } from 'payload/components/templates'
import { useConfig } from 'payload/components/utilities'
import { useDocumentDrawer } from 'payload/dist/admin/components/elements/DocumentDrawer'

import { Bookings } from '../../collections/Bookings'
import { Booking } from '../../payload-types'

// import FullCalendar from '@fullcalendar/react'
// import { usePayloadAPI } from 'payload/components/hooks'
// import { DefaultTemplate } from 'payload/components/templates'
// import { useConfig } from 'payload/components/utilities'
//
// import { Orders } from '../../collections/Orders'
// import { AppointmentProvider, useAppointments } from './providers/AppointmentsProvider'
//
import './index.scss'

export const Calendar = () => {
  const baseClass = 'custom-minimal-view'
  const calendarRef = useRef(null)
  const [DocumentDrawer, DocumentDrawerToggler, { closeDrawer }] = useDocumentDrawer({
    collectionSlug: 'bookings',
  })
  const [visibleRange, setVisibleRange] = useState<{ start: string; end: string }>(null)
  // const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS)

  const {
    routes: { api, admin: adminUrl },
    admin,
    serverURL,
  } = useConfig()
  const [
    {
      data: { docs: bookings },
      isLoading,
    },
  ] = usePayloadAPI(`${serverURL}${api}/${Bookings.slug}`)

  const events = useMemo(() => {
    const f: CalendarEvent[] = (bookings || []).map((e: Booking) => formatEventData(e))
    return f
  }, [bookings])

  function openEvent(e) {
    window.location.href = `${adminUrl}/collections/${Bookings.slug}/${e.event.id}`
  }
  return (
    <DefaultTemplate className="demo-app">
      <div className={`${baseClass}__content gutter--left gutter--right`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          // editable={true}
          // selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventClick={openEvent}
          // events={appointments.map((e: any) => formatEventData(e))}
          events={events} // alternatively, use the `events` setting to fetch from a feed
          // initialEvents={INIT} // alternatively, use the `events` setting to fetch from a feed
          // select={handleDateSelect}
          // eventContent={renderEventContent} // custom render function
          // eventClick={handleEventClick}
          // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
                      eventAdd={function(){}}
                      eventChange={function(){}}
                      eventRemove={function(){}}
                      */
        />
      </div>
    </DefaultTemplate>
  )
}
function formatEventData(e: Booking) {
  const title = typeof e.product === 'string' ? e.product : e.product?.title
  const pid = typeof e.product === 'string' ? e.product : e.product.id

  return {
    id: e.id,
    title,
    start: formatDateWithoutTime(new Date(e.startDate)),
    end: formatDateWithoutTime(new Date(e.endDate)),
    raw: e,
    color: getEventColor(pid),
  }
  // const res = e.items[0]
  // const title = res.product.title
  // const start = res.startDate
  // const end = res.endDate
  // return {
  //   id: e.id,
  //   title,
  //   start,
  //   end,
  //   raw: e,
  // }
}

function getEventColor(id?: string) {
  if (id && STATIC_COLOR_MAP[id]) {
    return STATIC_COLOR_MAP[id]
  }
}
function getBookings() {
  payload.find({
    collection: 'bookings',
  })
}
function formatDateWithoutTime(date: Date): string {
  return date.toLocaleDateString('en-CA') // 'en-CA' gives the format 'YYYY-MM-DD'
}
