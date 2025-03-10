import dotenv from 'dotenv'
import express from 'express'
import next from 'next'
import nextBuild from 'next/dist/build'
import path from 'path'
import payload from 'payload'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})
import nodemailer from 'nodemailer'
import { mediaManagement } from 'payload-cloudinary-plugin'

import { seed } from './payload/seed'

const app = express()
const PORT = process.env.PORT || 3000
app.use(
  mediaManagement({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  }),
)
// Add middleware to parse JSON bodies
app.use(express.json())
const transport = nodemailer.createTransport({
  service: 'postmark',
  host: process.env.SMTP_HOST,
  auth: {
    accessToken: process.env.POSTMARK_TOKEN,
    privateKey: process.env.POSTMARK_SECRET,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false (the default) for 587 and others
  requireTLS: true,
})
const start = async (): Promise<void> => {
  await payload.init({
    email:
      process.env.NODE_ENV === 'development'
        ? {
            fromName: 'Ethereal Email',
            fromAddress: 'example@ethereal.com',
            logMockCredentials: true,
          }
        : {
            fromName: 'Casa Bambu Support',
            fromAddress: 'contact@casabambuwestbay.com',
            transport,
          },
    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  if (process.env.PAYLOAD_SEED === 'true') {
    await seed(payload)
    process.exit()
  }

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`)
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))
      process.exit()
    })

    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    port: Number(PORT),
  })

  const nextHandler = nextApp.getRequestHandler()
  app.use((req, res) => nextHandler(req, res))
  nextApp.prepare().then(() => {
    payload.logger.info('Starting Next.js...')

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
