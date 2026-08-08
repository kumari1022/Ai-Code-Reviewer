import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Code2, User, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        {
          email,
          password
        }
      );
      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
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
            Create Account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Join the Intelligent Code Review platform
          </p>
        </div>

        {/* INPUTS CONTAINER */}
        <div className="flex flex-col gap-4">
          
          {/* NAME FIELD ROW */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl pl-10 pr-4 py-3.5 outline-none text-sm text-white focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-650"
              />
            </div>
            
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl pl-10 pr-4 py-3.5 outline-none text-sm text-white focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-650"
              />
            </div>
          </div>

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
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl pl-12 pr-4 py-4 outline-none text-sm text-white focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
            />
          </div>

        </div>

        {/* REGISTER BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full py-4 mt-8 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 transition flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-500/10 hover:scale-[1.01]"
        >
          <span>Create Account</span>
          <ArrowRight size={16} />
        </button>

        {/* SIGNIN LINK */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:text-blue-400 transition"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;