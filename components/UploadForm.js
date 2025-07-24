import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setImgUrl(data.url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button type="submit">Upload</button>
      {imgUrl && (
        <div>
          <p>Uploaded image:</p>
          <img src={imgUrl} alt="Uploaded" style={{ maxWidth: 300 }} />
        </div>
      )}
    </form>
  );
}
