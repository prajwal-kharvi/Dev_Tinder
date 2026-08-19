// const { Resend } = require("resend");
//
// const resend = new Resend(process.env.RESEND_API_KEY);
//
// const sendEmail = async ({ to, subject, html }) => {
//     try {
//         const { data, error } = await resend.emails.send({
//             from: process.env.EMAIL_FROM,
//             to: [to],
//             subject,
//             html,
//         });
//
//         if (error) {
//             console.error("Email sending failed:", error);
//             return;
//         }
//
//         console.log("Email sent successfully:", data);
//     } catch (err) {
//         console.error("Email error:", err);
//     }
// };
//
// module.exports = sendEmail;