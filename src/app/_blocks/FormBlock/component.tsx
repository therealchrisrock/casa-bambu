'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Router from 'next/router'
// @ts-ignore
import { Form as FormType } from 'payload-plugin-form-builder/dist/types'

import { Form } from '../../../payload/payload-types'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

import { Button } from '@/_components/Button'
import { Gutter } from '@/_components/Gutter'
import RichText from '@/_components/RichText'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card'

import classes from './index.module.scss'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro?: Boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const ClientFormBlock: React.FC<
  FormBlockType & {
    id?: string
  }
> = props => {
  const {
    enableIntro,
    introContent,
    form: formFromProps,
    form: {
      title,
      id: formID,
      submitButtonLabel,
      confirmationType,
      redirect,
      confirmationMessage,
    } = {},
  } = props
  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = formMethods
  //
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ status?: string; message: string } | undefined>()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: NodeJS.Timer

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              status: res.status,
              message: res.errors?.[0]?.message || 'Internal Server Error',
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) Router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      submitForm()
    },
    [formID, redirect, confirmationType],
  )
  return (
    <Gutter top={true} narrow={true} left={false}>
      <div
        className={[classes.form, hasSubmitted && classes.hasSubmitted].filter(Boolean).join(' ')}
      >
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText className={classes.confirmationMessage} content={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        <div className={'grid grid-cols-1 lg:grid-cols-2'}>
          <div className={'col-span-1'}>
            {enableIntro && introContent && !hasSubmitted && (
              <RichText className={classes.intro} content={introContent} />
            )}
          </div>
          <div className={'col-span-1'}>
            {!hasSubmitted && (
              <form id={formID} onSubmit={handleSubmit(onSubmit)} className={'max-w-md mx-auto'}>
                <Card className={'mx-auto'}>
                  <CardHeader>
                    <CardTitle className={'text-2xl'}>{title}</CardTitle>
                    {/*<CardDescription>*/}
                    {/*  {enableIntro && introContent && !hasSubmitted && (*/}
                    {/*    <RichText className={classes.intro} content={introContent} />*/}
                    {/*  )}*/}
                    {/*</CardDescription>*/}
                  </CardHeader>
                  <CardContent className={'grid px-4'}>
                    <div className={'grid grid-cols-2 gap-4'}>
                      {formFromProps &&
                        formFromProps.fields &&
                        formFromProps.fields.map((field, index) => {
                          const Field: React.FC<any> = fields?.[field.blockType]
                          if (Field) {
                            return (
                              <React.Fragment key={index}>
                                <Field
                                  form={formFromProps}
                                  {...field}
                                  {...formMethods}
                                  register={register}
                                  errors={errors}
                                  control={control}
                                />
                              </React.Fragment>
                            )
                          }
                          return null
                        })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      label={submitButtonLabel}
                      appearance="primary"
                      el="button"
                      form={formID}
                    />
                  </CardFooter>
                </Card>
              </form>
            )}
          </div>
        </div>
      </div>
    </Gutter>
  )
}
