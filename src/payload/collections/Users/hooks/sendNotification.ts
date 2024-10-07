import payload from 'payload'

export const sendNotification = ({ doc, operation }) => {
  if (operation === 'create') {
    payload.sendEmail({
      to: doc.email,
      from: 'sender@example.com',
      subject: 'Welcome To Payload',
      html: '<b>Hey there!</b><br/>Welcome to Payload!',
    })
  }
}
