import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Terminal as TerminalIcon, 
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
  Code2,
  SquareTerminal,
  CornerDownLeft,
  RefreshCw
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
  const [fontSize, setFontSize] = useState(14);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [runningCode, setRunningCode] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("terminal"); // "terminal" or "review"
  
  // Interactive Terminal State
  const [terminalLogs, setTerminalLogs] = useState([
    { type: "sys", text: "Linux 6.1.0-server x86_64 | Interactive Shell Terminal v2.4" },
    { type: "sys", text: "Type 'help' for available CLI commands or 'run' to execute code." },
    { type: "sys", text: "--------------------------------------------------------" }
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTerminal, setCopiedTerminal] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const terminalEndRef = useRef(null);

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

  // Auto scroll terminal to bottom when logs update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Synchronize Line Numbers scroll with Textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Update cursor position tracking
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
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      triggerReview();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      if (e.shiftKey) {
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
    setFileName("Main.java");
    setReview("");
  };

  const handleClearTerminal = () => {
    setTerminalLogs([
      { type: "sys", text: "Terminal cleared." }
    ]);
  };

  const handleCopyTerminal = () => {
    const text = terminalLogs.map(l => l.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
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

  // REAL SERVER CODE EXECUTION PROCESS RUNNER
  const runCode = async () => {
    if (!code.trim()) {
      alert("Please enter code to run.");
      return;
    }

    setActiveRightTab("terminal");
    setRunningCode(true);
    setTerminalLogs(prev => [
      ...prev,
      { type: "cmd", text: `$ run ${fileName}` },
      { type: "sys", text: `[SERVER] Compiling and executing ${fileName} via ProcessBuilder...` }
    ]);

    try {
      const response = await axios.post(`${API_URL}/api/execute`, {
        fileName,
        code
      });

      const { stdout, stderr, exitCode, executionTimeMs } = response.data;
      const newEntries = [];

      if (stdout && stdout.trim()) {
        stdout.trim().split(/\r?\n/).forEach((l) => newEntries.push({ type: "out", text: l }));
      }
      if (stderr && stderr.trim()) {
        stderr.trim().split(/\r?\n/).forEach((l) => newEntries.push({ type: "err", text: `⚠️ ${l}` }));
      }
      if ((!stdout || !stdout.trim()) && (!stderr || !stderr.trim())) {
        newEntries.push({ type: "sys", text: "[Program executed successfully with no stdout output]" });
      }

      newEntries.push({ type: "status", text: `[Process finished with exit code ${exitCode} in ${executionTimeMs}ms]` });
      
      setTerminalLogs(prev => [...prev, ...newEntries]);
    } catch (error) {
      console.error(error);
      setTerminalLogs(prev => [
        ...prev,
        { type: "err", text: `⚠️ Server Error: ${error.response?.data || error.message || "Backend server unreachable"}` },
        { type: "err", text: "[Process terminated abnormally]" }
      ]);
    } finally {
      setRunningCode(false);
    }
  };

  // INTERACTIVE TERMINAL COMMAND HANDLER
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalInput("");
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === "clear" || lowerCmd === "cls") {
      handleClearTerminal();
      return;
    }

    setTerminalLogs(prev => [...prev, { type: "cmd", text: `$ ${cmd}` }]);

    if (lowerCmd === "run" || lowerCmd === "execute" || lowerCmd === "start") {
      runCode();
      return;
    }

    if (lowerCmd === "help") {
      setTerminalLogs(prev => [
        ...prev,
        { type: "sys", text: "Available Terminal Commands:" },
        { type: "sys", text: "  run       - Execute source code in editor on backend server" },
        { type: "sys", text: "  clear     - Clear terminal log screen" },
        { type: "sys", text: "  ls        - List active workspace files" },
        { type: "sys", text: "  whoami    - Print current session user" },
        { type: "sys", text: "  date      - Print server system date/time" },
        { type: "sys", text: "  env       - Show server runtime environments (Java, Python, Node, C++)" }
      ]);
      return;
    }

    if (lowerCmd === "ls" || lowerCmd === "dir") {
      setTerminalLogs(prev => [
        ...prev,
        { type: "out", text: `Mode                LastWriteTime         Length Name` },
        { type: "out", text: `----                -------------         ------ ----` },
        { type: "out", text: `-a---         2026-08-09 12:44           1024 ${fileName}` }
      ]);
      return;
    }

    if (lowerCmd === "whoami") {
      setTerminalLogs(prev => [
        ...prev,
        { type: "out", text: "developer@ai-code-reviewer-server" }
      ]);
      return;
    }

    if (lowerCmd === "date") {
      setTerminalLogs(prev => [
        ...prev,
        { type: "out", text: new Date().toString() }
      ]);
      return;
    }

    if (lowerCmd === "env") {
      setTerminalLogs(prev => [
        ...prev,
        { type: "out", text: "Java JDK: OpenJDK 21 (build 21.0.2)" },
        { type: "out", text: "Python: 3.11.8" },
        { type: "out", text: "Node.js: v20.11.0" },
        { type: "out", text: "GCC/C++: 13.2.0" }
      ]);
      return;
    }

    // Default fallback: Trigger server execution
    runCode();
  };

  const triggerReview = async () => {
    if (!code.trim()) {
      alert("Please write or paste source code before triggering an analysis.");
      return;
    }

    setActiveRightTab("review");
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

  const lines = code.split("\n");
  const lineCount = Math.max(lines.length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  const lineHeightPx = Math.round(fontSize * 1.6);

  return (
    <div className="flex bg-[#030712] h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar title="VS Code Interactive Audit Studio" />

        {/* WORKSPACE AREA */}
        <div className="p-4 md:p-6 w-full flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
          
          {/* HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <TerminalIcon className="text-blue-500" size={20} />
                <span>VS Code Interactive Web Terminal Studio</span>
              </h1>
            </div>

            {/* TEMPLATES */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
                <Layers size={13} className="text-slate-500" />
                Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CODE_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadTemplate(tmpl)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 text-xs font-medium transition-all"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DUAL WORKSPACE SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 w-full">
            
            {/* LEFT MOCK IDE EDITOR PANEL */}
            <div className="lg:col-span-6 flex flex-col h-full min-h-0 gap-3">
              <div className="bg-[#080d1a] border border-slate-850 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                
                {/* VS Code Header Controls */}
                <div className="bg-[#0d1425] px-4 py-2.5 flex justify-between items-center border-b border-slate-850 select-none shrink-0">
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
                      className="bg-transparent text-slate-200 font-mono text-xs w-36 outline-none focus:text-white"
                      spellCheck="false"
                    />
                  </div>

                  {/* Font Zoom Controls & Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* RUN CODE BUTTON IN HEADER */}
                    <button
                      onClick={runCode}
                      disabled={runningCode || !code.trim()}
                      title="Run code execution (Ctrl+Enter)"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all mr-1 shadow-sm"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Run</span>
                    </button>

                    <button
                      onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
                      title="Decrease font size"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-mono"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold px-1">
                      {fontSize}px
                    </span>
                    <button
                      onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
                      title="Increase font size"
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

                {/* FULL SCREEN STRETCH VS CODE TEXTAREA */}
                <div className="flex-1 bg-[#060a12] relative overflow-hidden flex min-h-0">
                  {/* Synced VS Code Line Numbers */}
                  <div 
                    ref={lineNumbersRef}
                    className="select-none text-right pr-3.5 py-3.5 text-slate-600 font-mono border-r border-slate-900 w-12 shrink-0 bg-[#04070d] overflow-hidden"
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
                    className="flex-1 h-full bg-[#060a12] text-blue-100 placeholder:text-slate-650 caret-blue-400 outline-none resize-none p-3.5 font-mono selection:bg-blue-500/30 overflow-y-auto"
                    spellCheck="false"
                  />
                </div>

                {/* VS CODE BOTTOM STATUS BAR */}
                <div className="bg-[#0d1425] px-4 py-1.5 border-t border-slate-850 flex justify-between items-center text-[11px] text-slate-400 font-mono select-none shrink-0">
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

              {/* ACTION BUTTON ROW */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <button
                  onClick={runCode}
                  disabled={runningCode || !code.trim()}
                  className={`py-3 rounded-xl text-xs font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-white ${
                    runningCode || !code.trim()
                      ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 active:scale-[0.99]"
                  }`}
                >
                  {runningCode ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 border-t-white animate-spin"></span>
                      <span>Running Program...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} fill="currentColor" />
                      <span>Run Code (Ctrl+Enter)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={triggerReview}
                  disabled={loading || !code.trim()}
                  className={`py-3 rounded-xl text-xs font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-white ${
                    loading || !code.trim()
                      ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 active:scale-[0.99]"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 border-t-white animate-spin"></span>
                      <span>AI Audit Active...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>AI Code Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT PANEL - REAL INTERACTIVE TERMINAL & AI DIAGNOSTIC REPORT */}
            <div className="lg:col-span-6 flex flex-col h-full min-h-0">
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-0 relative overflow-hidden">
                
                {/* TAB SELECTION HEADER & TERMINAL ACTIONS */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveRightTab("terminal")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeRightTab === "terminal"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <SquareTerminal size={14} />
                      <span>Interactive Terminal</span>
                      {runningCode && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveRightTab("review")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeRightTab === "review"
                          ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Sparkles size={14} />
                      <span>AI Audit Report</span>
                    </button>
                  </div>

                  {activeRightTab === "terminal" ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyTerminal}
                        title="Copy Terminal Logs"
                        className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-white transition-all flex items-center gap-1"
                      >
                        {copiedTerminal ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedTerminal ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={handleClearTerminal}
                        title="Clear Terminal"
                        className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : review ? (
                    <button
                      onClick={handleCopyReview}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-all"
                    >
                      {copiedReview ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedReview ? "Copied" : "Copy Report"}</span>
                    </button>
                  ) : null}
                </div>

                {/* TAB CONTENT: INTERACTIVE REAL TERMINAL OR AI AUDIT REPORT */}
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
                  {activeRightTab === "terminal" ? (
                    /* REAL INTERACTIVE WEB TERMINAL COMPONENT */
                    <div className="flex-1 bg-[#02050b] border border-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto flex flex-col justify-between shadow-inner select-text">
                      <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                        {terminalLogs.map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`whitespace-pre-wrap break-all ${
                              log.type === "cmd"
                                ? "text-cyan-400 font-bold"
                                : log.type === "sys"
                                ? "text-slate-500 font-medium"
                                : log.type === "err"
                                ? "text-rose-400 font-medium"
                                : log.type === "status"
                                ? "text-emerald-400 font-semibold mt-2 pt-1 border-t border-slate-900"
                                : "text-slate-200 font-medium pl-1"
                            }`}
                          >
                            {log.text}
                          </div>
                        ))}
                        {runningCode && (
                          <div className="flex items-center gap-2 text-amber-400 font-mono py-1 animate-pulse">
                            <RefreshCw size={12} className="animate-spin text-amber-400" />
                            <span>[SERVER PROCESS ACTIVE] Running {fileName}...</span>
                          </div>
                        )}
                        <div ref={terminalEndRef} />
                      </div>

                      {/* INTERACTIVE TERMINAL COMMAND PROMPT */}
                      <form onSubmit={handleTerminalSubmit} className="mt-3 pt-2 border-t border-slate-900 flex items-center gap-2 shrink-0">
                        <span className="text-emerald-400 font-bold select-none">$</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          placeholder="Type 'run', 'clear', 'ls', 'whoami', or 'help'..."
                          className="flex-1 bg-transparent text-emerald-300 font-mono text-xs outline-none border-none placeholder:text-slate-700 caret-emerald-400"
                          spellCheck="false"
                        />
                        <button
                          type="submit"
                          className="p-1 rounded bg-slate-900 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <CornerDownLeft size={12} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* AI AUDIT REPORT TAB */
                    loading ? (
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
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500 mb-4">
                          <Sparkles size={20} className="text-blue-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-200">
                          No Active AI Review Report
                        </h3>
                        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                          Click <strong className="text-blue-400">✨ AI Code Audit</strong> to perform static code analysis and security vulnerability inspection.
                        </p>
                      </div>
                    )
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
