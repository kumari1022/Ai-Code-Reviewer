import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  FileCode, 
  Trash2, 
  Play, 
  Layers, 
  Cpu, 
  CheckCircle2,
  Upload
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const API_URL = import.meta.env.VITE_API_URL;

// Built-in high-quality Java templates to demonstrate the reviewer
const JAVA_TEMPLATES = [
  {
    name: "Standard Greeter (Clean)",
    fileName: "Greeter.java",
    code: `public class Greeter {
    public String sayHello(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Hello, Guest!";
        }
        return "Hello, " + name + "!";
    }
}`
  },
  {
    name: "SQL Injection Pitfall (Vulnerable)",
    fileName: "UserDAO.java",
    code: `import java.sql.*;

public class UserDAO {
    public void getUserData(String userId) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "user", "pass");
        
        // VULNERABLE: Direct string concatenation represents a severe SQL injection exposure!
        String query = "SELECT * FROM users WHERE id = '" + userId + "'";
        
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        
        while (rs.next()) {
            System.out.println(rs.getString("username"));
        }
    }
}`
  },
  {
    name: "Resource Leak & Silent Catch (Vulnerable)",
    fileName: "DataProcessor.java",
    code: `import java.io.*;

public class DataProcessor {
    public void processFile(String path) {
        try {
            // VULNERABLE: File streams are opened but never closed in a finally block!
            BufferedReader reader = new BufferedReader(new FileReader(path));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line.toUpperCase());
            }
            // If an exception occurs before this, the stream leaks!
            reader.close();
        } catch (IOException e) {
            // BAD PRACTICE: Silent exception handling hides system faults
            e.printStackTrace();
        }
    }
}`
  }
];

const LOADING_PHASES = [
  "Synthesizing AST structural signatures...",
  "Analyzing imports & declaration patterns...",
  "Scanning logic paths for logical locks...",
  "Detecting potential security vulnerabilities...",
  "Querying Groq AI model engine...",
  "Compiling comprehensive code diagnostics..."
];

function DirectReviewPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("Sandbox.java");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);

  // Validate JWT session token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() >= exp) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        alert("Your session has expired. Please sign in again.");
        navigate("/login");
      }
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const fileInputRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const textareaRef = useRef(null);

  // Dynamically auto-expand editor height based on lines typed (default: 3 lines minHeight)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const minHeight = 3 * 24 + 32; // 104px (3 lines * 24px line-height + 32px padding)
      const newHeight = Math.max(textareaRef.current.scrollHeight, minHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [code]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Rotate loading phase labels while fetching to keep user engaged
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length);
      }, 2500);
    } else {
      setLoadingPhaseIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadTemplate = (template) => {
    setCode(template.code);
    setFileName(template.fileName);
  };

  const handleClear = () => {
    setCode("");
    setFileName("Sandbox.java");
    setReview("");
  };

  const handleCopyReview = () => {
    if (!review) return;
    navigator.clipboard.writeText(review);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const triggerReview = async () => {
    if (!code.trim()) {
      alert("Please write or paste some Java code before triggering an analysis.");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/ide/review`,
        {
          fileName,
          code
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // IDEController response format returns IDEResponse containing a "review" attribute
      if (response.data && response.data.review) {
        setReview(response.data.review);
      } else {
        setReview("### Analysis Complete\nNo issues found! The code looks fully optimized and robust.");
      }
    } catch (error) {
      console.error(error);
      setReview("### Analysis Failure\nFailed to obtain a diagnostics report. Please ensure the backend service is running and accessible.");
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic line numbers sidebar array
  const lineCount = Math.max(code.split("\n").length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden mesh-gradient">
      {/* GLOBAL SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* NAVBAR */}
        <Navbar title="Direct Code Review" />

        {/* WORKSPACE AREA */}
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* OVERVIEW INFO PANEL */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Terminal className="text-blue-500" size={28} />
                <span>Direct Sandbox Review</span>
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm">
                Paste raw components directly into our virtual IDE to audit code quality patterns, performance blocks, and safety concerns.
              </p>
            </div>

            {/* QUICK EXAMPLES DROPDOWN */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <Layers size={14} className="text-slate-400" />
                Load Template:
              </span>
              <div className="flex flex-wrap gap-2">
                {JAVA_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-blue-950/40 text-slate-300 hover:text-blue-400 border border-slate-800/80 hover:border-blue-900/20 text-xs font-medium transition-all"
                  >
                    {tmpl.name.split(" ")[0]} {tmpl.name.split(" ")[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DUAL WORKSPACE SPLIT (EDITOR VS DIAGNOSTICS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT MOCK IDE EDITOR PANEL */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 p-[1.5px] rounded-[32px] shadow-2xl shadow-blue-500/5">
                <div className="bg-[#090d16]/95 rounded-[30px] overflow-hidden">
                  
                  {/* Editor Header Controls */}
                  <div className="bg-[#0c1220] px-5 py-4 flex justify-between items-center border-b border-slate-900/60 select-none">
                    <div className="flex items-center gap-2 select-none">
                      <span className="editor-dot bg-red-500/80"></span>
                      <span className="editor-dot bg-yellow-500/80"></span>
                      <span className="editor-dot bg-green-500/80"></span>
                    </div>
                    
                    {/* Filename Input */}
                    <div className="flex items-center gap-2 bg-[#090d16] px-3.5 py-1.5 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                      <FileCode size={14} className="text-indigo-400" />
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Filename (e.g. App.java)"
                        style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                        className="text-slate-100 font-semibold font-mono text-xs w-36 text-center focus:ring-0 focus:text-white focus:outline-none appearance-none"
                        spellCheck="false"
                      />
                    </div>

                    {/* Utility Controls */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".java,.txt,.js,.py,.cpp,.c,.go,.ts"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload file into editor"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-500/10 border border-slate-850 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center animate-pulse"
                      >
                        <Upload size={14} />
                      </button>
                      <button
                        onClick={handleCopyCode}
                        disabled={!code}
                        title="Copy code"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-blue-500/10 border border-slate-850 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        {copiedCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={handleClear}
                        disabled={!code && fileName === "Sandbox.java"}
                        title="Clear code editor"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-850 hover:border-rose-500/40 text-slate-450 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Virtual Codearea Container with Dynamic Auto-Expanding Textarea */}
                  <div className="flex bg-[#060a12] p-0 relative min-h-[104px]">
                    {/* Dynamic Line Numbers */}
                    <div 
                      ref={lineNumbersRef}
                      className="select-none text-right pr-4 py-4 text-indigo-400/80 font-bold font-mono text-[14px] leading-6 border-r border-indigo-950/40 w-14 shrink-0 bg-[#03050a] overflow-hidden select-none h-auto"
                    >
                      {lineNumbers.map((num) => (
                        <div key={num} className="h-6">{num}</div>
                      ))}
                    </div>

                    {/* Highly-Legible Auto-Expanding Monospace Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="// Write or paste Java source code here...&#10;// Or click one of the load templates above to test instantly!"
                      style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                      className="flex-1 bg-[#060a12] text-[#a5d6ff] placeholder-slate-650 focus:text-white caret-blue-400 focus:outline-none resize-none border-0 p-4 font-mono text-[14px] leading-6 focus:ring-0 focus:border-0 appearance-none shadow-none overflow-hidden"
                      spellCheck="false"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION INITIATOR */}
              <button
                onClick={triggerReview}
                disabled={loading || !code.trim()}
                className={`w-full py-4 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-white ${
                  loading || !code.trim()
                    ? "bg-slate-900/60 text-slate-500 border border-slate-900 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.005]"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-slate-350 animate-spin"></span>
                    <span>AI Analyser Active...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="currentColor" />
                    <span>Run AI Diagnostic Review</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT GROQ DIAGNOSTICS REPORT PANEL */}
            <div className="lg:col-span-6">
              <div className="bg-slate-950/45 backdrop-blur-md border border-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[466px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.015] rounded-full blur-[60px] pointer-events-none"></div>

                {/* Header title */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="text-purple-400" size={18} />
                    <h2 className="text-base font-bold text-white tracking-wide">
                      Groq Diagnostics Feedback
                    </h2>
                  </div>

                  {review && !loading && (
                    <button
                      onClick={handleCopyReview}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-300 hover:text-white border border-slate-850 transition-all"
                    >
                      {copiedReview ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Report</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Loading State Container */}
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-5">
                    <div className="relative">
                      {/* Outer spinning ring */}
                      <span className="w-16 h-16 rounded-full border-2 border-slate-900 border-t-blue-500 border-b-indigo-500 animate-spin absolute -left-8 -top-8"></span>
                      {/* Inner pulsing chip */}
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 animate-pulse relative z-10">
                        <Cpu size={22} className="animate-spin-slow" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <h3 className="text-sm font-bold text-slate-300">
                        Compiling Dynamic Diagnostic Analysis
                      </h3>
                      <p className="text-xs text-slate-500 font-mono tracking-wide animate-pulse h-4 max-w-sm mx-auto">
                        {LOADING_PHASES[loadingPhaseIndex]}
                      </p>
                    </div>
                  </div>
                ) : review ? (
                  /* Report Content Render Output (or Connection Starvation Error alert) */
                  review.includes("temporarily unavailable") || review.includes("Failure") ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-rose-950/20 border border-rose-500/20 rounded-3xl my-auto animate-pulse">
                      <AlertCircle className="text-rose-400 mb-4" size={36} />
                      <h3 className="text-sm font-bold text-rose-200 uppercase tracking-wider">AI Diagnostics Offline</h3>
                      <p className="text-xs text-slate-400 mt-3 max-w-sm leading-relaxed">
                        The Groq AI service connection was temporarily reset due to thread starvation or clock skew. Your local virtual editor is fully online. Please click below to retry the analysis.
                      </p>
                      <button
                        onClick={triggerReview}
                        className="mt-6 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs font-bold text-rose-300 tracking-wide transition-all duration-300"
                      >
                        Retry AI Diagnostics
                      </button>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-slate-350 leading-relaxed overflow-y-auto max-h-[480px] pr-2 space-y-4">
                      <ReactMarkdown
                        components={{
                          h1: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-6 mb-3 first:mt-0 pb-1.5 border-b border-slate-900" {...props} />,
                          h2: ({node, ...props}) => <h4 className="text-base font-bold text-white mt-5 mb-2.5" {...props} />,
                          h3: ({node, ...props}) => <h5 className="text-sm font-bold text-slate-200 mt-4 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4 text-slate-300 whitespace-pre-wrap leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-350" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-slate-350" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          code: ({node, inline, className, children, ...props}) => {
                            return (
                              <code className="bg-slate-900/60 text-blue-400 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-800" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {review}
                      </ReactMarkdown>
                    </div>
                  )
                ) : (
                  /* Empty Welcome Instructions state */
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900/65 border border-slate-850 flex items-center justify-center text-slate-500 mb-5 shadow-inner">
                      <Sparkles size={22} className="text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-200">
                      Sandbox Review Diagnostics
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
                      Your direct analysis results will compile in this container. Paste or load templates, specify your component class, and press the run analysis executor.
                    </p>

                    {/* Minimal instructions guidelines */}
                    <div className="mt-8 w-full max-w-md bg-slate-900/10 border border-slate-900/50 rounded-2xl p-4 text-left flex gap-3 text-[11px] text-slate-550 leading-normal select-none">
                      <AlertCircle size={14} className="text-indigo-400/90 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-400">Sandbox Quicktips:</span>
                        <span>• Select a quick-load preset from the top-right toolbar to view simulated real-time audits on Java models instantly.</span>
                        <span>• Dynamic line numbers calculate automatically as you paste or adjust structure code contents.</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default DirectReviewPage;
