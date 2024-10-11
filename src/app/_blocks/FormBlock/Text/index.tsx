import React from 'react'
import { TextField } from 'payload-plugin-form-builder/dist/types'
import { UseFormRegister, FieldValues, FieldErrorsImpl } from 'react-hook-form'
import { Error } from '../Error'
import { Width } from '../Width'

import classes from './index.module.scss'
import { Label } from '@/_components/ui/label'
import { Input } from '@/_components/ui/input'

export const Text: React.FC<
  TextField & {
    register: UseFormRegister<FieldValues & any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, label, width, register, required: requiredFromProps, errors }) => {
  return (
    <Width width={width}>
      <div className={classes.wrap}>
        <Label htmlFor={name} className={classes.label}>
          {label}
        </Label>
        <Input
          type="text"
          id={name}
          {...register(name, { required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error />}
      </div>
    </Width>
  )
}
