import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ArrowLeft, Terminal, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormattedMarkdown from "../components/FormattedMarkdown";
import { API_URL } from "../config";

function DetailedReviewPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
  `${API_URL}/api/review/${id}`,
  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setReview(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!review) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center flex-col gap-3">
        <span className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin"></span>
        <span className="text-lg font-bold text-slate-400">Loading analysis reports...</span>
      </div>
    );
  }

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* NAVBAR */}
        <Navbar title="Review Diagnostics" />

        {/* WORKSPACE CONTENT */}
        <div className="p-8 md:p-10 max-w-5xl w-full mx-auto flex flex-col gap-8">
          
          {/* TOP BAR / BACK LINK */}
          <div className="flex items-center justify-between">
            <Link
              to="/history"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-450 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to History</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Groq AI Checked</span>
            </div>
          </div>

          {/* PAGE TITLE */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Terminal className="text-blue-500" size={26} />
              <span>{review.fileName}</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Deep code inspection, security audits, and optimization suggestions.
            </p>
          </div>

          {/* MOCK IDE CODE CONTAINER */}
          <div className="bg-[#090d16] border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Mock Header Controls */}
            <div className="bg-[#0c1220] px-6 py-4 flex justify-between items-center border-b border-slate-900/60 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              </div>
              <div className="px-3 py-1 rounded bg-[#090d16] text-[10px] text-slate-400 font-semibold tracking-wide border border-slate-850">
                {review.fileName} (Java Component)
              </div>
              <div className="w-12 h-3"></div>
            </div>

            {/* Code Body */}
            <div className="p-1.5 md:p-3 overflow-x-auto">
              <SyntaxHighlighter
                language="java"
                style={oneDark}
                showLineNumbers={true}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: "16px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {review.content || "// No code available"}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* AI REVIEW REPORT OUT */}
          <div className="bg-slate-950/45 backdrop-blur-md border border-slate-900 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.02] rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-900">
              <Sparkles className="text-purple-400" size={20} />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Groq AI Diagnostic Review
              </h2>
            </div>

            {/* Markdown Body */}
            <div>
              <FormattedMarkdown content={review.review || "*No report review generated yet.*"} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DetailedReviewPage;