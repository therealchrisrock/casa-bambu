import React from 'react'
import { EmailField } from 'payload-plugin-form-builder/dist/types'
import { UseFormRegister, FieldValues, FieldErrorsImpl } from 'react-hook-form'
import { Error } from '../Error'
import { Width } from '../Width'

import classes from './index.module.scss'
import { Label } from '@/_components/ui/label'
import { Input } from '@/_components/ui/input'

export const Email: React.FC<
  EmailField & {
    register: UseFormRegister<FieldValues & any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, width, label, register, required: requiredFromProps, errors }) => {
  return (
    <Width width={width}>
      <div className={classes.wrap}>
        <Label htmlFor={name} className={classes.label}>
          {label}
        </Label>
        <Input
          type="text"
          placeholder="Email"
          id={name}
          {...register(name, { required: requiredFromProps, pattern: /^\S+@\S+$/i })}
        />
        {requiredFromProps && errors[name] && <Error />}
      </div>
    </Width>
  )
}
