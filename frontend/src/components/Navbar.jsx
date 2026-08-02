import { Bell, HelpCircle, Sparkles } from "lucide-react";

function Navbar({ title = "Platform Workspace" }) {
  return (
    <div className="h-20 bg-slate-950/40 backdrop-blur-md border-b border-slate-900 flex items-center justify-between px-10 z-40 sticky top-0">
      <div className="flex items-center gap-3">
        <Sparkles className="text-blue-500 animate-pulse" size={18} />
        <h1 className="text-white text-lg font-semibold tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Help button */}
        <button 
          title="Documentation"
          className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800/80 transition-all duration-200"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications button */}
        <button 
          title="Notifications"
          className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800/80 transition-all duration-200 relative"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;