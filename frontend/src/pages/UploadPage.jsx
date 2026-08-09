import { useState } from "react";
import axios from "axios";
import { UploadCloud, FileCode, CheckCircle, AlertCircle, X, ArrowRight, ShieldCheck } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

const ALLOWED_EXTENSIONS = [
  ".java", ".py", ".js", ".jsx", ".ts", ".tsx",
  ".cpp", ".c", ".h", ".hpp", ".go", ".rs",
  ".cs", ".php", ".rb", ".sql", ".txt"
];

// OFFICIAL REAL BRAND TECH SVG LOGOS
const TechLogos = {
  java: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C10.5 3.5 12 5 11 6.5C10 8 8 9 9 10" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14.5 3C13.5 4.5 14.5 5.5 13.5 7C12.5 8.5 11 9.5 12 10.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 15C5 17.5 8 19 12 19C16 19 19 17.5 19 15C19 13.5 16.5 13.5 16.5 13.5H7.5C7.5 13.5 5 13.5 5 15Z" fill="#38bdf8" opacity="0.3" stroke="#38bdf8" strokeWidth="1.5"/>
      <path d="M6 18C7.5 19.5 9.5 20.5 12 20.5C14.5 20.5 16.5 19.5 18 18" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  python: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M11.9 2C8.6 2 8.3 3.4 8.3 3.4L8.3 5.4H12.1V6H6.6C4.4 6 2 7.2 2 10.5C2 13.8 3.9 14.3 5.7 14.3H6.8V12.7C6.8 10.7 8.5 9.1 10.5 9.1H14.1C15.6 9.1 16.8 7.9 16.8 6.4V5.4C16.8 3.3 15.2 2 11.9 2Z" fill="#38bdf8"/>
      <path d="M12.1 22C15.4 22 15.7 20.6 15.7 20.6V18.6H11.9V18H17.4C19.6 18 22 16.8 22 13.5C22 10.2 20.1 9.7 18.3 9.7H17.2V11.3C17.2 13.3 15.5 14.9 13.5 14.9H9.9C8.4 14.9 7.2 16.1 7.2 17.6V18.6C7.2 20.7 8.8 22 12.1 22Z" fill="#facc15"/>
    </svg>
  ),
  javascript: (
    <svg className="w-5 h-5 rounded" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#facc15"/>
      <path d="M12 17.5C12.5 18.3 13.3 18.8 14.4 18.8C15.7 18.8 16.5 18.1 16.5 17C16.5 15.9 15.8 15.4 14.2 14.7L13.4 14.4C11.5 13.6 10.4 12.6 10.4 10.6C10.4 8.6 12.1 7.2 14.4 7.2C16 7.2 17.2 7.8 18 9.1L16.2 10.2C15.6 9.3 15 8.9 14.3 8.9C13.5 8.9 12.9 9.4 12.9 10.2C12.9 11 13.5 11.4 14.9 12.1L15.7 12.4C18 13.4 19 14.3 19 16.6C19 19 17.1 20.5 14.4 20.5C12.1 20.5 10.5 19.4 9.7 17.7L12 17.5Z" fill="#090d16"/>
      <path d="M6 17.7C6.6 18.4 7.4 18.8 8.4 18.8C9.5 18.8 10.2 18.3 10.2 16.7V7.5H12.7V16.8C12.7 19.8 11 20.5 8.4 20.5C6.3 20.5 4.8 19.4 4.1 17.9L6 17.7Z" fill="#090d16"/>
    </svg>
  ),
  typescript: (
    <svg className="w-5 h-5 rounded" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#3178c6"/>
      <path d="M12.5 9H8.5V20H11V11.5H12.5V9Z" fill="white"/>
      <path d="M14.5 17.5C15 18.3 15.8 18.8 16.9 18.8C18.2 18.8 19 18.1 19 17C19 15.9 18.3 15.4 16.7 14.7L15.9 14.4C14 13.6 12.9 12.6 12.9 10.6C12.9 8.6 14.6 7.2 16.9 7.2C18.5 7.2 19.7 7.8 20.5 9.1L18.7 10.2C18.1 9.3 17.5 8.9 16.8 8.9C16 8.9 15.4 9.4 15.4 10.2C15.4 11 16 11.4 17.4 12.1L18.2 12.4C20.5 13.4 21.5 14.3 21.5 16.6C21.5 19 19.6 20.5 16.9 20.5C14.6 20.5 13 19.4 12.2 17.7L14.5 17.5Z" fill="white"/>
    </svg>
  ),
  cpp: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="7" y="15" fill="#a855f7" fontSize="8" fontWeight="bold" fontFamily="monospace">C++</text>
    </svg>
  ),
  go: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#06b6d4" fillOpacity="0.2" stroke="#06b6d4" strokeWidth="1.5"/>
      <text x="6" y="15" fill="#06b6d4" fontSize="9" fontWeight="bold" fontFamily="monospace">GO</text>
    </svg>
  ),
  rust: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="12" cy="12" r="5" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5"/>
      <text x="7.5" y="15" fill="#f97316" fontSize="7" fontWeight="bold" fontFamily="sans-serif">RS</text>
    </svg>
  ),
  sql: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#10b981" strokeWidth="1.5"/>
      <path d="M4 6V12C4 13.6 7.6 15 12 15C16.4 15 20 13.6 20 12V6" stroke="#10b981" strokeWidth="1.5"/>
      <path d="M4 12V18C4 19.6 7.6 21 12 21C16.4 21 20 19.6 20 18V12" stroke="#10b981" strokeWidth="1.5"/>
    </svg>
  )
};

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
      setError("Upload or static analysis failed. Please verify system status.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError("");
    setSuccess("");
  };

  // Get matching tech logo based on filename extension
  const getFileLogo = (filename) => {
    if (!filename) return <FileCode size={26} className="text-blue-400" />;
    const lower = filename.toLowerCase();
    if (lower.endsWith(".java")) return TechLogos.java;
    if (lower.endsWith(".py")) return TechLogos.python;
    if (lower.endsWith(".js") || lower.endsWith(".jsx")) return TechLogos.javascript;
    if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return TechLogos.typescript;
    if (lower.endsWith(".cpp") || lower.endsWith(".c")) return TechLogos.cpp;
    if (lower.endsWith(".go")) return TechLogos.go;
    if (lower.endsWith(".rs")) return TechLogos.rust;
    if (lower.endsWith(".sql")) return TechLogos.sql;
    return <FileCode size={26} className="text-blue-400" />;
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar title="Multi-Language Audit Studio" />

        <div className="p-6 md:p-8 max-w-3xl w-full mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <UploadCloud className="text-blue-500" size={28} />
              <span>Upload Source Code Module</span>
            </h1>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">
              Upload Java, Python, JavaScript, TypeScript, C++, Go, or Rust source files for static diagnostic analysis.
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
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 mb-5 text-slate-400 shadow-md">
                    <UploadCloud size={26} className="text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Drag &amp; Drop Source Code File
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5">
                    or click to browse your workspace files
                  </p>
                  <div className="mt-5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                    Supported: .java, .py, .js, .ts, .cpp, .go, .rs, .sql
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 mb-4 text-emerald-400 shadow-lg">
                    {getFileLogo(file.name)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 truncate max-w-xs">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
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
                <span>{uploading ? "Analyzing Source File..." : "Run Code Audit"}</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>

          {/* INFORMATION CARD WITH OFFICIAL REAL TECH LOGOS */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 text-xs text-slate-400 space-y-3 shadow-xl">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400" />
              <span>Official Language Audit Runtimes:</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono text-[11px]">
              
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.java}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">Java</p>
                  <p className="text-[10px] text-slate-500 mt-1">.java</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.python}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">Python</p>
                  <p className="text-[10px] text-slate-500 mt-1">.py</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.javascript}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">JavaScript</p>
                  <p className="text-[10px] text-slate-500 mt-1">.js, .jsx</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.typescript}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">TypeScript</p>
                  <p className="text-[10px] text-slate-500 mt-1">.ts, .tsx</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.cpp}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">C++</p>
                  <p className="text-[10px] text-slate-500 mt-1">.cpp, .c, .h</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.go}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">Go</p>
                  <p className="text-[10px] text-slate-500 mt-1">.go</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.rust}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">Rust</p>
                  <p className="text-[10px] text-slate-500 mt-1">.rs</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 flex items-center gap-2.5 text-slate-200">
                {TechLogos.sql}
                <div className="overflow-hidden">
                  <p className="font-bold text-white leading-none">SQL</p>
                  <p className="text-[10px] text-slate-500 mt-1">.sql</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UploadPage;