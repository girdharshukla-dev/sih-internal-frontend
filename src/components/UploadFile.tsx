import { useState } from "react"


export default function UploadFile() {

  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("loading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/task/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      setResponse(data);
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }

      if (!data) {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    }
  }


  return (
    <div className="flex mx-4 my-3 gap-2 items-center justify-center">
      <input
        type="file"
        className="file-input file-input-neutral"
        onChange={handleChange}
      />

      <button
        className="btn btn-neutral btn-dash"
        onClick={handleUpload}
      >
        {status === "idle" && "Upload"}
        {status === "loading" && "Loading..."}
        {status === "success" && "OK ✅"}
        {status === "error" && "Retry ❌"}
      </button>
    </div>
  )
}
