import React, { useEffect, useMemo, useState } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { usePayloadAPI } from 'payload/components/hooks'
import { DefaultTemplate } from 'payload/components/templates'
import { useConfig } from 'payload/components/utilities'

import { Orders } from '../../collections/Orders'
import { AppointmentProvider, useAppointments } from './providers/AppointmentsProvider'

import './index.scss'
import { AppointmentModal } from './AppointmentModal'

export type EventData = {
  id: string
  title: string
  start: string
  end: string
  raw: any
}

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00',
  },
]

export function createEventId() {
  return String(eventGuid++)
}

function CalendarView() {
  const { openModal } = useAppointments()
  // const currentEvents = useEvent()
  const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS)

  const {
    routes: { api, admin: adminUrl },
    admin,
    serverURL,
  } = useConfig()
  const [
    {
      data: { docs: appointments },
      isLoading,
    },
  ] = usePayloadAPI(`${serverURL}${api}/${Orders.slug}`)

  useEffect(() => {
    if (!appointments) return
    console.log(appointments)
    setCurrentEvents(appointments.map((e: any) => formatEventData(e)))
  }, [appointments])

  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
    }
  }

  function handleEventClick(clickInfo) {
    console.log('clickinfo', clickInfo.event.extendedProps.raw)
    window.location.href = `${adminUrl}/collections/orders/${clickInfo.event.extendedProps.raw.id}`
    // openModal({ type: 'edit', appointment: clickInfo.event.extendedProps.raw })
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
  }

  // function handleEvents(events) {
  //   setCurrentEvents(events)
  // }

  return (
    <>
      <AppointmentProvider>
        <DefaultTemplate className="demo-app">
          <div className={`${baseClass}__content gutter--left gutter--right`}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              // editable={true}
              // selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              // events={appointments.map((e: any) => formatEventData(e))}
              events={currentEvents} // alternatively, use the `events` setting to fetch from a feed
              // initialEvents={INIT} // alternatively, use the `events` setting to fetch from a feed
              // select={handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
              /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
            />
          </div>
        </DefaultTemplate>
      </AppointmentProvider>
      <AppointmentModal />
    </>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

const baseClass = 'custom-minimal-view'

function formatEventData(e: any): EventData {
  const res = e.items[0]
  const title = res.product.title
  const start = res.startDate
  const end = res.endDate
  return {
    id: e.id,
    title,
    start,
    end,
    raw: e,
  }
}

function Calendar() {
  return (
    <AppointmentProvider>
      <CalendarView />
    </AppointmentProvider>
  )
}
export default Calendar
