function MetricCard({ title, value }) {
  return (
    <div className="bg-slate-950/40 backdrop-blur-md p-6 rounded-2xl border border-slate-900 shadow-sm flex flex-col justify-between hover:border-slate-800 transition-all duration-300">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {title}
      </span>
      <p className="text-3xl font-extrabold text-white tracking-tight mt-3">
        {value}
      </p>
    </div>
  );
}

export default MetricCard;