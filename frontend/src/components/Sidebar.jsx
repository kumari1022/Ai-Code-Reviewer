import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  MessageSquare, 
  ShieldAlert, 
  LogOut, 
  Code2,
  Terminal
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  
  // Custom helper to parse email or name from token if needed, or fallback
  const userEmail = localStorage.getItem("email") || "developer@example.com";
  const userInitials = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/upload", label: "Upload Code", icon: <Upload size={20} /> },
    { path: "/direct-review", label: "Direct Review", icon: <Terminal size={20} /> },
    { path: "/history", label: "Review History", icon: <History size={20} /> },
    { path: "/chat", label: "AI Coding Chat", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="w-[280px] h-screen bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-6 shrink-0 z-50">
      <div>
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 px-3 py-4 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200 tracking-tight leading-snug">
              AI Code
              <span className="block text-slate-450 font-medium text-xs tracking-widest uppercase mt-0.5">
                Reviewer
              </span>
            </h1>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.05)]"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent"
                }`}
              >
                <span className={`${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}

          {/* ADMIN CARD NAVIGATION */}
          {role === "ADMIN" && (
            <Link
              to="/admin"
              className={`flex items-center gap-3.5 px-4 py-3.5 mt-4 rounded-xl font-medium border transition-all duration-200 ${
                location.pathname === "/admin"
                  ? "bg-red-600/10 border-red-500/20 text-red-400 shadow-[inset_0_0_12px_rgba(239,68,68,0.05)]"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-white border-dashed border-red-500/20 hover:border-red-500/40"
              }`}
            >
              <ShieldAlert size={20} className="text-red-500" />
              <span className="text-sm">Admin Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      {/* USER PROFILE INFO BLOCK */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-md">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-semibold text-slate-200 truncate">
              {role === "ADMIN" ? "Administrator" : "Developer User"}
            </h2>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-red-950/40 hover:text-red-400 border border-slate-800 hover:border-red-900/30 transition-all duration-300"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;