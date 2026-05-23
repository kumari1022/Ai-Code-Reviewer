function MetricCard({ title, value }) {

  return (

    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">

      <h2 className="text-slate-400 text-lg mb-2">

        {title}

      </h2>

      <p className="text-4xl font-bold text-white">

        {value}

      </p>

    </div>
  );
}

export default MetricCard;