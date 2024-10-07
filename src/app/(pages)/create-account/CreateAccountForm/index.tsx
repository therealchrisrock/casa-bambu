'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'

import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'
import { PhoneInput } from '@/_components/ui/phone-input'

type FormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export const registerUserSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    password: z.string().min(4,{ message: 'Must contain at least 4 characters' }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })
const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      console.log(data)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (redirect) router.push(redirect as string)
        else router.push(`/account?success=${encodeURIComponent('Account created successfully')}`)
      } catch (_) {
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <Message error={error} />
            <div className="grid gap-4">
              <div className="grid grid-cols-1 space-y-4 gap-4">
                <div className="grid gap-4">
                  <div className={' grid grid-cols-2 gap-2'}>
                    <div className={'col-span-1'}>
                      <FormField
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className={'col-span-1'}>
                      <FormField
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Phone Number</FormLabel>
                        <FormControl className="w-full">
                          <PhoneInput
                            defaultCountry={'CA'}
                            placeholder="Enter a phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type={'password'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="confirmPassword"
                    // validate={value => value === password.current || 'The passwords do not match'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type={'password'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {loading ? 'Processing' : 'Create Account'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link
                href={`/login${
                  searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''
                }`}
                className="underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export default CreateAccountForm
