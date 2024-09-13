'use client'

import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'

import { Button } from '@/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'

import classes from './index.module.scss'

type FormData = {
  email: string
  password: string
}

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<FormData>()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = form
  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/account')
      } catch (_) {
        setError(
          'There was an error with the email and password provided. Please try again, or create a new account below if you have not done so already.',
        )
      }
    },
    [login, router],
  )

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Message error={error} />
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
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className={classes.submit}>
                {isLoading ? 'Processing' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm space-y-2">
              Don&apos;t have an account?{' '}
              <Link href={`/create-account${allParams}`} className="underline">
                Sign up
              </Link>
              <br />
              <Link href={`/recover-password${allParams}`}>Recover your password</Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export const description =
  "A simple login form with email and password. The submit button says 'Sign in'."

export default LoginForm
