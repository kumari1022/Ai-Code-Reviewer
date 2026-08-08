import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ClipLoader } from "react-spinners";
import { Send, Sparkles, Terminal, ArrowRight, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

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
        text: "⚠️ **Connection Error**: Unable to contact the AI assistant. Please check if the backend is online."
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
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* NAVBAR */}
        <Navbar title="AI Coding Assistant" />

        {/* MESSAGES CONSOLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col gap-6">
            
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 animate-pulse">
                  <Sparkles size={28} />
                </div>
                <h2 className="text-xl font-bold text-white">Ask anything about your code</h2>
                <p className="text-slate-500 text-sm mt-3 max-w-sm leading-relaxed">
                  Discuss optimization strategies, debug exceptions, refactor algorithms, or ask specific Spring Boot queries.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-10 max-w-lg w-full">
                  <button 
                    onClick={() => setMessage("How do I reduce Cyclomatic Complexity in Java?")}
                    className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl text-xs text-left text-slate-400 hover:border-slate-800 hover:text-white transition"
                  >
                    Reduce complexity rules
                  </button>
                  <button 
                    onClick={() => setMessage("Explain standard Java memory optimization tips.")}
                    className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl text-xs text-left text-slate-400 hover:border-slate-800 hover:text-white transition"
                  >
                    Memory optimization tips
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-500 border-blue-500/20 text-white"
                    : "bg-slate-900 border-slate-800 text-purple-400"
                }`}>
                  {msg.sender === "user" ? <User size={16} /> : <Sparkles size={16} />}
                </div>

                {/* Message Box */}
                <div
                  className={`px-5 py-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-650 text-white rounded-tr-none"
                      : "bg-slate-950/40 backdrop-blur-md border border-slate-900 text-slate-300 rounded-tl-none prose prose-invert prose-sm"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-[#090d16] border border-slate-900 rounded-xl p-4 my-2 overflow-x-auto text-xs" {...props} />,
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
              <div className="flex gap-4 mr-auto max-w-[80%]">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="px-5 py-4 rounded-3xl bg-slate-950/40 border border-slate-900 rounded-tl-none flex items-center justify-center shadow-sm">
                  <ClipLoader color="#a855f7" size={18} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT PANEL */}
        <div className="p-6 bg-[#030712] border-t border-slate-900 flex justify-center sticky bottom-0 z-40">
          <div className="max-w-4xl w-full flex gap-3 relative">
            <input
              type="text"
              placeholder="Ask AI anything about Java development, debugging, or algorithms..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 bg-slate-950/60 border border-slate-900 focus:border-blue-500/40 rounded-2xl px-5 py-4.5 outline-none text-sm text-white focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-650"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className={`px-6 rounded-2xl text-white flex items-center justify-center gap-1.5 transition-all ${
                !message.trim() || loading
                  ? "bg-slate-900 border border-slate-850 text-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;