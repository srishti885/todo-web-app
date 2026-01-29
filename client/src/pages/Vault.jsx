import React, { useState, useEffect } from 'react';
import { fetchBoards, createBoard, deleteBoard } from '../api'; 
import BoardCard from '../components/BoardCard';
import { auth } from '../firebase';
import { 
  Plus, LogOut, User, ShieldCheck, 
  Search, Filter, Sparkles, Lock, Terminal, 
  Cpu, Archive, Activity, CheckCircle2, Zap, Trash2, CpuIcon 
} from 'lucide-react';

const Vault = ({ userEmail }) => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [suggestions, setSuggestions] = useState([]);
  const systemKeywords = ["Main Project", "UI Design", "Backend API", "Security Patch", "Database Schema"];

  useEffect(() => {
    loadBoards();
  }, [userEmail]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = systemKeywords.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadBoards = async () => {
    try {
      const res = await fetchBoards(userEmail);
      setBoards(res.data);
    } catch (err) {
      console.error("Error loading boards", err);
    }
  };

  // DELETE LOGIC
  const handleDeleteBoard = async (boardId) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO TERMINATE THIS NODE?")) {
      try {
        await deleteBoard(boardId);
        setBoards(prev => prev.filter(b => b._id !== boardId));
        loadBoards(); // Re-sync with server
      } catch (err) {
        console.error("Error deleting board", err);
        alert("TERMINATION FAILED: Backend Sync Error");
      }
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle) return;
    try {
      await createBoard({ 
        title: newBoardTitle, 
        userEmail,
        createdAt: new Date(),
        status: 'Active' 
      });
      setNewBoardTitle('');
      loadBoards();
    } catch (err) {
      console.error("Error creating board", err);
    }
  };

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && board.status === filterType;
  });

  const handleLogout = () => auth.signOut();

  return (
    <div className="bg-transparent text-white selection:bg-blue-500/30"> 
      
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-50 py-6 flex justify-between items-center px-4 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl mb-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#020617] p-2.5 rounded-xl border border-white/10 text-blue-500 shadow-2xl">
              <Lock size={22} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent uppercase">My Vault</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[8px] font-bold tracking-[0.3em] text-blue-400 uppercase font-mono">Encrypted Session</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <User size={14} className="text-blue-400" />
            <span className="text-xs font-black text-gray-300 tracking-wider uppercase">{userEmail?.split('@')[0]}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/5 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 uppercase italic">
            <LogOut size={14} /> <span>Terminate</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h2 className="text-6xl font-black tracking-tighter italic uppercase">Secure Node</h2>
          <p className="text-gray-500 mt-2 font-bold uppercase text-[10px] tracking-[0.5em] flex items-center gap-2">
            <Terminal size={12} /> Root Access: Srishti Goenka v4.2.0
          </p>
        </div>

        {/* --- SMART SUGGESTIONS BAR --- */}
        <div className="mb-8 flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
          <Cpu className="text-blue-400 animate-pulse" size={20} />
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> System Intelligence
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {["Fix UI Bugs", "Deploy API", "Security Audit", "Client Meeting"].map((s, i) => (
                <button key={i} onClick={() => setNewBoardTitle(s)} className="whitespace-nowrap bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/20 px-3 py-1 rounded-md text-[10px] font-bold text-blue-200 transition-all italic flex items-center gap-1">
                  <Plus size={10} /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors z-10" size={18} />
              <input 
                type="text"
                placeholder="QUERY DATABASE..."
                className="w-full bg-white border border-white/10 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 text-black font-bold placeholder:text-gray-400 transition-all shadow-inner uppercase text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* --- FLOATING AUTO-COMPLETE BOX --- */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => setSearchQuery(s)} className="px-6 py-3 text-black font-bold hover:bg-blue-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0">
                      <span className="uppercase text-xs tracking-wider">{s}</span>
                      <Sparkles size={12} className="text-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative min-w-[200px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Filter size={14} />
              </div>
              <select 
                onChange={(e) => setFilterType(e.target.value)} 
                className="w-full appearance-none bg-[#020617] border border-white/10 pl-10 pr-10 py-4 rounded-2xl outline-none focus:border-blue-500 text-xs font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:bg-white/5 transition-all"
              >
                <option value="all">Archives</option>
                <option value="Active">Active Nodes</option>
                <option value="Completed">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Board */}
        <form onSubmit={handleCreateBoard} className="mb-16 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              required
              className="w-full bg-white border border-white/10 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 text-black text-lg font-bold placeholder:text-gray-400 transition-all shadow-2xl uppercase"
              placeholder="Initialize Node..."
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center gap-3 uppercase italic tracking-tighter">
            <Zap size={20} fill="currentColor" /> Deploy Node
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {filteredBoards.length > 0 ? (
            filteredBoards.map((board) => (
              <div key={board._id} className="relative group transform hover:scale-[1.02] transition-transform duration-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.1)] rounded-[2rem]">
                {/* --- DELETE BUTTON --- */}
                <button 
                  onClick={() => handleDeleteBoard(board._id)}
                  className="absolute top-6 right-6 z-30 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg cursor-pointer border border-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
                
                <BoardCard board={board} onUpdate={loadBoards} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-white/[0.02] inline-block p-20 rounded-[4rem] border-2 border-dashed border-white/5 text-gray-600">
                <ShieldCheck size={64} className="mx-auto mb-6 opacity-10" />
                <p className="text-2xl font-black italic tracking-tighter uppercase">Vault Empty Error</p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mt-2">No active data nodes found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vault;