import nodemailer from 'nodemailer'
export  const sendEmail =async  (
  recipient: string,
  subject: string,
  body: string
)=> {
  // Create a transporter using SMTP (for Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail", // For Gmail; use other services if needed
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_ADDRESS, // Your Gmail email
      pass: process.env.EMAIL_PASSWORD, // Your Gmail password or app password if 2FA is enabled
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS, // Sender email
    to: recipient, // Recipient email
    subject: subject, // Email subject
    text: body, // Email body
  };

  // Send email
await transporter.sendMail(mailOptions)

  
};
