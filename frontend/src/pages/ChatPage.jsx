import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ClipLoader } from "react-spinners";
import { Send, Sparkles, User, Terminal, Code2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/chat`,
        {
          message: message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        sender: "ai",
        text: "⚠️ **Connection Timeout**: Unable to reach backend review service. Please verify system status."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar title="AI Coding Assistant" />

        {/* MESSAGES CONSOLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col gap-6">
            
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Code Review &amp; Optimization Assistant</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
                  Ask targeted questions about Java refactoring, vulnerability remediation, design patterns, or concurrency.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-lg w-full">
                  <button 
                    onClick={() => setMessage("How do I eliminate NullPointerException using Optional in Java?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    💡 <span className="font-semibold text-white">Avoid NullPointerExceptions</span>
                    <p className="text-[11px] text-slate-500 mt-1">Refactor raw null checks with Optional API</p>
                  </button>
                  <button 
                    onClick={() => setMessage("How do I fix SQL Injection risks with PreparedStatement?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    🛡️ <span className="font-semibold text-white">Remediate SQL Injection</span>
                    <p className="text-[11px] text-slate-500 mt-1">Convert raw query concatenation to parameterized statements</p>
                  </button>
                  <button 
                    onClick={() => setMessage("What are standard Spring Security JWT authorization best practices?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    🔑 <span className="font-semibold text-white">Spring Security JWT</span>
                    <p className="text-[11px] text-slate-500 mt-1">Configure stateless session authentication</p>
                  </button>
                  <button 
                    onClick={() => setMessage("How to optimize HikariCP connection pool settings?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    ⚡ <span className="font-semibold text-white">HikariCP Tuning</span>
                    <p className="text-[11px] text-slate-500 mt-1">Optimize database pool size and idle timeouts</p>
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-900 border-slate-800 text-purple-400"
                }`}>
                  {msg.sender === "user" ? <User size={15} /> : <Sparkles size={15} />}
                </div>

                {/* Message Box */}
                <div
                  className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-950/60 border border-slate-900 text-slate-200 rounded-tl-none prose prose-invert prose-sm max-w-none"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-slate-950 border border-slate-900 rounded-lg p-3 my-2 overflow-x-auto text-xs" {...props} />,
                      code: ({node, inline, className, children, ...props}) => {
                        return (
                          <code className="bg-slate-900 text-blue-400 px-1 py-0.5 rounded font-mono text-xs" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 mr-auto max-w-[80%]">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles size={15} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-900 rounded-tl-none flex items-center justify-center">
                  <ClipLoader color="#a855f7" size={16} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT PANEL */}
        <div className="p-4 sm:p-6 bg-[#030712] border-t border-slate-900 flex justify-center sticky bottom-0 z-40">
          <div className="max-w-4xl w-full flex gap-3 relative">
            <input
              type="text"
              placeholder="Ask assistant about bug fixes, refactoring, or concurrency..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 bg-slate-950/60 border border-slate-900 focus:border-blue-500/50 rounded-xl px-4 py-3 outline-none text-xs sm:text-sm text-white focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className={`px-5 rounded-xl text-white flex items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                !message.trim() || loading
                  ? "bg-slate-900 border border-slate-850 text-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/10 active:scale-[0.98]"
              }`}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;