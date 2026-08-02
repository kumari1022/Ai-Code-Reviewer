import { useState } from "react";
import axios from "axios";
import { UploadCloud, FileCode, CheckCircle, AlertCircle, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".java")) {
        setFile(droppedFile);
      } else {
        alert("Only .java files are supported.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a Java file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      alert("File Uploaded Successfully");
      window.location.href = "/history"; // Safe redirect to the history list since that lists all reviews!
    } catch (error) {
      console.error(error);
      alert("Upload Failed. Please ensure the backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* NAVBAR */}
        <Navbar title="Upload Workspace" />

        {/* CONTENT */}
        <div className="p-8 md:p-10 max-w-3xl w-full mx-auto flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Upload Java Component
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Submit your Java source code to trigger automated structural and diagnostic AI reviews.
            </p>
          </div>

          <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-8 shadow-xl">
            
            {/* DROPZONE CONTAINER */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 relative ${
                dragActive
                  ? "border-blue-500 bg-blue-500/[0.02] shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                  : file
                  ? "border-emerald-500/50 bg-emerald-500/[0.01]"
                  : "border-slate-800 hover:border-slate-700 bg-slate-900/10"
              }`}
            >
              <input
                type="file"
                accept=".java"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />

              {!file ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800/80 mb-6 text-slate-400 group-hover:text-blue-400 transition-colors">
                    <UploadCloud size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-slate-200">
                    Drag & Drop Java File
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">
                    or click to browse your workspace files
                  </p>
                  <div className="mt-6 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Supported Format: .java
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 text-emerald-400">
                    <FileCode size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-200 truncate max-w-xs">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  
                  {/* Selected pill */}
                  <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} />
                    Ready to analyze
                  </div>

                  {/* Remove file button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    disabled={uploading}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-950/40 hover:text-red-400 flex items-center justify-center border border-slate-850 hover:border-red-900/20 transition-all z-20"
                    title="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* ACTION BUTTON */}
            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-4 mt-6 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                  uploading
                    ? "bg-slate-900 text-slate-500 border border-slate-850 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/10 hover:shadow-blue-500/20"
                }`}
              >
                {uploading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-slate-400 animate-spin"></span>
                    <span>Analyzing Component...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Upload & Trigger Review</span>
                  </>
                )}
              </button>
            )}

          </div>

          {/* Quick instructions panel */}
          <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-5 text-xs text-slate-500 leading-relaxed flex gap-3.5">
            <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <strong className="text-slate-400">Important Instructions:</strong>
              <span>1. Upload valid Java code (`.java` file extension). Files containing syntax errors will still be parsed but might produce lower review accuracy.</span>
              <span>2. To maintain review safety, avoid submitting hardcoded passwords, private tokens, or highly sensitive corporate secrets.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UploadPage;