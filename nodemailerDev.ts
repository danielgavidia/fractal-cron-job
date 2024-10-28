import * as dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
  // Create a transporter with your email service credentials
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail' for Gmail, 'yahoo' for Yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
    logger: true,
    debug: true,
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to, // Receiver email
    subject, // Email subject
    text, // Plain text version of the email
    html, // Optional: HTML version of the email
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Usage example
sendEmail("dgavidia1@gmail.com", "Hello!", "This is a test email.");
