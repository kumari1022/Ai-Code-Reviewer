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
  
  const userEmail = localStorage.getItem("email") || "developer@domain.com";
  const userInitials = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/upload", label: "File Audit", icon: <Upload size={18} /> },
    { path: "/direct-review", label: "Live Sandbox", icon: <Terminal size={18} /> },
    { path: "/history", label: "Audit History", icon: <History size={18} /> },
    { path: "/chat", label: "Coding Assistant", icon: <MessageSquare size={18} /> },
  ];

  return (
    <aside className="w-[260px] h-screen bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-5 shrink-0 z-50 font-sans">
      <div>
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 px-2 py-3 mb-6 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
            <Code2 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              AI Code Reviewer
            </h1>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1 block">
              Static Diagnostic Studio
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
                }`}
              >
                <span className={isActive ? "text-blue-400" : "text-slate-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* ADMIN CARD NAVIGATION */}
          {role === "ADMIN" && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 mt-3 rounded-xl text-xs font-medium border transition-all duration-200 ${
                location.pathname === "/admin"
                  ? "bg-red-500/10 border-red-500/20 text-red-400 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white border-slate-900"
              }`}
            >
              <ShieldAlert size={18} className="text-red-400" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>
      </div>

      {/* USER PROFILE INFO BLOCK */}
      <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-semibold text-slate-200 truncate">
              {role === "ADMIN" ? "Administrator" : "Developer Account"}
            </h2>
            <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-900 hover:border-red-500/20 transition-all duration-200"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;