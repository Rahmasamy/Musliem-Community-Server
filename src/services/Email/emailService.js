// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465, // ← Use SSL port instead of 587
//   secure: true, // ← Enable SSL
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Email transporter error:", error);
//   } else {
//     console.log("✅ Email server is ready to send messages");
//   }
// });

// const sendEmail = async ({ to, subject, html }) => {
//   const info = await transporter.sendMail({
//     from: `"No Reply" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
//   return info;
// };

// export { sendEmail };
// export default sendEmail;
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: `"No Reply" <${process.env.EMAIL_USER}>`, // or your verified domain
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", data);
    return data;
  } catch (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }
};

// Verify on startup
(async () => {
  try {
    console.log("✅ Email service initialized with Resend");
  } catch (error) {
    console.error("❌ Email service error:", error);
  }
})();

export { sendEmail };
export default sendEmail;
