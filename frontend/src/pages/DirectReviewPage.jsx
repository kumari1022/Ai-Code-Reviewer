import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  Terminal,
  CheckCircle2,
  XCircle,
  Save,
  BookmarkCheck
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
  const location = useLocation();

  const [code, setCode] = useState(location.state?.code || CODE_TEMPLATES[0].code);
  const [fileName, setFileName] = useState(location.state?.fileName || CODE_TEMPLATES[0].fileName);
  const [fontSize, setFontSize] = useState(14);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [runningCode, setRunningCode] = useState(false);
  const [savingFile, setSavingFile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("output"); // "output" or "review"
  
  // Real Code Execution Result State
  const [executionResult, setExecutionResult] = useState(null);

  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightPreRef = useRef(null);

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

  const handleSaveFile = async () => {
    if (!code.trim()) {
      alert("Cannot save an empty code file.");
      return;
    }
    setSavingFile(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/codes`, {
        title: fileName,
        fileName: fileName,
        code: code
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save file to Code Repository.");
    } finally {
      setSavingFile(false);
    }
  };

  // Synchronize Line Numbers & Highlight Overlay scroll with Textarea scroll
  const handleScroll = () => {
    if (textareaRef.current) {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
      if (highlightPreRef.current) {
        highlightPreRef.current.scrollTop = textareaRef.current.scrollTop;
        highlightPreRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
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

    // Smart Enter Key Auto-Indentation & Brace Alignment ({}, [], ())
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const currentLineBeforeCursor = code.substring(lineStart, start);
      const indentMatch = currentLineBeforeCursor.match(/^\s*/);
      const currentIndent = indentMatch ? indentMatch[0] : "";

      const charBefore = code.charAt(start - 1);
      const charAfter = code.charAt(start);

      const isBetweenBraces = 
        (charBefore === "{" && charAfter === "}") ||
        (charBefore === "[" && charAfter === "]") ||
        (charBefore === "(" && charAfter === ")");

      if (isBetweenBraces) {
        const insertText = "\n" + currentIndent + "    \n" + currentIndent;
        const newCode = code.substring(0, start) + insertText + code.substring(end);
        setCode(newCode);

        const newCursorPos = start + 1 + currentIndent.length + 4;
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
          }
        }, 0);
        return;
      }

      const isOpenBrace = charBefore === "{" || charBefore === "[" || charBefore === "(";
      const extraIndent = isOpenBrace ? "    " : "";
      const insertText = "\n" + currentIndent + extraIndent;
      const newCode = code.substring(0, start) + insertText + code.substring(end);
      setCode(newCode);

      const newCursorPos = start + insertText.length;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
        }
      }, 0);
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
    setExecutionResult(null);
  };

  const handleCopyOutput = () => {
    if (!executionResult) return;
    const text = executionResult.stdout || executionResult.stderr || "";
    navigator.clipboard.writeText(text);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
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

    setActiveRightTab("output");
    setRunningCode(true);
    setExecutionResult(null);

    try {
      const response = await axios.post(`${API_URL}/api/execute`, {
        fileName,
        code
      });

      setExecutionResult(response.data);
    } catch (error) {
      console.error(error);
      setExecutionResult({
        stdout: "",
        stderr: `Server Execution Error: ${error.response?.data || error.message || "Backend server unreachable"}`,
        exitCode: 1,
        executionTimeMs: 0
      });
    } finally {
      setRunningCode(false);
    }
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

  // REAL-TIME SYNTAX HIGHLIGHTING TOKENIZER
  const highlightSyntax = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Tokenize comments
    html = html.replace(/(\/\/[^\n]*|\#[^\n]*)/g, '___COMMENT___$1___END___');

    // Tokenize double-quoted and single-quoted strings
    html = html.replace(/("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/g, '___STRING___$1___END___');

    // Tokenize numbers
    html = html.replace(/\b(\d+\.?\d*)\b/g, '___NUMBER___$1___END___');

    // Tokenize keywords
    const keywords = /\b(public|class|static|void|def|import|from|function|return|if|else|const|let|var|int|double|float|char|boolean|include|package|struct|fn|use|impl|mod|type|export|module|try|catch|finally|throw|new|nil|None|True|False|true|false|null|undefined)\b/g;
    html = html.replace(keywords, '___KEYWORD___$1___END___');

    // Tokenize types & system classes
    const types = /\b(System|String|BigDecimal|Logger|Objects|Console|Math|Boolean|Number|Array|Object|Promise|std|cout|endl)\b/g;
    html = html.replace(types, '___TYPE___$1___END___');

    // Tokenize function calls
    html = html.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '___FUNC___$1___END___(');

    // Map token markers to VS Code theme CSS colors
    html = html
      .replace(/___COMMENT___(.*?)___END___/g, '<span style="color: #6a9955; font-style: italic;">$1</span>')
      .replace(/___STRING___(.*?)___END___/g, '<span style="color: #ce9178;">$1</span>')
      .replace(/___NUMBER___(.*?)___END___/g, '<span style="color: #b5cea8;">$1</span>')
      .replace(/___KEYWORD___(.*?)___END___/g, '<span style="color: #569cd6; font-weight: 600;">$1</span>')
      .replace(/___TYPE___(.*?)___END___/g, '<span style="color: #4ec9b0; font-weight: 600;">$1</span>')
      .replace(/___FUNC___(.*?)___END___/g, '<span style="color: #dcdcaa;">$1</span>');

    return html;
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
                <span>VS Code Syntax Highlighted Editor Studio</span>
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
                    {/* SAVE FILE BUTTON IN HEADER */}
                    <button
                      onClick={handleSaveFile}
                      disabled={savingFile || !code.trim()}
                      title="Save code to Repository"
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-all mr-1 shadow-sm"
                    >
                      {savedSuccess ? (
                        <>
                          <BookmarkCheck size={12} className="text-emerald-300" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save size={12} />
                          <span>Save</span>
                        </>
                      )}
                    </button>

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

                {/* FULL SCREEN STRETCH SYNTAX-HIGHLIGHTED VS CODE EDITOR */}
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

                  {/* SYNTAX HIGHLIGHTED CODE CONTAINER */}
                  <div className="flex-1 h-full relative overflow-hidden">
                    {/* Highlighted Color Overlay Layer */}
                    <pre
                      ref={highlightPreRef}
                      aria-hidden="true"
                      style={{ 
                        fontSize: `${fontSize}px`, 
                        lineHeight: `${lineHeightPx}px`,
                        tabSize: 4
                      }}
                      className="absolute inset-0 p-3.5 font-mono pointer-events-none overflow-hidden whitespace-pre-wrap break-all text-slate-200 select-none z-0 m-0 border-0 bg-transparent"
                      dangerouslySetInnerHTML={{ __html: highlightSyntax(code) + "<br/>" }}
                    />

                    {/* Interactive Textarea */}
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
                      className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-blue-400 outline-none resize-none p-3.5 font-mono selection:bg-blue-500/30 overflow-y-auto z-10 border-0 shadow-none focus:ring-0"
                      spellCheck="false"
                    />
                  </div>
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
                      <span>Running Code...</span>
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

            {/* RIGHT PANEL - CLEAN OUTPUT & AI DIAGNOSTIC REPORT */}
            <div className="lg:col-span-6 flex flex-col h-full min-h-0">
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-0 relative overflow-hidden">
                
                {/* TAB SELECTION HEADER */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveRightTab("output")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeRightTab === "output"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Terminal size={14} />
                      <span>Program Output</span>
                      {executionResult && executionResult.exitCode === 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
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

                  {activeRightTab === "output" && executionResult ? (
                    <button
                      onClick={handleCopyOutput}
                      title="Copy Output"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1"
                    >
                      {copiedOutput ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedOutput ? "Copied" : "Copy Output"}</span>
                    </button>
                  ) : activeRightTab === "review" && review ? (
                    <button
                      onClick={handleCopyReview}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-all"
                    >
                      {copiedReview ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedReview ? "Copied" : "Copy Report"}</span>
                    </button>
                  ) : null}
                </div>

                {/* TAB CONTENT: CLEAN OUTPUT OR AI AUDIT REPORT */}
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
                  {activeRightTab === "output" ? (
                    /* CLEAN PROGRAM OUTPUT COMPONENT */
                    runningCode ? (
                      <div className="h-full flex flex-col justify-center items-center text-center p-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 animate-spin">
                          <Play size={18} fill="currentColor" />
                        </div>
                        <h3 className="text-xs font-semibold text-white">
                          Executing {fileName} on Server...
                        </h3>
                      </div>
                    ) : executionResult ? (
                      <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-850 text-xs font-mono shrink-0">
                          <div className="flex items-center gap-2">
                            {executionResult.exitCode === 0 ? (
                              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                <CheckCircle2 size={14} />
                                <span>Exit Code 0 (Success)</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                                <XCircle size={14} />
                                <span>Exit Code {executionResult.exitCode}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-slate-400">{executionResult.executionTimeMs}ms</span>
                        </div>

                        {/* Clean Output Box */}
                        <div className="flex-1 bg-[#04070d] border border-slate-850 rounded-xl p-4 font-mono text-sm text-slate-100 overflow-y-auto whitespace-pre-wrap break-all select-text">
                          {executionResult.stdout && executionResult.stdout.trim() ? (
                            <div className="text-slate-100">{executionResult.stdout.trim()}</div>
                          ) : null}

                          {executionResult.stderr && executionResult.stderr.trim() ? (
                            <div className="text-rose-400 font-medium mt-2">{executionResult.stderr.trim()}</div>
                          ) : null}

                          {!executionResult.stdout?.trim() && !executionResult.stderr?.trim() && (
                            <div className="text-slate-500 italic">[Program finished with no output]</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-500">
                        <Terminal size={24} className="text-slate-600 mb-3" />
                        <p className="font-semibold text-slate-300 text-xs">Program Output Window</p>
                        <p className="text-[11px] mt-1.5 max-w-xs leading-relaxed text-slate-500">
                          Click <strong className="text-emerald-400">▶ Run Code</strong> or press <code className="text-emerald-400 font-mono">Ctrl+Enter</code> to execute the code and see the clean output here.
                        </p>
                      </div>
                    )
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
