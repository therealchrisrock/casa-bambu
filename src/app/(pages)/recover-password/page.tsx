import React, { useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { RecoverPasswordForm } from './RecoverPasswordForm'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card'

import classes from './index.module.scss'

export default async function RecoverPassword() {
  return (
    <div>
      <Gutter className={classes.recoverPassword} narrow top>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Recover Password</CardTitle>
            <CardDescription>
              Please enter your email below. You will receive an email message with instructions on
              how to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className={'px-4'}>
            <RecoverPasswordForm />
            <div className="mt-4 text-center text-sm space-y-2">
              Already have an account?{' '}
              <Link href={`/login`} className="underline">
                Sign up
              </Link>
              <br />
            </div>
          </CardContent>
        </Card>
      </Gutter>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Recover Password',
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Recover Password',
    url: '/recover-password',
  }),
}
