import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FolderOpen, Upload, HelpCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HistoryCard from "../components/HistoryCard";

const API_URL = import.meta.env.VITE_API_URL;

function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
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
      setReviews(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* NAVBAR */}
        <Navbar title="Review History" />

        {/* CONTENT */}
        <div className="p-8 md:p-10 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Review History
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Explore previous Java code reviews, complexity analyses, and suggestions.
              </p>
            </div>
            {reviews.length > 0 && (
              <Link
                to="/upload"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.01]"
              >
                <Upload size={14} />
                New Review
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin"></span>
              <span className="text-sm font-semibold">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-[32px] p-12 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 mb-6">
                <FolderOpen size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-200">No reviews found</h2>
              <p className="text-slate-550 text-sm mt-3 max-w-sm leading-relaxed">
                You haven't submitted any Java components for analysis yet. Complete your first upload to review diagnostics.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 mt-8 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
              >
                <Upload size={16} />
                <span>Upload First File</span>
              </Link>
            </div>
          ) : (
            /* HISTORY LIST STACK */
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <HistoryCard
                  key={review.id}
                  fileName={review.fileName}
                  createdAt={review.createdAt}
                  onOpen={() => {
                    window.location.href = `/review/${review.id}`;
                  }}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default HistoryPage;