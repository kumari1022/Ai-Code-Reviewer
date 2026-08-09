import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FolderCode, 
  Search, 
  Code2, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode, 
  Clock, 
  Sparkles,
  Plus
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

const LANG_COLORS = {
  JAVA: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PYTHON: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  JAVASCRIPT: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CPP: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  GO: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  RUST: "bg-orange-500/10 text-orange-400 border-orange-500/20"
};

function SavedCodesPage() {
  const navigate = useNavigate();
  const [savedCodes, setSavedCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLang, setSelectedLang] = useState("ALL");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchSavedCodes();
  }, []);

  const fetchSavedCodes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/codes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedCodes(res.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this saved code file?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/codes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedCodes(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete code snippet.");
    }
  };

  const handleCopy = (id, codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLoadInSandbox = (item) => {
    navigate("/direct-review", { state: { code: item.code, fileName: item.fileName } });
  };

  // Filtered code files
  const filteredCodes = savedCodes.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = selectedLang === "ALL" || item.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar title="Developer Code Repository &amp; Vault" />

        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <FolderCode className="text-blue-500" size={24} />
                <span>Code Repository Vault</span>
              </h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">
                All code files developed or saved across your projects in one secure place.
              </p>
            </div>

            <button
              onClick={() => navigate("/direct-review")}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              <Plus size={15} />
              <span>Create New Code File</span>
            </button>
          </div>

          {/* SEARCH & LANGUAGE FILTERS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 text-slate-500" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved files..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Language Badges */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {["ALL", "JAVA", "PYTHON", "JAVASCRIPT", "CPP", "GO", "RUST"].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    selectedLang === lang
                      ? "bg-blue-600/10 border-blue-500/40 text-blue-400"
                      : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {lang === "ALL" ? "All Languages" : lang}
                </button>
              ))}
            </div>
          </div>

          {/* CODE CARDS GRID */}
          {loading ? (
            <div className="h-64 flex flex-col justify-center items-center text-center">
              <span className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3"></span>
              <p className="text-xs text-slate-500">Loading code repository...</p>
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <FolderCode size={36} className="text-slate-700 mb-3" />
              <h3 className="text-sm font-semibold text-slate-200">No Saved Code Files Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                {searchTerm || selectedLang !== "ALL"
                  ? "No code files matched your search parameters."
                  : "You haven't saved any code files yet. Open the Live Sandbox Editor to write and save your code files."}
              </p>
              <button
                onClick={() => navigate("/direct-review")}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-400 hover:text-white transition-all"
              >
                Open Live Sandbox Editor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCodes.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-900 rounded-2xl p-5 shadow-lg hover:border-slate-800 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    {/* Title & Language */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileCode size={16} className="text-blue-400 shrink-0" />
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {item.fileName}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase shrink-0 ${LANG_COLORS[item.language] || "bg-slate-800 text-slate-300"}`}>
                        {item.language}
                      </span>
                    </div>

                    {/* Preview Code Snippet */}
                    <div className="bg-[#04070d] border border-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-hidden h-24 select-text">
                      <pre className="whitespace-pre-wrap break-all opacity-80">
                        {item.code.slice(0, 180)}{item.code.length > 180 ? "..." : ""}
                      </pre>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-900 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(item.id, item.code)}
                        title="Copy Code"
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-white transition-all"
                      >
                        {copiedId === item.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete File"
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-400 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => handleLoadInSandbox(item)}
                        title="Open in Sandbox Editor"
                        className="px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-all"
                      >
                        <span>Open</span>
                        <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default SavedCodesPage;
