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
  ZoomIn,
  ZoomOut,
  Code2
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormattedMarkdown from "../components/FormattedMarkdown";
import { API_URL } from "../config";

const CODE_TEMPLATES = [
  {
    name: "☕ Java",
    fileName: "Main.java",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  {
    name: "🐍 Python",
    fileName: "main.py",
    code: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`
  },
  {
    name: "⚡ JavaScript",
    fileName: "main.js",
    code: `function main() {
    console.log("Hello, World!");
}

main();`
  },
  {
    name: "⚙️ C++",
    fileName: "main.cpp",
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
  },
  {
    name: "🐹 Go",
    fileName: "main.go",
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`
  },
  {
    name: "🦀 Rust",
    fileName: "main.rs",
    code: `fn main() {
    println!("Hello, World!");
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
  const [code, setCode] = useState(CODE_TEMPLATES[0].code);
  const [fileName, setFileName] = useState(CODE_TEMPLATES[0].fileName);
  const [fontSize, setFontSize] = useState(14); // adjustable font size (12px to 22px)
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

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

  // Synchronize Line Numbers scroll with Textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Update cursor position line & column tracking
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const textBefore = code.substring(0, start);
    const linesBefore = textBefore.split("\n");
    const currentLine = linesBefore.length;
    const currentCol = linesBefore[linesBefore.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  // VS Code Keyboard Shortcuts
  const handleKeyDown = (e) => {
    // 1. Ctrl + Enter / Cmd + Enter or Ctrl + S to run review
    if ((e.ctrlKey || e.metaKey) && (e.key === "Enter" || e.key === "s")) {
      e.preventDefault();
      triggerReview();
      return;
    }

    // 2. Tab / Shift + Tab Indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      if (e.shiftKey) {
        // Shift + Tab: Remove 4 spaces
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        if (code.substring(lineStart, lineStart + 4) === "    ") {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + 4);
          setCode(newCode);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = Math.max(lineStart, start - 4);
            }
          }, 0);
        }
      } else {
        // Tab: Insert 4 spaces
        const newCode = code.substring(0, start) + "    " + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
          }
        }, 0);
      }
      return;
    }

    // 3. Ctrl + / or Cmd + / Line Comment Toggle
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = code.indexOf("\n", start);
      const currentLineText = code.substring(lineStart, lineEnd === -1 ? code.length : lineEnd);

      const isCommented = currentLineText.trim().startsWith("//") || currentLineText.trim().startsWith("#");
      let newText = currentLineText;

      if (isCommented) {
        newText = currentLineText.replace(/^\s*(\/\/|#)\s?/, "");
      } else {
        const commentSymbol = fileName.endsWith(".py") ? "# " : "// ";
        newText = commentSymbol + currentLineText;
      }

      const newCode = code.substring(0, lineStart) + newText + code.substring(lineEnd === -1 ? code.length : lineEnd);
      setCode(newCode);
      return;
    }

    // 4. Auto-closing pairs: ( { [ " '
    const pairs = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
    if (pairs[e.key] && e.target.selectionStart === e.target.selectionEnd) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const closeChar = pairs[e.key];
      const newCode = code.substring(0, start) + e.key + closeChar + code.substring(start);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
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

  // Dynamic calculations for VS Code line numbers & auto-expanding height
  const lines = code.split("\n");
  const lineCount = Math.max(lines.length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Line height calculation based on font size (fontSize * 1.6)
  const lineHeightPx = Math.round(fontSize * 1.6);
  // Dynamic Editor Height: grows automatically with line count from 420px up to 720px
  const dynamicEditorHeight = Math.min(Math.max(420, lineCount * lineHeightPx + 32), 720);

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar title="VS Code Interactive Audit Studio" />

        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Terminal className="text-blue-500" size={24} />
                <span>VS Code Editor Studio</span>
              </h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">
                VS Code shortcuts enabled: <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400">Tab</code>, <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400">Ctrl+/</code> comment, <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-400">Ctrl+Enter</code> run review.
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
              <div className="bg-[#080d1a] border border-slate-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-200">
                
                {/* VS Code Header Controls & Zoom Controls */}
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

                  {/* Font Zoom Controls & Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Font Zoom Out */}
                    <button
                      onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
                      title="Decrease font size (Zoom out)"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-mono"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold px-1">
                      {fontSize}px
                    </span>
                    {/* Font Zoom In */}
                    <button
                      onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
                      title="Increase font size (Zoom in)"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-mono"
                    >
                      <ZoomIn size={13} />
                    </button>

                    <span className="w-px h-4 bg-slate-800 mx-1"></span>

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
                      <Upload size={13} />
                    </button>
                    <button
                      onClick={handleCopyCode}
                      disabled={!code}
                      title="Copy code"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={!code}
                      title="Clear editor"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* DYNAMIC HEIGHT DYNAMIC FONT VS CODE EDITOR AREA */}
                <div 
                  className="flex bg-[#060a12] relative overflow-hidden transition-all duration-200"
                  style={{ height: `${dynamicEditorHeight}px` }}
                >
                  {/* Synced VS Code Line Numbers Sidebar */}
                  <div 
                    ref={lineNumbersRef}
                    className="select-none text-right pr-3.5 py-3.5 text-slate-600 font-mono border-r border-slate-900 w-12 shrink-0 bg-[#04070d] overflow-hidden select-none"
                    style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeightPx}px` }}
                  >
                    {lineNumbers.map((num) => (
                      <div key={num} style={{ height: `${lineHeightPx}px` }}>{num}</div>
                    ))}
                  </div>

                  {/* High-Legibility VS Code Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    onClick={updateCursorPosition}
                    onKeyUp={updateCursorPosition}
                    placeholder="// Write or paste source code here..."
                    style={{ 
                      fontSize: `${fontSize}px`, 
                      lineHeight: `${lineHeightPx}px`,
                      tabSize: 4
                    }}
                    className="flex-1 bg-[#060a12] text-blue-100 placeholder:text-slate-650 caret-blue-400 outline-none resize-none p-3.5 font-mono selection:bg-blue-500/30 overflow-y-auto"
                    spellCheck="false"
                  />
                </div>

                {/* VS CODE BOTTOM STATUS BAR */}
                <div className="bg-[#0d1425] px-4 py-2 border-t border-slate-850 flex justify-between items-center text-[11px] text-slate-400 font-mono select-none">
                  <div className="flex items-center gap-3">
                    <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                    <span>{lineCount} lines</span>
                    <span>{code.length} chars</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-semibold">{fileName.split(".").pop().toUpperCase()}</span>
                    <span>UTF-8</span>
                  </div>
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
                    <span>Run AI Code Review (Ctrl+Enter)</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT DIAGNOSTICS REPORT PANEL */}
            <div className="lg:col-span-6">
              <div 
                className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden transition-all duration-200"
                style={{ minHeight: `${dynamicEditorHeight + 50}px` }}
              >
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
                    <div className="h-full min-h-[350px] flex flex-col justify-center items-center text-center p-6">
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
                    <div className="h-full min-h-[350px] flex flex-col justify-center items-center text-center p-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500 mb-4">
                        <Sparkles size={20} className="text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        No Active Review
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                        Select a template or write code in the VS Code editor, then press <code className="text-blue-400 font-mono">Ctrl+Enter</code> or click <strong>Run AI Code Review</strong>.
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
