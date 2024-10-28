console.log("test i'm inside crontab");

import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get directory path for current file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from absolute path
dotenv.config({ path: join(__dirname, ".env") });

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> {
  // Create a transporter with your email service credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true,
    debug: true,
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
