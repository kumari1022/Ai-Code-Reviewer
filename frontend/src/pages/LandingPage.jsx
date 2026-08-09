import { Link } from "react-router-dom";
import { 
  Code2, 
  Cpu, 
  History, 
  ShieldCheck, 
  UploadCloud, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Zap,
  Terminal
} from "lucide-react";

function LandingPage() {
  const features = [
    {
      title: "Static Analysis & Complexity Checks",
      description: "Detect hidden performance bottlenecks, high cyclomatic complexity, and memory leaks before pushing to production.",
      icon: <Cpu className="text-blue-400" size={24} />
    },
    {
      title: "Security & Vulnerability Audits",
      description: "Flag SQL injection risks, unhandled exceptions, and authentication flaws with instant remediation steps.",
      icon: <ShieldCheck className="text-emerald-400" size={24} />
    },
    {
      title: "Interactive Refactoring Assistant",
      description: "Ask questions, explore alternative design patterns, and request line-by-line fixes in real-time.",
      icon: <MessageSquare className="text-purple-400" size={24} />
    },
    {
      title: "Audit History & Quality Metrics",
      description: "Store past code reviews, track maintainability scores over time, and compare historical metrics.",
      icon: <History className="text-amber-400" size={24} />
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Provide Source Code",
      description: "Paste snippet directly or upload `.java` source code files into the reviewer.",
      icon: <UploadCloud className="text-blue-400" size={28} />
    },
    {
      number: "02",
      title: "Automated Inspection",
      description: "Deep static inspection evaluates code structure, safety, and maintainability.",
      icon: <Cpu className="text-purple-400" size={28} />
    },
    {
      number: "03",
      title: "Line-by-Line Feedback",
      description: "Review localized issue cards, severity levels, and suggested code diffs.",
      icon: <CheckCircle2 className="text-emerald-400" size={28} />
    },
    {
      number: "04",
      title: "Iterate & Refactor",
      description: "Use the built-in coding assistant to refine code structure and clean up warnings.",
      icon: <MessageSquare className="text-amber-400" size={28} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/20 mesh-gradient relative overflow-hidden flex flex-col font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-2/3 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* HERO WRAPPER */}
      <div className="min-h-screen flex flex-col justify-between relative z-10 w-full">
        {/* NAVBAR */}
        <header className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Code2 className="text-white" size={20} />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
              AI Code Reviewer
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 border border-slate-850 hover:border-slate-800 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="flex-1 flex flex-col items-center justify-center text-center max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 md:py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 sm:mb-8 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
            <Sparkles size={14} className="text-blue-400" />
            <span>Developer-First Static Code Inspection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] max-w-4xl text-white">
            Deep Code Reviews &amp; Security Audits
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              in Seconds
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Automate code quality inspections, catch hidden security vulnerabilities, and receive actionable refactoring recommendations before shipping code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-10 z-20 w-full sm:w-auto px-4 sm:px-0 justify-center">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 w-full sm:w-auto"
            >
              <span>Start Reviewing Code</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full sm:w-auto"
            >
              <Terminal size={16} />
              <span>Explore Studio</span>
            </Link>
          </div>
        </section>

        <div className="h-16 hidden md:block select-none pointer-events-none"></div>
      </div>

      {/* FEATURES & VALUE PROPOSITION */}
      <div className="relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Built for Clean Engineering Standards
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3">
              Comprehensive static checks designed to maintain codebase health and readability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-200 flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 mb-5 shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WORKFLOW PIPELINE */}
        <section className="bg-slate-950/60 border-y border-slate-900 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                How Code Audits Work
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-3">
                Streamlined inspection pipeline from input submission to actionable diffs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="glass-panel p-6 rounded-2xl flex flex-col items-start relative border border-slate-900 hover:border-slate-800 transition-all duration-200">
                  <div className="text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md mb-4 uppercase tracking-wide">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 mb-4 shrink-0">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16 my-12 sm:my-20 rounded-3xl text-center glass-panel border border-slate-900 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready to elevate your code quality?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base mt-4 max-w-lg mx-auto leading-relaxed">
              Create an account to start analyzing source files and receiving instant refactoring insights.
            </p>
            <Link
              to="/register"
              className="inline-block mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200"
            >
              Get Started Free
            </Link>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 px-4 sm:px-8 py-6 text-center text-xs text-slate-500">
        © 2026 AI Code Reviewer. Engineered for modern software development teams.
      </footer>
    </div>
  );
}

export default LandingPage;