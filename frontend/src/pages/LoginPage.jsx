import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Code2, Shield, User, ArrowRight } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password
        }
      );
      localStorage.setItem("token", response.data);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 mesh-gradient relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] z-0"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-[32px] p-10 shadow-2xl">
        
        {/* LOGO */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Code2 className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            AI-Powered Developer Code Review Platform
          </p>
        </div>

        {/* ROLE SWITCH */}
        <div className="flex bg-slate-950/60 border border-slate-900 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setRole("USER")}
            className={
              `flex-1 py-2.5 rounded-xl transition text-xs font-semibold flex items-center justify-center gap-2 ` +
              (role === "USER"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-200")
            }
          >
            <User size={14} />
            User Space
          </button>

          <button
            onClick={() => setRole("ADMIN")}
            className={
              `flex-1 py-2.5 rounded-xl transition text-xs font-semibold flex items-center justify-center gap-2 ` +
              (role === "ADMIN"
                ? "bg-red-600 text-white shadow-md shadow-red-500/10"
                : "text-slate-400 hover:text-slate-200")
            }
          >
            <Shield size={14} />
            Admin Space
          </button>
        </div>

        {/* INPUTS CONTAINER */}
        <div className="flex flex-col gap-4">
          
          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl pl-12 pr-4 py-4 outline-none text-sm text-white focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl pl-12 pr-4 py-4 outline-none text-sm text-white focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
            />
          </div>

        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className={
            `w-full py-4 mt-8 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 text-white shadow-lg ` +
            (role === "ADMIN"
              ? "bg-red-600 hover:bg-red-500 shadow-red-500/10"
              : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/10")
          }
        >
          <span>{role === "ADMIN" ? "Login as Admin" : "Sign In to Workspace"}</span>
          <ArrowRight size={16} />
        </button>

        {/* SIGNUP LINK */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 font-semibold hover:text-blue-400 transition"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;