import { FileCode, Calendar, ArrowRight } from "lucide-react";

function HistoryCard({ fileName, createdAt, onOpen }) {
  // Format dates nicely if they contain ISO timestamp
  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return "Just now";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all duration-300 flex items-center justify-between group">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <FileCode size={22} />
        </div>
        
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md md:max-w-lg">
            {fileName}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
            <Calendar size={12} />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-blue-600 border border-slate-850 hover:border-blue-500 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-350 hover:text-white hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300"
      >
        <span>Details</span>
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

export default HistoryCard;