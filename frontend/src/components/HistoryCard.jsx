function HistoryCard({

  fileName,
  createdAt,
  onOpen

}) {

  return (

    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 mb-5">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl text-white font-bold">
            {fileName}
          </h2>

          <p className="text-slate-400 mt-2">
            {createdAt}
          </p>

        </div>

        <button
          onClick={onOpen}
          className="bg-blue-600 px-5 py-2 rounded-lg text-white"
        >
          Open
        </button>

      </div>

    </div>
  );
}

export default HistoryCard;