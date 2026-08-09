import { ShieldCheck } from "lucide-react";

function Navbar({ title = "Platform Workspace" }) {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 flex items-center justify-between px-6 md:px-8 z-40 sticky top-0 font-sans">
      <div className="flex items-center gap-3">
        <h1 className="text-white text-base font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-850 text-xs font-medium text-slate-300">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Security Engine Online</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;