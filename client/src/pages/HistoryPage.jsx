import React, { useState, useEffect } from 'react';
import axios from 'axios'; // MongoDB API call ke liye
import { 
  History, Search, Calendar, Filter, 
  ArrowUpRight, Clock, Box, Layers, 
  Download, RefreshCw, ChevronRight
} from 'lucide-react';

const HistoryPage = ({ userEmail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. BACKEND REAL-TIME FETCH (MONGODB) ---
  const fetchHistory = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    try {
      // Backend URL: Aapke Node.js server ka endpoint
      const response = await axios.get(`http://localhost:5000/api/projects?email=${userEmail}`);
      
      // History Logic: Projects data se history generate karna
      // Note: Agar aapne alag se 'activities' collection banaya hai toh URL wahan point karein
      const historyData = response.data.map(proj => ({
        id: proj._id,
        action: "Project Accessed",
        project: proj.title,
        type: proj.category === 'Dev' ? 'task' : 'project',
        status: proj.status,
        time: "LIVE",
        date: proj.deadline
      }));

      setLogs(historyData);
      setLoading(false);
    } catch (error) {
      console.error("MERN History Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userEmail]);

  // --- 2. SEARCH FILTER (UI Logic) ---
  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.project?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-black italic tracking-widest animate-pulse">DECRYPTING LEDGER...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-1000 pb-20 p-4 md:p-8">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">
            HISTORY
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4 flex items-center gap-3">
            <Layers size={14} className="text-blue-500" /> Immutable Activity Ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all">
            <Download size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* --- LEFT: QUICK STATS --- */}
        <div className="lg:col-span-1 space-y-6">
          <HistoryStat label="Total Events" value={logs.length} />
          <HistoryStat label="Active User" value={userEmail?.split('@')[0]} />
          
          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 group cursor-pointer overflow-hidden relative" onClick={fetchHistory}>
            <RefreshCw className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:rotate-180 transition-transform duration-1000" />
            <h4 className="text-xl font-black italic mb-1 tracking-tighter">Live Sync</h4>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Real-time updates active</p>
          </div>
        </div>

        {/* --- RIGHT: TIMELINE LEDGER --- */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                    <LogIcon type={log.type} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black italic tracking-tight">{log.action}</h3>
                      <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                        {log.status || 'Verified'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Box size={12} /> {log.project}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 text-left md:text-right flex items-center md:flex-col gap-4 md:gap-0">
                  <p className="text-sm font-black italic text-white tracking-tighter">{log.time}</p>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{log.date || 'Recent'}</p>
                  <ChevronRight size={18} className="text-gray-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            )) : (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <p className="text-gray-500 font-black italic">NO ACTIVITY RECORDED YET</p>
              </div>
            )}
          </div>

          <button className="w-full mt-10 py-6 border-2 border-dashed border-white/5 rounded-[2.5rem] text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] hover:border-blue-500/20 hover:text-gray-300 transition-all">
            Load Archived Metadata
          </button>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="mt-24 pt-10 border-t border-white/5 flex justify-between items-center opacity-30">
        <p className="text-[8px] font-black uppercase tracking-[0.4em]">Node History // Verified</p>
        <p className="text-[8px] font-black uppercase tracking-[0.4em]">SYSTEM_VERSION_2026</p>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS (UNTOUCHED) ---
const HistoryStat = ({ label, value }) => (
  <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem]">
    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black italic tracking-tighter text-white">{value}</p>
  </div>
);

const LogIcon = ({ type }) => {
  switch(type) {
    case 'task': return <ArrowUpRight className="text-emerald-500" size={24} />;
    case 'project': return <Layers className="text-blue-500" size={24} />;
    case 'config': return <RefreshCw className="text-purple-500" size={24} />;
    default: return <Clock className="text-gray-500" size={24} />;
  }
};

export default HistoryPage;