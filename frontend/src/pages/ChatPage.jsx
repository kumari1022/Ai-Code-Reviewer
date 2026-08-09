import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Send, User, Terminal, Code2, Cpu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormattedMarkdown from "../components/FormattedMarkdown";
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
        <Navbar title="Senior Engineering Copilot" />

        {/* MESSAGES CONSOLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col gap-6">
            
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                  <Code2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Senior Engineering Copilot</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
                  Ask targeted questions about multi-language refactoring, vulnerability remediation, design patterns, or concurrency.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-lg w-full">
                  <button 
                    onClick={() => setMessage("How do I eliminate NullPointerException using Optional in Java?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    💡 <strong className="text-white">Java:</strong> Optional patterns
                  </button>
                  <button 
                    onClick={() => setMessage("What are PEP 8 type hints best practices in Python?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    🐍 <strong className="text-white">Python:</strong> Type hints &amp; PEP 8
                  </button>
                  <button 
                    onClick={() => setMessage("How to prevent memory leaks in C++ using std::unique_ptr?")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    ⚙️ <strong className="text-white">C++:</strong> Smart Pointers
                  </button>
                  <button 
                    onClick={() => setMessage("Explain async/await error handling in Node.js.")}
                    className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-left text-slate-300 hover:border-slate-800 hover:text-white transition-all duration-200"
                  >
                    ⚡ <strong className="text-white">JS/TS:</strong> Async Error Handling
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <Cpu size={16} />
                  </div>
                )}
                
                <div
                  className={`p-4 md:p-5 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed border ${
                    msg.sender === "user"
                      ? "bg-blue-600 border-blue-500 text-white rounded-tr-none shadow-md shadow-blue-600/10"
                      : "bg-slate-950/80 border-slate-900 text-slate-200 rounded-tl-none shadow-lg"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <FormattedMarkdown content={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Cpu size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 rounded-tl-none flex items-center gap-3">
                  <ClipLoader size={16} color="#3b82f6" />
                  <span className="text-xs text-slate-400 font-mono">Engineering Copilot processing query...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT PROMPT */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-slate-900 shrink-0">
          <div className="max-w-4xl w-full mx-auto relative">
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask senior copilot about Java, Python, JavaScript, C++, Go, or Rust refactoring..."
              className="w-full bg-[#060a12] border border-slate-850 rounded-2xl p-4 pr-14 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500/50 resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className={`absolute right-3.5 bottom-5 p-2.5 rounded-xl text-white transition-all duration-200 ${
                loading || !message.trim()
                  ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20"
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