import { useNavigate } from "react-router-dom";

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="absolute w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            
            <h1 className="text-9xl font-black text-slate-200 animate-pulse">
                404
            </h1>
            
            <h2 className="text-3xl font-bold text-slate-800 mt-4">
                Lost in the Timeline?
            </h2>
            
            <p className="text-slate-500 mt-2 max-w-sm">
                The page you're looking for doesn't exist or has been moved to a different chapter.
            </p>

            <button 
                onClick={() => navigate('/')}
                className="mt-8 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all transform active:scale-95 shadow-lg"
            >
                Back to Menu
            </button>
        </div>
    );
};

export default Error404;