import React, { createContext, useContext, useState } from 'react'
import { useModal } from '@faceless-ui/modal'

import { Order as Appointment } from '../../../payload-types'
// import { Order as Appointment } from '../../../collections/Orders'

type SlotInfo = any
type ModalProps = {
  type: 'edit' | 'add' | 'remove'
  slotInfo?: SlotInfo
  appointment?: Appointment
}

type AppointmentContextType = {
  openModal: (props: ModalProps) => void
  removeAppointment: (id: string) => void
  editAppointment: (appointment: Appointment) => void
  addAppointment: (appointment: Appointment) => void
  toggleModal: () => void
  modalProps: {
    props: ModalProps
  }
}

const AppointmentContext = createContext<AppointmentContextType>({
  openModal: () => {},
  addAppointment: () => {},
  removeAppointment: () => {},
  editAppointment: () => {},
  toggleModal: () => {},
  modalProps: {
    props: { type: 'add', slotInfo: {} as SlotInfo },
  },
})

export const AppointmentProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [modalProps, setModalProps] = useState<{
    props: {
      type: 'add' | 'edit' | 'remove'
      slotInfo?: SlotInfo
      appointment?: Appointment
    }
  }>({
    props: {
      type: 'add',
    },
  })

  const { toggleModal } = useModal()

  const openModal = ({ type, slotInfo, appointment }: ModalProps) => {
    setModalProps({
      props: {
        type,
        slotInfo,
        appointment,
      },
    })
    toggleModal('add-edit-appointment')
  }

  const addAppointment = async () => {
    await updateAppointment()
    toggleModal('add-edit-appointment')
  }

  const editAppointment = async () => {
    await updateAppointment()
    toggleModal('add-edit-appointment')
  }

  const removeAppointment = async (id: string) => {
    await updateAppointment()
    toggleModal('add-edit-appointment')
  }

  const updateAppointment = async () => {
    return null
  }

  return (
    <AppointmentContext.Provider
      value={{
        openModal,
        addAppointment,
        removeAppointment,
        editAppointment,
        modalProps,
        toggleModal: () => toggleModal('add-edit-appointment'),
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

export const useAppointments = () => useContext(AppointmentContext)
