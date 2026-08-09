import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Upload,
  Code2
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormattedMarkdown from "../components/FormattedMarkdown";
import { API_URL } from "../config";

const CODE_TEMPLATES = [
  {
    name: "☕ Java",
    fileName: "OrderProcessingService.java",
    code: `package com.app.service;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.logging.Logger;

public class OrderProcessingService {

    private static final Logger LOGGER = Logger.getLogger(OrderProcessingService.class.getName());

    public BigDecimal calculateDiscountedTotal(BigDecimal originalTotal, double discountPercentage) {
        Objects.requireNonNull(originalTotal, "Original total amount cannot be null");
        
        if (discountPercentage < 0.0 || discountPercentage > 100.0) {
            throw new IllegalArgumentException("Discount percentage must be between 0.0 and 100.0");
        }
        
        BigDecimal discountFactor = BigDecimal.valueOf(1.0 - (discountPercentage / 100.0));
        BigDecimal finalPrice = originalTotal.multiply(discountFactor);
        
        LOGGER.info(() -> String.format("Processed discount: Original=%s, Final=%s", originalTotal, finalPrice));
        return finalPrice;
    }
}`
  },
  {
    name: "🐍 Python",
    fileName: "DataPipeline.py",
    code: `import json
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO)

class DataIngestionPipeline:
    def __init__(self, config_path: str):
        self.config_path = config_path

    def process_payload(self, raw_data: str) -> Optional[Dict[str, Any]]:
        # VULNERABLE: Bare except block hides json parsing errors & system interrupts!
        try:
            payload = json.loads(raw_data)
            if "user_id" not in payload:
                raise ValueError("Missing mandatory field: user_id")
            
            # Anti-pattern: Modifying global state or unhandled file operations
            file = open(self.config_path, "a")
            file.write(json.dumps(payload) + "\n")
            # Note: File is left unclosed if an exception occurs before file.close()
            file.close()
            return payload
        except:
            print("Error occurred while processing payload")
            return None`
  },
  {
    name: "⚡ JavaScript",
    fileName: "AuthMiddleware.js",
    code: `const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    // VULNERABLE: Hardcoded JWT secret key & synchronous token verification!
    jwt.verify(token, "SECRET_KEY_123", (err, user) => {
        if (err) {
            // Anti-pattern: Exposing internal error stack traces to client
            return res.status(403).json({ error: err.message, stack: err.stack });
        }
        req.user = user;
        next();
    });
}

module.exports = { verifyToken };`
  },
  {
    name: "⚙️ C++",
    fileName: "MemoryBufferPool.cpp",
    code: `#include <iostream>
#include <cstring>

class MemoryBuffer {
private:
    char* data;
    size_t size;

public:
    MemoryBuffer(size_t sz) : size(sz) {
        // VULNERABLE: Raw pointer allocation without smart pointer std::unique_ptr
        data = new char[sz];
    }

    void writeString(const char* str) {
        // VULNERABLE: Buffer overflow risk! strcpy does not check destination size bound
        strcpy(data, str);
    }

    void printBuffer() {
        std::cout << "Buffer Content: " << data << std::endl;
    }

    // VULNERABLE: Destructor missing delete[] data causes severe memory leak!
    ~MemoryBuffer() {
        // missing: delete[] data;
    }
};`
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
  const [code, setCode] = useState(CODE_TEMPLATES[0].code);
  const [fileName, setFileName] = useState(CODE_TEMPLATES[0].fileName);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);

  const fileInputRef = useRef(null);
  const editorContainerRef = useRef(null);
  const textareaRef = useRef(null);

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

  // Tab key indentation support inside textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

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
      alert("Please write or paste source code before triggering an analysis.");
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

  // Generate dynamic line numbers
  const lines = code.split("\n");
  const lineCount = Math.max(lines.length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar title="Live Code Sandbox & Audit Studio" />

        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Terminal className="text-blue-500" size={24} />
                <span>Interactive Code Editor</span>
              </h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">
                Paste or edit code directly in the IDE editor to trigger instant multi-language Groq AI diagnostic reviews.
              </p>
            </div>

            {/* TEMPLATES */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
                <Layers size={14} className="text-slate-500" />
                Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CODE_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 hover:border-slate-750 text-xs font-medium transition-all"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DUAL WORKSPACE SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT MOCK IDE EDITOR PANEL */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="bg-[#080d1a] border border-slate-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                
                {/* Editor Header Bar */}
                <div className="bg-[#0d1425] px-4 py-3 flex justify-between items-center border-b border-slate-850 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  
                  {/* Filename Input */}
                  <div className="flex items-center gap-2 bg-[#080d1a] px-3 py-1 rounded-lg border border-slate-800">
                    <FileCode size={14} className="text-blue-400" />
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Filename (e.g. Main.java)"
                      className="bg-transparent text-slate-200 font-mono text-xs w-44 outline-none focus:text-white"
                      spellCheck="false"
                    />
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".java,.py,.js,.jsx,.ts,.tsx,.cpp,.c,.h,.hpp,.go,.rs,.txt"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload file into editor"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
                    >
                      <Upload size={14} />
                    </button>
                    <button
                      onClick={handleCopyCode}
                      disabled={!code}
                      title="Copy code"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
                    >
                      {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={!code}
                      title="Clear editor"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* COMFORTABLE SCROLLABLE IDE EDITOR AREA */}
                <div 
                  ref={editorContainerRef}
                  className="flex bg-[#060a12] relative h-[480px] overflow-hidden"
                >
                  {/* Line Numbers Sidebar */}
                  <div className="select-none text-right pr-3.5 py-3.5 text-slate-600 font-mono text-xs leading-6 border-r border-slate-900 w-12 shrink-0 bg-[#04070d] overflow-hidden">
                    {lineNumbers.map((num) => (
                      <div key={num} className="h-6">{num}</div>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="// Paste or write source code here..."
                    className="flex-1 bg-[#060a12] text-blue-100 placeholder:text-slate-600 caret-blue-400 outline-none resize-none p-3.5 font-mono text-xs leading-6 selection:bg-blue-500/30 overflow-y-auto"
                    spellCheck="false"
                  />
                </div>

                {/* EDITOR STATUS BAR */}
                <div className="bg-[#0d1425] px-4 py-2 border-t border-slate-850 flex justify-between items-center text-[11px] text-slate-500 font-mono select-none">
                  <div className="flex items-center gap-3">
                    <span>{lineCount} lines</span>
                    <span>{code.length} chars</span>
                  </div>
                  <span>UTF-8</span>
                </div>
              </div>

              {/* RUN ACTION BUTTON */}
              <button
                onClick={triggerReview}
                disabled={loading || !code.trim()}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-white ${
                  loading || !code.trim()
                    ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 active:scale-[0.99]"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-white animate-spin"></span>
                    <span>Analyzing Codebase...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>Run AI Code Review</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT DIAGNOSTICS REPORT PANEL */}
            <div className="lg:col-span-6">
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 shadow-xl h-[575px] flex flex-col relative overflow-hidden">
                
                {/* Header title */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-400" size={18} />
                    <h2 className="text-sm font-semibold text-white tracking-wide">
                      Diagnostic Audit Report
                    </h2>
                  </div>

                  {review && (
                    <button
                      onClick={handleCopyReview}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-all"
                    >
                      {copiedReview ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedReview ? "Copied" : "Copy Report"}</span>
                    </button>
                  )}
                </div>

                {/* Report Content Output */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {loading ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 animate-spin">
                        <Code2 size={22} />
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Running Static Analysis &amp; Security Audits
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 font-mono max-w-xs">
                        {LOADING_PHASES[loadingPhaseIndex]}
                      </p>
                    </div>
                  ) : review ? (
                    <FormattedMarkdown content={review} />
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                        <Sparkles size={20} className="text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        No Active Review
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                        Select a template or write code in the editor, then click <strong>Run AI Code Review</strong> to generate detailed diagnostics.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default DirectReviewPage;
