import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function UploadPage() {

  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    if (!file) {

      alert("Select Java File");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8081/api/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      window.location.href = "/review";

      alert("File Uploaded Successfully");

    } catch (error) {

      console.error(error);

      alert("Upload Failed");
    }
  };

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-10">

          <h1 className="text-4xl font-bold text-white mb-4">
            Upload Java File
          </h1>

          <p className="text-slate-400 mb-8">
            Upload source code for AI review
          </p>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 w-[500px]">

            <input
              type="file"
              accept=".java"
              className="text-white mb-6"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Upload File
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UploadPage;