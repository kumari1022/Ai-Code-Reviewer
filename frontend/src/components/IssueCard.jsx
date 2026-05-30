import { AlertTriangle, AlertCircle, Info } from "lucide-react";

function IssueCard({ severity, issue }) {
  const getSeverityStyle = (sev) => {
    const s = sev?.toUpperCase();
    if (s === "HIGH") {
      return {
        wrapper: "border-red-500/20 bg-red-500/[0.02]",
        badge: "bg-red-500/10 text-red-400 border-red-500/20",
        icon: <AlertTriangle size={14} className="text-red-400" />
      };
    }
    if (s === "MEDIUM") {
      return {
        wrapper: "border-amber-500/20 bg-amber-500/[0.02]",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: <AlertCircle size={14} className="text-amber-400" />
      };
    }
    return {
      wrapper: "border-blue-500/20 bg-blue-500/[0.02]",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: <Info size={14} className="text-blue-400" />
    };
  };

  const style = getSeverityStyle(severity);

  return (
    <div className={`p-5 rounded-2xl border mb-4 flex gap-4 items-start ${style.wrapper}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${style.badge}`}>
        {style.icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-405">
            Severity:
          </span>
          <span className={`text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded ${style.badge}`}>
            {severity}
          </span>
        </div>
        <p className="text-slate-350 text-sm mt-2 leading-relaxed">
          {issue}
        </p>
      </div>
    </div>
  );
}

export default IssueCard;