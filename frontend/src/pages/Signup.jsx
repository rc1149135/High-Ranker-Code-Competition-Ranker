import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans animate-fade-in">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-8 shadow-lg shadow-indigo-500/20">H</div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
            Join the <br />
            <span className="text-indigo-500">Elite Squad.</span>
          </h1>
          <p className="text-slate-400 mt-6 text-xl max-w-md font-medium leading-relaxed">
            Start your competitive journey, link your accounts, and see where you rank among your peers.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 max-w-sm">
            <p className="text-white font-bold italic mb-2">"The only way to learn a new programming language is by writing programs in it."</p>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">— Dennis Ritchie</p>
          </div>
        </div>

        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join 1000+ students already on the platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Username</label>
              <input
                type="text"
                placeholder="developer_zero"
                required
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Get Started
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="text-indigo-600 font-extrabold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
