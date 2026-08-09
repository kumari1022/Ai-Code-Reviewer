import { useState } from "react";
import axios from "axios";
import { UploadCloud, FileCode, CheckCircle, AlertCircle, X, ArrowRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { API_URL } from "../config";

const ALLOWED_EXTENSIONS = [
  ".java", ".py", ".js", ".jsx", ".ts", ".tsx",
  ".cpp", ".c", ".h", ".hpp", ".go", ".rs",
  ".cs", ".php", ".rb", ".sql", ".txt"
];

function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAllowedFile = (fileName) => {
    const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  };

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
    setError("");
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isAllowedFile(droppedFile.name)) {
        setFile(droppedFile);
      } else {
        setError("Unsupported file format. Please upload .java, .py, .js, .ts, .cpp, .go, or .rs files.");
      }
    }
  };

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isAllowedFile(selectedFile.name)) {
        setFile(selectedFile);
      } else {
        setError("Unsupported file format. Please upload .java, .py, .js, .ts, .cpp, .go, or .rs files.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a source code file first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      setSuccess("Source file uploaded and analyzed successfully! Redirecting to audit history...");
      setTimeout(() => {
        window.location.href = "/history";
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Upload or AI analysis failed. Please verify system status.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar title="Multi-Language Upload Studio" />

        <div className="p-6 md:p-8 max-w-3xl w-full mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Upload Source Code Component
            </h1>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">
              Upload Java, Python, JavaScript, TypeScript, C++, Go, or Rust source files for instant AI diagnostic audits.
            </p>
          </div>

          {/* NOTIFICATIONS */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 shadow-xl">
            
            {/* DROPZONE CONTAINER */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center transition-all duration-200 relative ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10 shadow-lg"
                  : file
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
              }`}
            >
              <input
                type="file"
                accept=".java,.py,.js,.jsx,.ts,.tsx,.cpp,.c,.h,.hpp,.go,.rs,.cs,.php,.rb,.sql,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />

              {!file ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 mb-5 text-slate-400">
                    <UploadCloud size={26} className="text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Drag &amp; Drop Source Code File
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5">
                    or click to browse your workspace files
                  </p>
                  <div className="mt-5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                    Supported: .java, .py, .js, .ts, .cpp, .go, .rs
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4 text-emerald-400">
                    <FileCode size={26} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 truncate max-w-xs">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="mt-4 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 flex items-center gap-1 transition-all z-20"
                  >
                    <X size={13} />
                    <span>Remove File</span>
                  </button>
                </div>
              )}
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-6 py-3 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-md transition-all ${
                  !file || uploading
                    ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                }`}
              >
                <span>{uploading ? "Analyzing Source File..." : "Run AI Code Audit"}</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>

          {/* INFORMATION CARD */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-300">Supported Inspection Languages:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-blue-400">☕ Java (.java)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-amber-400">🐍 Python (.py)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-yellow-400">⚡ JavaScript (.js)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-indigo-400">🔷 TypeScript (.ts)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-purple-400">⚙️ C++ (.cpp, .c)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-cyan-400">🐹 Go (.go)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-orange-400">🦀 Rust (.rs)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-850 text-emerald-400">🗄️ SQL (.sql)</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UploadPage;