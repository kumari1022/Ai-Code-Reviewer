function IssueCard({ severity, issue }) {

  return (

    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 mb-4">

      <div className="flex justify-between items-center mb-3">

        <h2 className="text-xl font-bold text-white">

          {severity}

        </h2>

      </div>

      <p className="text-slate-300">

        {issue}

      </p>

    </div>
  );
}

export default IssueCard;