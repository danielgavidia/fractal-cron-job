import { sendEmail } from "./utils/nodemailer";
import { getEODReport } from "./utils/report";

async function reportWorker(email: string, username: string, subject: string): Promise<void> {
  const report = await getEODReport(username);
  await sendEmail(email, subject, report);
  return;
}

await reportWorker("dgavidia1@gmail.com", "danielgavidia", "EOD Report");
