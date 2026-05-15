import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setTimeout(() => {
          navigate("/");
        }, 50);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans animate-fade-in">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-8 shadow-lg shadow-indigo-500/20">H</div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
            Elevate Your <br />
            <span className="text-indigo-500">Coding Journey.</span>
          </h1>
          <p className="text-slate-400 mt-6 text-xl max-w-md font-medium leading-relaxed">
            The all-in-one platform for students to track, solve, and dominate the rankings.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 max-w-sm">
            <p className="text-white font-bold italic mb-2">"Code is like humor. When you have to explain it, it’s bad."</p>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">— Cory House</p>
          </div>
        </div>

        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            New to the platform? <Link to="/signup" className="text-indigo-600 font-extrabold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
