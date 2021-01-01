const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromMail = 'boxome3526@1092df.com'

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: fromMail,
    from: fromMail,
    subject: 'Welcome to task manager app!',
    text: `Hi ${name}, hope you will love this app.`,
  }).then(() => {
    console.log('Email sent')
  })
    .catch((error) => {
      console.error(error)
    })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: fromMail,
    from: fromMail,
    subject: 'We will miss you.',
    text: `Hi ${name}, We heared that you are leaving.`,
  }).then(() => {
    console.log('Email sent')
  })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
