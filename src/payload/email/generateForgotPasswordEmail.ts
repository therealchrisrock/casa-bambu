import generateEmailHTML from './generateEmailHTML'

const generateForgotPasswordEmail = async ({ token }): Promise<string> =>
  generateEmailHTML({
    headline: 'Locked out?',
    content: "<p>That's okay, it happens! Click on the button below to reset your password.</p>",
    cta: {
      buttonLabel: 'Reset your password',
      url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}`,
    },
  })

export default generateForgotPasswordEmail
