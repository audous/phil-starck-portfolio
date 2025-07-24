const multer = require("multer");
const cloudinary = require("../../lib/cloudinary").default; // or remove .default if not using export default

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    await runMiddleware(req, res, upload.single("file"));
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileStr = req.file.buffer.toString("base64");
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileStr}`,
      { folder: "uploads" }
    );
    res
      .status(200)
      .json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
