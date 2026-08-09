import { useEffect, useState } from "react";
import axios from "axios";

import {
  Upload,
  FileCode,
  AlertTriangle,
  Star,
  TrendingUp,
  ArrowRight,
  FolderOpen,
  Code2,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

function DashboardPage() {
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/review/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setReviewsList(response.data || []);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Total Reviews
  const totalReviews = reviewsList.length;

  // 2. Files Analyzed (unique file names)
  const uniqueFiles = new Set(reviewsList.map((r) => r.fileName)).size;

  // 3. Issues Found
  let totalIssues = 0;
  reviewsList.forEach((r) => {
    if (r.review) {
      const listLines = r.review.split("\n").filter((line) => {
        const trimmed = line.trim();
        return /^\s*([\*\-\+]|\d+\.)\s+/.test(trimmed) && !trimmed.endsWith(":");
      });
      totalIssues += listLines.length;
    }
  });

  const issuesDisplay = reviewsList.length > 0 ? totalIssues : 0;

  // 4. Code Quality Score
  const averageScore = reviewsList.length > 0
    ? Math.max(35, Math.round(100 - (totalIssues / reviewsList.length) * 3))
    : 100;

  const stats = [
    {
      title: "Total Audits",
      value: loading ? "..." : String(totalReviews),
      color: "from-blue-600/20 to-blue-400/20 border-blue-500/30 text-blue-400",
      icon: <FileCode size={22} />
    },
    {
      title: "Unique Modules",
      value: loading ? "..." : String(uniqueFiles),
      color: "from-emerald-600/20 to-emerald-400/20 border-emerald-500/30 text-emerald-400",
      icon: <Upload size={22} />
    },
    {
      title: "Vulnerabilities Flagged",
      value: loading ? "..." : String(issuesDisplay),
      color: "from-amber-600/20 to-amber-400/20 border-amber-500/30 text-amber-400",
      icon: <AlertTriangle size={22} />
    },
    {
      title: "Maintainability Rating",
      value: loading ? "..." : `${averageScore}%`,
      color: "from-purple-600/20 to-purple-400/20 border-purple-500/30 text-purple-400",
      icon: <Star size={22} />
    }
  ];

  // Sort reviews by date descending and take top 3
  const recentReviews = [...reviewsList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map((r) => {
      const issueCount = r.review 
        ? r.review.split("\n").filter((line) => /^\s*([\*\-\+]|\d+\.)\s+/.test(line)).length 
        : 0;
      
      let relativeTime = "Just now";
      if (r.createdAt) {
        try {
          const diffMs = new Date() - new Date(r.createdAt);
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          if (diffMins < 1) relativeTime = "Just now";
          else if (diffMins < 60) relativeTime = `${diffMins}m ago`;
          else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
          else relativeTime = new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        } catch {}
      }

      return {
        id: r.id,
        file: r.fileName,
        status: issueCount <= 3 ? "Clean" : "Needs Refactoring",
        date: relativeTime
      };
    });

  // Group reviews by day
  const uploadsMap = {};
  reviewsList.forEach((r) => {
    if (r.createdAt) {
      try {
        const date = new Date(r.createdAt);
        const day = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        uploadsMap[day] = (uploadsMap[day] || 0) + 1;
      } catch (e) {
        uploadsMap["Unknown"] = (uploadsMap["Unknown"] || 0) + 1;
      }
    }
  });

  const processedChartData = Object.keys(uploadsMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((day) => ({
      name: day,
      uploads: uploadsMap[day]
    }));

  const chartData = processedChartData.length > 0
    ? processedChartData
    : [
        { name: "Mon", uploads: 0 },
        { name: "Tue", uploads: 0 },
        { name: "Wed", uploads: 0 },
        { name: "Thu", uploads: 0 },
        { name: "Fri", uploads: 0 },
        { name: "Sat", uploads: 0 },
        { name: "Sun", uploads: 0 }
      ];

  const userEmail = localStorage.getItem("email") || "developer@domain.com";
  const userFirstName = userEmail.split("@")[0].split(".")[0];
  const capitalizedName = userFirstName.charAt(0).toUpperCase() + userFirstName.slice(1);

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar title="Developer Dashboard" />

        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
          
          {/* HERO BANNER */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0b1329] to-slate-950 border border-slate-900 rounded-2xl p-6 md:p-8 flex justify-between items-center shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-3">
                <Code2 size={13} />
                <span>Code Inspection Workspace</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Welcome back, {capitalizedName}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 max-w-xl leading-relaxed">
                Run static analysis on Java components, inspect security warnings, and review structural metrics in real-time.
              </p>
              <div className="flex gap-3 mt-6">
                <Link
                  to="/upload"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all duration-200"
                >
                  <span>New Code Audit</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/chat"
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                >
                  Ask Assistant
                </Link>
              </div>
            </div>

            {/* DECORATIVE MINIMALIST CODE CARD */}
            <div className="hidden lg:flex z-10 w-72 p-4 bg-slate-950/80 border border-slate-900 rounded-xl flex-col font-mono text-[11px] leading-relaxed text-slate-400 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-3 border-b border-slate-900 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></div>
                <span className="text-[10px] text-slate-500 ml-auto">StaticAudit.java</span>
              </div>
              <div><span className="text-purple-400">public class</span> <span className="text-blue-300">AuditPipeline</span> &#123;</div>
              <div className="pl-3"><span className="text-purple-400">public void</span> <span className="text-blue-300">inspect</span>() &#123;</div>
              <div className="pl-6 text-emerald-400">// Analysis active</div>
              <div className="pl-3">&#125;</div>
              <div>&#125;</div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-950/50 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center border shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* MID SECTION: CHART & REVIEWS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CHART */}
            <div className="lg:col-span-2 bg-slate-950/50 border border-slate-900 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  <h2 className="text-sm font-semibold text-white tracking-wide">
                    Audit Activity History
                  </h2>
                </div>
                <span className="text-xs text-slate-500">Last 7 Days</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#090d16", 
                        border: "1px solid #1e293b", 
                        borderRadius: "10px",
                        fontSize: "12px",
                        color: "#f8fafc" 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="uploads" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#scoreColor)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT REVIEWS */}
            <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
                  <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                    <FolderOpen size={16} className="text-purple-400" />
                    Recent Audits
                  </h2>
                  <Link to="/history" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                    View all <ArrowRight size={12} />
                  </Link>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-xs text-slate-500">Loading audit history...</div>
                ) : recentReviews.length === 0 ? (
                  <div className="py-8 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mb-3 border border-slate-850">
                      <FileCode size={18} />
                    </div>
                    <p className="text-xs font-medium text-slate-400">No code audits recorded yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                      Paste a Java snippet or upload a file to start.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {recentReviews.map((item) => (
                      <Link
                        key={item.id}
                        to={`/review/${item.id}`}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 flex justify-between items-center transition-all duration-200"
                      >
                        <div className="overflow-hidden pr-2">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {item.file}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {item.date}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border shrink-0 ${
                            item.status === "Clean"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/upload"
                className="w-full mt-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-300 text-center flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>Upload New Codebase</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
