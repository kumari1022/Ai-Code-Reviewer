import { useState } from "react";
import axios from "axios";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data);

      alert("Login Successful");

    } catch (error) {

      console.error(error);
      alert("Login Failed");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-[400px] border border-slate-700">

        <h1 className="text-4xl font-bold text-white mb-2">
          AI Code Reviewer
        </h1>

        <p className="text-slate-400 mb-8">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 mb-4 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 mb-6 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default LoginPage;