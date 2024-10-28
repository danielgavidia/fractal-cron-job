import * as dotenv from "dotenv";
import Mailjet from "node-mailjet";

dotenv.config();

// Initialize Mailjet with API credentials
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY || "",
  apiSecret: process.env.MAILJET_API_SECRET || "",
});

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: {
    email: string;
    name: string;
  };
}

async function sendEmail({
  to,
  subject,
  text,
  html,
  from = {
    email: process.env.DEFAULT_FROM_EMAIL || "",
    name: process.env.DEFAULT_FROM_NAME || "",
  },
}: EmailParams): Promise<boolean> {
  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: from.email,
            Name: from.name,
          },
          To: [
            {
              Email: to,
              Name: to.split("@")[0], // Use part before @ as name
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html || text,
        },
      ],
    });

    console.log("Email sent successfully:", response.body);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

// Example usage
async function main() {
  const emailResult = await sendEmail({
    to: "recipient@example.com",
    subject: "Test Email",
    text: "This is a test email sent from Mailjet API",
    html: "<h3>This is a test email sent from Mailjet API</h3>",
  });

  console.log("Email sent:", emailResult);
}

// Run the example if this file is run directly
if (require.main === module) {
  main().catch(console.error);
}

export { sendEmail };
