import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  login: String,
  email: { type: String, unique: true },
  password: String,
  meta: { type: String, enum: ["admin", "customer"], default: "customer" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
