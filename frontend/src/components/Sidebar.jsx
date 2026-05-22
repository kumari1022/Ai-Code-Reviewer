import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="w-64 h-screen bg-slate-900 text-white p-5 border-r border-slate-700">

      <h1 className="text-2xl font-bold mb-10">
        AI Reviewer
      </h1>

      <div className="flex flex-col gap-4">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/upload">
          Upload
        </Link>

        <Link to="/reviews">
          Reviews
        </Link>

        <Link to="/docs">
          Documentation
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;