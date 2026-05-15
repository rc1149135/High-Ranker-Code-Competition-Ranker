import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const boilerplates = {
    cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
    python: "import sys\n\ndef main():\n    # your code here\n    pass\n\nif __name__ == '__main__':\n    main()",
    java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}"
};

const CodeSpace = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [status, setStatus] = useState("Idle");
    const [errorLogs, setErrorLogs] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await api.get(`/api/problems/${slug}`);
                setProblem(res.data);
                setCode(res.data.defaultCode || boilerplates["cpp"]);
            } catch (err) {
                console.error("Error fetching problem details:", err);
                setStatus("Failed to load problem.");
            }
        };
        fetchProblem();
    }, [slug, navigate]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (Object.values(boilerplates).includes(code) || code === "") {
            setCode(boilerplates[newLang]);
        }
    };

    const handleSubmit = async () => {
        setStatus("Processing...");
        setErrorLogs("");
        try {
            const res = await api.post("/api/submissions/submit", {
                problemId: problem._id,
                code,
                language
            });

            const { status: resultStatus, error } = res.data;
            setStatus(resultStatus === "Accepted" ? "✅ Accepted" : "❌ " + resultStatus);

            if (error) setErrorLogs(error);

        } catch (err) {
            setStatus("Error submitting code");
            console.error(err);
        }
    };

    const [auditLoading, setAuditLoading] = useState(false);
    const [auditResult, setAuditResult] = useState("");
    const [showAudit, setShowAudit] = useState(false);

    const handleAudit = async () => {
        setAuditLoading(true);
        setShowAudit(true);
        setAuditResult("");
        try {
            const res = await api.post("/api/problems/audit", {
                problemId: problem._id,
                code,
                language
            });
            setAuditResult(res.data.audit);
        } catch (err) {
            setAuditResult("Failed to generate audit. Please ensure GEMINI_API_KEY is set in the backend .env file.");
            console.error(err);
        } finally {
            setAuditLoading(false);
        }
    };

    if (!problem) return <div className="h-screen flex items-center justify-center bg-[#1a1a1a] text-white">Loading...</div>;

    return (
        <div className="flex flex-col h-screen bg-[#1a1a1a] text-white relative overflow-hidden">
            <div className="flex justify-between items-center px-6 py-3 bg-[#252525] border-b border-gray-700 shadow-md">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight">{problem.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded border border-gray-600 focus:outline-none transition"
                    >
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 px-6 py-1.5 rounded font-bold transition active:scale-95"
                    >
                        Submit Code
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 p-6 overflow-y-auto border-r border-gray-700 bg-[#1e1e1e]">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400 border border-green-700' :
                                'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                            }`}>
                            {problem.difficulty}
                        </span>
                        <span className="text-gray-500 text-sm">Points: {problem.points}</span>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                    </div>

                    {problem.testCases && (
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Example Input</h3>
                            <pre className="bg-[#2a2a2a] p-3 rounded text-sm font-mono border border-gray-700 overflow-x-auto">
                                {problem.testCases[0]?.input}
                            </pre>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mt-4 mb-2">Example Output</h3>
                            <pre className="bg-[#2a2a2a] p-3 rounded text-sm font-mono border border-gray-700 overflow-x-auto">
                                {problem.testCases[0]?.expectedOutput}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language === 'cpp' ? 'cpp' : language}
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                fontSize: 15,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 10 }
                            }}
                        />
                    </div>

                    {errorLogs && (
                        <div className="h-1/4 bg-[#141414] border-t border-red-900/50 p-4 overflow-y-auto font-mono text-xs text-red-400">
                            <h4 className="text-red-500 mb-2 font-bold uppercase">Compiler / Runtime Error:</h4>
                            <pre className="whitespace-pre-wrap">{errorLogs}</pre>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 py-2 bg-[#252525] border-t border-gray-700 flex justify-between items-center z-10">
                <div className="flex items-center gap-6">
                    <p className="font-mono text-sm">
                        Status: <span className={status.includes("✅") ? "text-green-400" : status.includes("❌") ? "text-red-400" : "text-blue-400"}>
                            {status}
                        </span>
                    </p>
                    {status.includes("✅") && (
                        <button 
                            onClick={handleAudit}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest transition-all animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        >
                            <span className="text-lg">🤖</span> AI Audit
                        </button>
                    )}
                </div>
                <p className="text-gray-500 text-xs italic">Master the challenge, then audit for perfection.</p>
            </div>

            {/* AI Audit Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-[#1a1c23] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-in-out z-[100] p-8 overflow-y-auto ${showAudit ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">AI Code Audit</h2>
                    <button onClick={() => setShowAudit(false)} className="text-slate-500 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {auditLoading ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-indigo-400">
                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-black uppercase tracking-widest animate-pulse">Analyzing Logic...</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-headings:text-white prose-strong:text-indigo-400">
                        {auditResult ? (
                           <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-300">
                               {auditResult.split('\n').map((line, i) => (
                                   <div key={i} className="mb-2">{line}</div>
                               ))}
                           </div>
                        ) : (
                            <p className="italic text-slate-500">Initiate audit to receive feedback.</p>
                        )}
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Powered by Gemini 1.5 Flash</p>
                </div>
            </div>
        </div>
    );
};

export default CodeSpace;