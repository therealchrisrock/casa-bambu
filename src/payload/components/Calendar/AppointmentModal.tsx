import React from 'react'
import { Modal } from '@faceless-ui/modal'
import { Button } from 'payload/components'
import { fieldTypes, Form, FormSubmit, RenderFields } from 'payload/components/forms'

import { Orders as Appointments } from '../../collections/Orders'
import { useAppointments } from './providers/AppointmentsProvider'

import './AppointmentModal.scss'

const baseClass = 'add-edit-appointment'

export const AppointmentModal = () => {
  const { addAppointment, modalProps, editAppointment, removeAppointment, toggleModal } =
    useAppointments()

  async function submit(data: any) {
    try {
      if (modalProps.props.type === 'edit') {
        editAppointment(data)
        return
      }
      addAppointment(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal className={baseClass} slug="add-edit-appointment">
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__content`}>
          <h1>
            {modalProps.props.type.charAt(0).toUpperCase() + modalProps.props.type.slice(1)}{' '}
            appointment
          </h1>
        </div>
        <Form onSubmit={submit}>
          {modalProps.props.type !== 'remove' && (
            <RenderFields fieldTypes={fieldTypes} fieldSchema={Appointments.fields} />
          )}
          <div className={`${baseClass}__controls`}>
            {modalProps.props.type === 'edit' ? (
              <>
                <FormSubmit>Update appointment</FormSubmit>
                <Button buttonStyle="error" onClick={() => toggleModal()}>
                  Cancel
                </Button>
              </>
            ) : modalProps.props.type === 'remove' ? (
              <Button
                buttonStyle="error"
                onClick={() => removeAppointment(modalProps.props.appointment?.id!)}
              >
                Remove appointment
              </Button>
            ) : (
              <FormSubmit>Add appointment</FormSubmit>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  )
}
