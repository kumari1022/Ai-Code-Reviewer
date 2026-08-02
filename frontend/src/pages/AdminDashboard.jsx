import { useEffect, useState } from "react";
import axios from "axios";
import { Users, FileText, Trash2, Shield, AlertTriangle, Key } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalReviews: 0 });
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const statsResponse = await axios.get(
        "http://localhost:8080/api/admin/stats",
        headers
      );

      const usersResponse = await axios.get(
        "http://localhost:8080/api/admin/users",
        headers
      );

      const reviewsResponse = await axios.get(
        "http://localhost:8080/api/admin/reviews",
        headers
      );

      setStats(statsResponse.data || { totalUsers: 0, totalReviews: 0 });
      setUsers(usersResponse.data || []);
      setReviews(reviewsResponse.data || []);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review permanently?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/admin/review/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Review deleted successfully");
      fetchDashboard();
    } catch (error) {
      console.error("Error deleting review", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* NAVBAR */}
        <Navbar title="Administrative Terminal" />

        {/* WORKSPACE CONTENT */}
        <div className="p-8 md:p-10 max-w-5xl w-full mx-auto flex flex-col gap-8">
          
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Shield className="text-red-500" size={28} />
              <span>Admin Control Panel</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Manage system operations, view global telemetry, and moderate user reports.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-red-500 animate-spin"></span>
              <span className="text-sm font-semibold">Loading system logs...</span>
            </div>
          ) : (
            <>
              {/* SYSTEM TELEMETRY STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 flex items-center justify-between hover:border-slate-800 transition-all duration-300">
                  <div>
                    <span className="text-xs font-semibold text-slate-550 uppercase tracking-widest">
                      Total System Users
                    </span>
                    <p className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                </div>

                <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 flex items-center justify-between hover:border-slate-800 transition-all duration-300">
                  <div>
                    <span className="text-xs font-semibold text-slate-550 uppercase tracking-widest">
                      Total Analyzed Reviews
                    </span>
                    <p className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                      {stats.totalReviews}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <FileText size={22} />
                  </div>
                </div>
              </div>

              {/* USER MANAGEMENT SECTION */}
              <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white tracking-wide mb-6 flex items-center gap-2">
                  <Users className="text-blue-400" size={18} />
                  <span>Registered System Accounts</span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-semibold">
                        <th className="pb-3 pr-4 font-semibold text-xs uppercase tracking-wider">Account Email</th>
                        <th className="pb-3 font-semibold text-xs uppercase tracking-wider text-right">Assigned Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="py-6 text-center text-slate-650">No registered users in the database.</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-900/10 group">
                            <td className="py-4 pr-4 font-medium text-slate-300 group-hover:text-white transition-colors">{user.email}</td>
                            <td className="py-4 text-right">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${
                                user.role === "ADMIN" 
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>
                                {user.role === "ADMIN" ? <Key size={10} /> : <Users size={10} />}
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REVIEWS MODERATION SECTION */}
              <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white tracking-wide mb-6 flex items-center gap-2">
                  <FileText className="text-purple-400" size={18} />
                  <span>Global Code Submissions</span>
                </h2>

                <div className="flex flex-col gap-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-6 text-slate-650 text-sm">No analysis reports stored in the system.</div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex justify-between items-center group hover:border-slate-800 transition-all"
                      >
                        <div className="min-w-0 mr-4">
                          <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                            {review.fileName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span>ID: {review.id}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => deleteReview(review.id)}
                          className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-red-950/40 hover:text-red-400 border border-slate-850 hover:border-red-900/30 flex items-center justify-center transition-colors group/btn shadow-sm"
                          title="Purge review from system"
                        >
                          <Trash2 size={16} className="group-hover/btn:scale-105 transition-transform" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;