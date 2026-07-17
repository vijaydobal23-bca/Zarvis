import "dotenv/config.js";
import { sendEmail } from "./src/services/mail.service.js";

async function test() {
  try {
    await sendEmail({
      to: "vijaydobal23@gmail.com",
      subject: "Test",
      text: "Test email",
      html: "<p>Test email</p>"
    });
    console.log("Success");
  } catch (err) {
    console.error("Failed", err);
  }
}
test();
