//
//
//   Application level email contents for confirmation and notification purposes
//
//
const template = require("./emailTemplate")

//    ***************************************************************************
//
// 1. New email from contact form notification
//    @: vendor
exports.newEmailNotificationHtml = (senderEmail, senderName) => {
  return template(`
      <p>New message from contact form:</p>
      <p>From: ${senderName}</p>
      <p>Email: ${senderEmail}</p>
      <p>Read the full message: <a href="poczta.mydevil.net">open email client</a></p>
      `)
}
exports.newEmailNotificationTxt = (senderEmail, senderName) => {
  return `New message from contact form: ${senderName}\n email: ${senderEmail}. \n\nRead the full message: poczta.mydevil.net`
}

//    ***************************************************************************
//
// 2. Success sending email from contact form notification
//    @: client
exports.sendEmailConfirmationHtml = (senderName) => {
  return template(`
  <p>Hi ${senderName}, thank you for sending me an email.</p>
  <p>I usually answer within hours.</p>
  <br/><br/>
  <p>In a meantime, take care!</p>
  <p>Tomasz at <a href="https://climatemonitor.info">ClimateMonitor.info</a></p>
  
  `)
}
exports.sendEmailConfirmationTxt = (senderName) => {
  return `${senderName}\n, thank you for sending me an email. \nI will answer as soon as possible.`
}
