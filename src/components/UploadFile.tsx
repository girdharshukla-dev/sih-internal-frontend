import { useState } from "react";
import { useNavigate } from "react-router";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailInput, setEmailInput] = useState<string>("");

  const navigate = useNavigate();

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
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const goToDashboard = () => {
    if (!emailInput) return;
    navigate(`/tasks/email/${emailInput}`);
  };

  return (
    <div className="flex flex-col items-center mx-4 my-3 gap-4">
      {/* Email input */}
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter email"
          className="input input-bordered"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={goToDashboard}
        >
          Go to Dashboard
        </button>
      </div>

      {/* File upload */}
      <div className="flex gap-2 items-center justify-center">
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
    </div>
  );
}
