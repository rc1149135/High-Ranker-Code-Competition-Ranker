import { useLocation, useNavigate } from "react-router-dom";

const Menu = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (["/login", "/signup"].includes(location.pathname)) return null;

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> 
    },
    { 
      name: "Major Ranking", 
      path: "/rankList/MajorRanking", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
    },
    { name: "LeetCode", path: "/rankList/LeetCodeRanking", icon: "🟡" },
    { name: "CodeForces", path: "/rankList/CodeForcesRanking", icon: "🔵" },
    { 
      name: "CodeSpace Rank", 
      path: "/rankList/CodeSpaceRanking", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
    },
    { 
      name: "CodeSpace", 
      path: "/codespaceproblemset", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> 
    },
    {
      name: "Circles",
      path: "/circles",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
    {
      name: "Tempers",
      path: "/tempers",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" /></svg>
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-screen bg-[#0f172a] text-slate-400 transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-slate-800/50 ${
      isMenuOpen ? "w-64" : "w-20"
    }`}>
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl">H</div>
        <span className={`text-white font-bold text-lg tracking-tight transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
          HighRanker
        </span>
      </div>

      {/* Tray Toggle Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-[60]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? "rotate-0" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Nav Links */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group ${
              location.pathname === item.path 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]" 
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? "text-indigo-400" : "text-slate-500"}`}>
              {item.icon}
            </span>
            <span className={`whitespace-nowrap font-semibold text-sm transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}>
              {item.name}
            </span>
          </button>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          className="w-full flex items-center gap-4 p-3.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </span>
          <span className={`font-semibold text-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
 Menu;