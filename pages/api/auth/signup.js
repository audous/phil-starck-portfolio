// pages/api/auth/signup.js

import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { login, email, password } = req.body;

  if (!login || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    login,
    email,
    password: hashedPassword,
  });

  return res
    .status(201)
    .json({ message: "User created", user: { email: user.email } });
}
