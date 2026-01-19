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

export const sendGroupInviteEmail = async ({
    to,
    groupName,
    inviterName,
    acceptLink,
    rejectLink
}) => {
    const transporter = await createTransporter();

    await transporter.sendMail({
        from: `"Splitify" <${process.env.EMAIL_USER}>`,
        to,
        subject: `You're invited to join "${groupName}" on Splitify`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Group Invitation</h2>
                <p>
                    <strong>${inviterName}</strong> has invited you to join the group
                    <strong>"${groupName}"</strong> on Splitify.
                </p>

                <div style="margin: 20px 0;">
                    <a href="${acceptLink}"
                       style="padding: 10px 18px; background-color: #22c55e; color: #fff;
                              text-decoration: none; border-radius: 5px; margin-right: 10px;">
                        Accept Invite
                    </a>

                    <a href="${rejectLink}"
                       style="padding: 10px 18px; background-color: #ef4444; color: #fff;
                              text-decoration: none; border-radius: 5px;">
                        Reject Invite
                    </a>
                </div>

                <p style="color: #555;">
                    This invitation will expire in 24 hours.
                </p>

                <p style="font-size: 12px; color: #888;">
                    If you weren’t expecting this invite, you can safely ignore this email.
                </p>
            </div>
        `
    });
};
