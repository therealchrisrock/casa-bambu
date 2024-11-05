import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
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
  'the-casa-bambu': '#FF69B4', // Tomato (red)
  'the-tortuga': '#6A5ACD', // Steel Blue
  'the-seahorse': '#20B2AA', // Lime Green
}
import { DefaultTemplate } from 'payload/components/templates'
import { useConfig } from 'payload/components/utilities'
import { useDocumentDrawer } from 'payload/dist/admin/components/elements/DocumentDrawer'
import { useMediaQuery } from 'usehooks-ts'

import { Bookings, bookingStatusMap } from '../../collections/Bookings'
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
import { cn } from '@/_lib/utils'

export const Calendar = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

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
      <div className={`${baseClass}__content `}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, listPlugin, dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          initialView={'dayGridMonth'}
          height={'85vh'}
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
          eventContent={renderEventContent} // custom render function
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
function renderEventContent(eventInfo) {
  // getBookingStatusLabel(eventInfo.event.extendedProps.status)
  return(
    <>
      <b>{eventInfo.event.title} {eventInfo.event.extendedProps.type === 'blockout' ? '(blockout)' : ''}</b><br></br>
    </>
  )
}
function formatEventData(e: Booking) {
  const title = typeof e.product === 'string' ? e.product : e.product?.title
  const pid = typeof e.product === 'string' ? e.product : e.product.slug
  return {
    id: e.id,
    title,
    start: formatDateWithoutTime(new Date(e.startDate)),
    end: formatDateWithoutTime(new Date(e.endDate)),
    raw: e,
    status: e.bookingStatus,
    type: e.type,
    eventClassNames: [e.type === 'blockout' ? 'blockout' : 'reservation',
      e.bookingStatus],
    eventBackgroundColor: getEventColor(pid),
    eventBorderColor: getEventColor(pid),
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
function getBookingStatusLabel(v: string) {
  return bookingStatusMap.find(({label, value}) => value === v)?.label
}
function getBookings() {
  payload.find({
    collection: 'bookings',
  })
}
function formatDateWithoutTime(date: Date): string {
  return date.toLocaleDateString('en-CA') // 'en-CA' gives the format 'YYYY-MM-DD'
}
