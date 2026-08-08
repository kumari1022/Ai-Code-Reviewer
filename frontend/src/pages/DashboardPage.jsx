import { useEffect, useState } from "react";
import axios from "axios";

import {
  Upload,
  FileCode,
  AlertTriangle,
  Star,
  TrendingUp,
  ArrowRight,
  FolderOpen
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
const API_URL = import.meta.env.VITE_API_URL;

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
  // Count only actual bullet points and numbered issue descriptions (excluding headers ending in colons)
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
  // Deduct 3% per issue found, average across all reviews, starting at a base of 100%
  const averageScore = reviewsList.length > 0
    ? Math.max(35, Math.round(100 - (totalIssues / reviewsList.length) * 3))
    : 100;

  const stats = [
    {
      title: "Total Reviews",
      value: loading ? "..." : String(totalReviews),
      color: "from-blue-600/20 to-blue-400/20 border-blue-500/30 text-blue-400",
      icon: <FileCode size={24} />
    },
    {
      title: "Files Analyzed",
      value: loading ? "..." : String(uniqueFiles),
      color: "from-emerald-600/20 to-emerald-400/20 border-emerald-500/30 text-emerald-400",
      icon: <Upload size={24} />
    },
    {
      title: "Issues Found",
      value: loading ? "..." : String(issuesDisplay),
      color: "from-amber-600/20 to-amber-400/20 border-amber-500/30 text-amber-400",
      icon: <AlertTriangle size={24} />
    },
    {
      title: "Code Quality Score",
      value: loading ? "..." : `${averageScore}%`,
      color: "from-purple-600/20 to-purple-400/20 border-purple-500/30 text-purple-400",
      icon: <Star size={24} />
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
        status: issueCount <= 3 ? "Good" : "Needs Improvement",
        date: relativeTime
      };
    });

  // Group reviews by day and count uploads per day in real-time
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

  // Convert map to sorted array list chronologically
  const processedChartData = Object.keys(uploadsMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((day) => ({
      name: day,
      uploads: uploadsMap[day]
    }));

  // Fallback defaults if no files are analyzed yet
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

  const userEmail = localStorage.getItem("email") || "developer@example.com";
  const userFirstName = userEmail.split("@")[0].split(".")[0];
  const capitalizedName = userFirstName.charAt(0).toUpperCase() + userFirstName.slice(1);

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden">
      {/* GLOBAL SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* GLOBAL HEADER */}
        <Navbar title="Developer Dashboard" />

        {/* WORKSPACE CONTENT */}
        <div className="p-8 md:p-10 max-w-7xl w-full mx-auto flex flex-col gap-8">
          
          {/* HERO BANNER */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0b1329] to-slate-950 border border-slate-900 rounded-[32px] p-8 md:p-10 flex justify-between items-center shadow-xl shadow-blue-500/[0.02]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex-1">
              <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
                Developer Space
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 tracking-tight leading-tight">
                Welcome Back, {capitalizedName} 👋
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                Upload your Java components for automated Groq AI diagnostics, 
                structural complexity tests, and live debugging prompts.
              </p>
              <div className="flex gap-4 mt-8">
                <Link
                  to="/upload"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <span>Upload Code</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/chat"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-850 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                >
                  Ask Assistant
                </Link>
              </div>
            </div>

            <div className="hidden lg:block z-10 w-[240px] h-[240px] mr-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6062/6062646.png"
                alt="AI Tech"
                className="w-full h-full object-contain opacity-70 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-pulse"
              />
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center border shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-white tracking-tight group-hover:scale-105 origin-left transition-transform">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* MID SECTION: CHART & REVIEWS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ANALYSIS UPLOADS VOLUME CHART */}
            <div className="lg:col-span-2 bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-blue-400" />
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Analysis Uploads per Day
                </h2>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#090d16", 
                        border: "1px solid #1e293b", 
                        borderRadius: "12px",
                        color: "#f8fafc" 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="uploads" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#scoreColor)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT REVIEWS */}
            <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Recent Reviews
                  </h2>
                  <Link to="/history" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                    View All
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {loading ? (
                    <div className="py-12 flex justify-center text-slate-500 text-xs">
                      <span>Loading recent audits...</span>
                    </div>
                  ) : recentReviews.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs text-center gap-2">
                      <FolderOpen size={20} className="opacity-40" />
                      <span>No code components reviewed yet.</span>
                    </div>
                  ) : (
                    recentReviews.map((review, index) => (
                      <Link
                        to={`/review/${review.id}`}
                        key={index}
                        className="bg-slate-900/30 border border-slate-900/80 hover:border-slate-800 rounded-2xl p-4 flex justify-between items-center transition-all cursor-pointer group"
                      >
                        <div className="overflow-hidden mr-2">
                          <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                            {review.file}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {review.date}
                          </p>
                        </div>

                        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                          review.status === "Good"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {review.status}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* QUICK TIP */}
              <div className="mt-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl p-4 text-xs text-slate-400 leading-relaxed flex gap-3">
                <div className="text-blue-400">💡</div>
                <span>
                  <strong>Refactoring Pro Tip:</strong> Nested conditional structures drastically increase Cyclomatic Complexity. Extract validation checks into guard clauses to optimize scoring!
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
