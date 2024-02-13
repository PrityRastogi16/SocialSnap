const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendSMSVerification(phone, otp) {

  twilioClient.messages.create({
      body: `Your OTP for phone number verification is: ${otp}`,
      to: `+91${phone}`,
      from: '+917038536555',
  })
  .then(message => console.log(message.sid))
  .catch(error => console.error(error));
}
const transporter = nodemailer.createTransport({
 service:'gmail',
  auth: {
    user: process.env.SMTP_mail,
    pass: process.env.SMTP_pass,
  },
});  

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for sending emails");
    console.log(success);
  }
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendEmailVerification = async (email,otp) => {

  const mailOtp = {
    from: process.env.SMTP_mail,
    to: email,
    subject: 'OTP for verification',
    text: `Your OTP for verification is ${otp}. This will expire in 2 minutes`,
  };

  try {
    const info = await transporter.sendMail(mailOtp);
    console.log('Email sent:', info.response);
    return otp; 
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};

module.exports = {
  generateOtp,
  sendEmailVerification,
  sendSMSVerification
};
