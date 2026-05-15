import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api, { BASE_URL } from "../api/axios";

const socket = io(BASE_URL);

function SquadChat({ slug, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    // 1. Join Squad Room
    socket.emit("join_circle", slug);

    // 2. Fetch Chat History
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/circles/${slug}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchHistory();

    // 3. Listen for Incoming Messages
    socket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
    });

    return () => {
        socket.off("receive_message");
    };
  }, [slug]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      slug,
      content: newMessage,
      senderId: currentUser.id || currentUser._id,
      username: currentUser.username
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 ${isOpen ? "w-[400px]" : "w-16"}`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all absolute bottom-0 right-0 z-10"
      >
        {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-indigo-600 rounded-full animate-pulse"></span>
            </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col h-[600px] overflow-hidden animate-fade-in-up">
            <header className="p-6 bg-slate-800/50 border-b border-slate-800 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Squad Intel</h3>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div 
                        key={i} 
                        className={`flex flex-col ${msg.sender === (currentUser.id || currentUser._id) ? "items-end" : "items-start"}`}
                    >
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 px-1">
                            {msg.username}
                        </span>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${
                            msg.sender === (currentUser.id || currentUser._id)
                            ? "bg-indigo-600 text-white rounded-tr-none" 
                            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-slate-800/20 border-t border-slate-800">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Type intel..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-1.5 p-1.5 text-indigo-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}

export default SquadChat;
