// models/AddPage.js
import mongoose from "mongoose";

const AddPageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  html: { type: String, required: true },
});

export default mongoose.models.AddPage ||
  mongoose.model("AddPage", AddPageSchema);
