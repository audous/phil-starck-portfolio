// pages/api/auth/forgot-password.js

import dbConnect from "../../../lib/dbConnect"; // Update to your MongoDB util!
import User from "../../../models/User"; // Update to your user model path!
import nodemailer from "nodemailer";
import crypto from "crypto";

// Config - use .env for real secrets!
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"; // Or your Vercel URL

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  await dbConnect();

  // Always respond the same way (privacy)
  let user = await User.findOne({ email });

  if (user) {
    // Generate reset token and expiration (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    // Email link (to a page you’ll build)
    const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Support" <${GMAIL_USER}>`,
        to: user.email,
        subject: "Reset your password",
        html: `
          <p>Hi,</p>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetUrl}">Click here to reset your password</a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
    } catch (err) {
      // For debugging only, don't expose in prod
      return res.status(500).json({ message: "Could not send email" });
    }
  }

  // Always return generic success
  return res
    .status(200)
    .json({
      message:
        "If your email is in our system, you’ll get a reset link shortly.",
    });
}
