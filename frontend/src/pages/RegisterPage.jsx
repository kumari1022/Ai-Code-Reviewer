import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Code2, User, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { API_URL } from "../config";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and Password are required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        {
          email,
          password
        }
      );
      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Email may already be in use or backend server is unreachable.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 sm:px-6 mesh-gradient relative overflow-hidden font-sans">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-950/60 border border-slate-900 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-md">
        
        {/* LOGO */}
        <div className="text-center mb-7 flex flex-col items-center">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-3">
            <Code2 className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create your Account
          </h1>
          <p className="text-slate-400 mt-1.5 text-xs">
            Start performing automated code reviews &amp; security audits
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input
                type="email"
                placeholder="developer@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{submitting ? "Creating Account..." : "Create Free Account"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;