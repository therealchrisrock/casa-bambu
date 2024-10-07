'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { Message } from '../Message'

import classes from './index.module.scss'
import { useToast } from '@/hooks/use-toast'

export type Props = {
  params?: string[]
  message?: string
  className?: string
  onParams?: (paramValues: ((string | null | undefined) | string[])[]) => void
}

export const RenderParamsComponent: React.FC<Props> = ({
  params = ['error', 'warning', 'success', 'message'],
  className,
  onParams,
}) => {
  const searchParams = useSearchParams()
  const paramValues = params.map(param => searchParams?.get(param))
  const { toast } = useToast()

  useEffect(() => {
    if (paramValues.length && onParams) {
      onParams(paramValues)
    }
  }, [paramValues, onParams])

  if (paramValues.length) {
    return (
      <div className={className}>
        {paramValues.map((paramValue, index) => {
          if (!paramValue) return null
          // toast({
          //   description: 'hello'
          // })
          return (
            <Message
              className={classes.renderParams}
              key={paramValue}
              {...{
                [params[index]]: paramValue,
              }}
            />
          )
        })}
      </div>
    )
  }

  return null
}
