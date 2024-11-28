import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract the data from the request body
    const { to, subject, body } = req.body;

    // Create a transporter using your email service credentials (e.g., Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password (or an App Password if 2FA is enabled)
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to, // Receiver address
      subject: subject, // Subject of the email
      text: body, // Email body (plain text)
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    // Handle any non-POST requests
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
