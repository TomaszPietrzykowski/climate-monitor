const catchError = require("../utilities/catchError")
const nodemailer = require("nodemailer")
const appEmails = require("../utilities/appEmails")

// ***************************************************
//
//     I Website contact form handler
//
exports.sendEmail = catchError(async (req, res) => {
  const senderEmail = req.body.email
  const senderName = req.body.name
  const content = req.body.message

  // 1. Get content of
  // a) original message from contact form
  const output = `<p>From: ${senderName}</p>
  <p>Email: ${senderEmail}</p>
  <p>${content}</p>
  `
  const txt = `${content}`

  // b) confirmation message to sender
  const outputResponse = appEmails.sendEmailConfirmationHtml(senderName)
  const txtResponse = appEmails.sendEmailConfirmationTxt(senderName)

  // c) receiver new email notification
  const outputNotify = appEmails.newEmailNotificationHtml(
    senderEmail,
    senderName
  )
  const txtNotify = appEmails.newEmailNotificationTxt(senderEmail, senderName)

  // 2. Create  transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_CLIENT_ID,
      pass: process.env.EMAIL_CLIENT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  // 3. Send actual email
  let info = await transporter.sendMail({
    from: process.env.DEVELOPER_OFFICIAL_EMAIL,
    to: process.env.DEVELOPER_OFFICIAL_EMAIL,
    replyTo: `${senderName}<${senderEmail}>`,
    subject: `New message from: ${senderName}<${senderEmail}>`,
    text: txt,
    html: output,
  })

  // 4. Send confirmation email
  await transporter.sendMail({
    from: process.env.DEVELOPER_OFFICIAL_EMAIL,
    to: `${senderName}<${senderEmail}>`,
    subject: `Thank you for reaching out to us :)`,
    text: txtResponse,
    html: outputResponse,
  })

  // 5. Send new email notification to receiver
  await transporter.sendMail({
    from: process.env.DEVELOPER_OFFICIAL_EMAIL,
    to: process.env.DEVELOPER_CONFIRMATION_EMAIL,
    subject: `New email in Climate Monitor inbox!`,
    text: txtNotify,
    html: outputNotify,
  })
  res.status(200).json({
    status: "success",
    message: "email has been sent",
    envelope: info.envelope,
    accepted: info.accepted,
  })
})
