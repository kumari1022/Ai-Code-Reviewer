import { Link } from "react-router-dom";
import { 
  Code2, 
  Cpu, 
  History, 
  Lock, 
  UploadCloud, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle,
  Zap
} from "lucide-react";

function LandingPage() {
  const features = [
    {
      title: "AI Code Review",
      description: "Analyze Java code instantly using advanced Groq AI models.",
      icon: <Cpu className="text-blue-400" size={26} />
    },
    {
      title: "AI Chat Assistant",
      description: "Chat with AI to optimize, refactor, and debug your code in real-time.",
      icon: <MessageSquare className="text-purple-400" size={26} />
    },
    {
      title: "Review History",
      description: "Access and review all previous AI analysis sessions anytime, anywhere.",
      icon: <History className="text-emerald-400" size={26} />
    },
    {
      title: "Secure Platform",
      description: "Full JWT Authentication integrated with standard Spring Security rules.",
      icon: <Lock className="text-orange-400" size={26} />
    }
  ];

  const technologies = [
    "React 19",
    "Spring Boot 3",
    "JWT Security",
    "Redis Cache",
    "MySQL DB",
    "Groq AI API",
    "Tailwind CSS"
  ];

  const steps = [
    {
      number: "01",
      title: "Upload File",
      description: "Drop your Java source code file in our smart analyzer.",
      icon: <UploadCloud className="text-blue-500" size={32} />
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Groq AI scans for complexity, bugs, and maintainability.",
      icon: <Cpu className="text-purple-500" size={32} />
    },
    {
      number: "03",
      title: "Deep Review",
      description: "Get localized scores and lines requiring immediate fixes.",
      icon: <CheckCircle className="text-indigo-500" size={32} />
    },
    {
      number: "04",
      title: "Interactive Chat",
      description: "Discuss fixes and ask questions to the AI assistant.",
      icon: <MessageSquare className="text-emerald-500" size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/20 mesh-gradient relative overflow-hidden flex flex-col">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-glow z-0"></div>
      <div className="absolute top-2/3 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-glow delay-1000 z-0"></div>

      {/* VIEWPORT HERO SPLASH (Navbar + Centered Hero) */}
      <div className="min-h-screen flex flex-col justify-between relative z-10 w-full">
        {/* NAVBAR */}
        <nav className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code2 className="text-white" size={20} />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
              AI Code Reviewer
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-355 hover:text-white hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* HERO SECTION - Centered in remaining space of viewport */}
        <section className="flex-1 flex flex-col items-center justify-center text-center max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 md:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 sm:mb-8 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wide">
            <Zap size={12} className="text-blue-400 animate-bounce" />
            <span>Intelligent Java Code Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-5xl">
            Automated AI Powered
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-glow-blue">
              Code Review Platform
            </span>
          </h1>

          <p className="text-slate-455 text-sm sm:text-base md:text-lg mt-6 sm:mt-8 max-w-3xl leading-relaxed">
            Upload your Java source files, receive detailed AI analysis instantly,
            detect hidden bugs, check complex blocks, and debug interactively with
            your private AI coding assistant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 sm:mt-12 z-20 w-full sm:w-auto px-4 sm:px-0 justify-center">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
            >
              <span>Start Reviewing Free</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Dummy spacer to match exact vertical center relative to navbar */}
        <div className="h-20 hidden md:block select-none pointer-events-none"></div>
      </div>

      {/* VALUE ADDED SCROLL SECTIONS */}
      <div className="relative z-10 w-full">

        {/* FEATURES SECTION */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-slate-900/60">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Designed for Clean Code
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 sm:mt-4">
              Leverage bleeding-edge AI models to continuously refine and optimize your software development flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-900/80 hover:border-blue-500/20 glass-panel-hover flex flex-col items-start"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800/60 mb-5 sm:mb-6 shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative z-10 bg-slate-950/40 backdrop-blur-sm border-y border-slate-900/60 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Simple 4-Step Pipeline
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 sm:mt-4">
                Get detailed suggestions and optimizations in less than 30 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center relative hover:border-slate-800 transition-all duration-300 group">
                  {/* Step number badge */}
                  <div className="absolute top-4 left-4 text-[10px] font-extrabold tracking-widest text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full select-none uppercase">
                    STEP {step.number}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-xl relative z-10 mb-5 mt-4 shrink-0">
                    {step.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-200 mb-2 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-slate-450 text-xs sm:text-sm leading-relaxed relative z-10 px-2">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10">
          <section className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-16 my-12 sm:my-20 rounded-[32px] overflow-hidden text-center glass-panel border border-slate-900 shadow-2xl shadow-blue-500/5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto px-2">
              Start Building Better Code With AI
            </h2>
            <p className="text-slate-455 text-xs sm:text-sm md:text-base mt-4 sm:mt-6 max-w-xl mx-auto leading-relaxed">
              Sign up to experience instant intelligent code analysis and refactoring tips powered by advanced LLMs.
            </p>
            <Link
              to="/register"
              className="inline-block mt-8 sm:mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 sm:px-10 py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </Link>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-900/60 px-4 sm:px-8 py-6 sm:py-8 text-center text-[10px] sm:text-xs text-slate-500 tracking-wider">
        © 2026 AI Code Reviewer. Engineered with React 19, Spring Boot, Redis, Groq & Tailwind CSS.
      </footer>
    </div>
  );
}

export default LandingPage;