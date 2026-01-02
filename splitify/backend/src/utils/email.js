import nodemailer from "nodemailer";

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.verify();
    return transporter;
};

export const sendOtpEmail = async (to, otp) => {
    const transporter = await createTransporter();

    await transporter.sendMail({
        from: `"Splitify" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Splitify OTP",
        text: `Your OTP is ${otp}`
    });
};

export const sendResetPasswordEmail = async (to, resetLink) => {
    const transporter = await createTransporter();

    await transporter.sendMail({
        from: `"Splitify" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Reset your Splitify password",
        html: `
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you didn’t request this, ignore this email.</p>
        `
    });
};
