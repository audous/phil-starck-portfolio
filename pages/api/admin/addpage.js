// pages/api/admin/addpage.js
import dbConnect from "../../../lib/dbConnect";
import AddPage from "../../../models/AddPage";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { title, html } = req.body;
    if (!title || !html)
      return res.status(400).json({ error: "Missing fields" });

    try {
      const newPage = await AddPage.create({ title, html });
      return res.status(201).json(newPage);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const pages = await AddPage.find({});
      return res.status(200).json(pages);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
