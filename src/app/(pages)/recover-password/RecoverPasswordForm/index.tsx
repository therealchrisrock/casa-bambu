'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Message } from '../../../_components/Message'

import { Button } from '@/_components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'

import classes from './index.module.scss'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type FormData = {
  email: string
}


const formSchema = z.object({
  email: z.string().email('This is not a valid email.').min(1, {
    message: 'You must provide an email',
  }),
})
export const RecoverPasswordForm: React.FC<{
  hasSuccessMsg?: boolean
  success?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}> = ({ success: successProp, hasSuccessMsg = true }) => {
  const [error, setError] = useState('')
  const internalSuccess = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })
  const [success, setSuccess] = successProp ? successProp : internalSuccess
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.ok) {
      setSuccess(true)
      form.reset({ email: '' })
      toast.success(
        'Your request has been submitted. Check your email for a link that will allow you to securely reset your password.',
      )
      setError('')
    } else {
      setError(
        'There was a problem while attempting to send you a password reset email. Please try again.',
      )
    }
  }, [])

  return (
    <Fragment>
      <div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={'grid gap-4'}>
            <Message error={error} className={classes.message} />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <Input {...field} required type="email" />
                </FormItem>
              )}
              name={'email'}
            />

            <Button type="submit" className={'w-full'}>
              Recover Password
            </Button>
          </form>
        </Form>
      </div>
    </Fragment>
  )
}
