'use client'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export const Message: React.FC<{
  message?: React.ReactNode
  error?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
  className?: string
}> = ({ message, error, success, warning, className }) => {
  const messageToRender = message || error || success || warning
  const effectWasExecuted = useRef(false)
  useEffect(() => {
    if (!messageToRender || effectWasExecuted.current) return
    effectWasExecuted.current = true
    if (error) {
      toast.error(error)
    }
    if (warning) {
      toast.warning(warning)
    }
    if (success) {
      toast.success(success)
    }
    if (!error && !warning && !success) {
      toast(message)
    }
  }, [])
  return <></>
}
