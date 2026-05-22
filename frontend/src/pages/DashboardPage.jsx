import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardPage() {

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-10">

          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to AI Code Reviewer
          </h1>

          <p className="text-slate-400">
            Analyze code using AI-powered reviews.
          </p>

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;