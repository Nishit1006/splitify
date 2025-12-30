import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
    console.log("sendOtpEmail called");
    console.log("TO:", to);
    console.log("OTP:", otp);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // VERY IMPORTANT: verify SMTP connection
    await transporter.verify();
    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
        from: `"Splitify" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Splitify OTP",
        text: `Your OTP is ${otp}`, // plain text for safety
    });

    console.log("EMAIL SENT, MESSAGE ID:", info.messageId);
};
