import { Link, useNavigate } from 'react-router-dom';

const CodeSpaceNav = () => {
    const navigate = useNavigate();
    return (
        <nav className="flex items-center justify-between px-6 py-2 bg-[#282828] border-b border-[#3e3e3e] text-gray-300">
            <div className="flex items-center gap-6">
                <button onClick={() => navigate('/dashboard')} className="hover:text-white font-bold">
                    HighRanker
                </button>
                <Link to="/codespaceproblemset" className="hover:text-white border-b-2 border-orange-500 px-2">Problems</Link>
                <Link to="/rankList/CodeSpaceRanking" className="hover:text-white">Leaderboard</Link>
            </div>
            <div className="flex items-center gap-4">
            </div>
        </nav>
    );
};

export default CodeSpaceNav;