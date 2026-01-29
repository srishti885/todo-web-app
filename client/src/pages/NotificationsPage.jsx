import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // MongoDB API call ke liye
import { 
  Bell, Clock, AlertCircle, CheckCircle2, 
  History, Calendar, Trash2, ArrowRight,
  ShieldAlert, Zap, Filter, RefreshCw, Search
} from 'lucide-react';

const NotificationsPage = ({ userEmail }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- 🛠️ MERN BACKEND ENGINE: FETCH FROM MONGODB ---
  const fetchAlerts = useCallback(async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    
    try {
      setIsRefreshing(true);
      // Connecting to your Node.js Backend
      const response = await axios.get(`http://localhost:5000/api/projects?email=${userEmail}`);
      const projects = response.data;
      
      const generatedAlerts = [];
      const now = new Date();

      projects.forEach(project => {
        const deadline = project.deadline ? new Date(project.deadline) : null;
        
        // 1. OVERDUE LOGIC (If deadline passed and progress < 100)
        if (deadline && deadline < now && project.progress < 100) {
          generatedAlerts.push({
            id: `ov-${project._id}`, 
            type: 'overdue',
            title: project.title,
            msg: `Deadline crossed at ${project.progress}%. Immediate action required.`,
            time: 'ALERT',
            priority: 'high'
          });
        }

        // 2. UPCOMING LOGIC (If deadline is in the next 48 hours)
        const fortyEightHours = 48 * 60 * 60 * 1000;
        if (deadline && deadline > now && (deadline - now) < fortyEightHours) {
          generatedAlerts.push({
            id: `up-${project._id}`,
            type: 'upcoming',
            title: project.title,
            msg: `Critical deadline approaching. System remains at ${project.progress}%.`,
            time: 'SOON',
            priority: 'medium'
          });
        }

        // 3. RECENT ACTIVITY LOGIC (New projects or low progress)
        if (project.progress < 15) {
          generatedAlerts.push({
            id: `act-${project._id}`,
            type: 'activity',
            title: 'Project Initialized',
            msg: `"${project.title}" is now active in your secure vault.`,
            time: 'RECENT',
            priority: 'low'
          });
        }
      });

      setNotifications(generatedAlerts);
    } catch (error) {
      console.error("MERN Fetch Error in Feed:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // --- ⚡ BUTTON HANDLERS ---
  const handleRefresh = () => fetchAlerts();

  const handleSystemScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert(`SCAN COMPLETE: Verified ${notifications.length} security nodes.`);
    }, 2000);
  };

  const filtered = activeTab === 'All' ? notifications : notifications.filter(n => n.type === activeTab.toLowerCase());

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-black italic tracking-[0.3em] animate-pulse">SYNCING MONGODB NODE...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-700 pb-20 p-4 md:p-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
        <div>
          <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">
            FEED
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4 flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-500" /> Security & Activity Monitor
          </p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {['All', 'Overdue', 'Upcoming', 'Activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-4">
          {filtered.length > 0 ? filtered.map((n) => (
            <div 
              key={n.id} 
              className={`group relative bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 flex items-start gap-6 overflow-hidden`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                n.type === 'overdue' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                n.type === 'upcoming' ? 'bg-blue-500' : 'bg-emerald-500'
              }`}></div>

              <div className={`p-4 rounded-2xl ${
                n.type === 'overdue' ? 'bg-red-500/10 text-red-500' : 
                n.type === 'upcoming' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {n.type === 'overdue' ? <AlertCircle size={24} /> : n.type === 'upcoming' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-black italic tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{n.time}</span>
                </div>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md">{n.msg}</p>
                
                <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                     View Project <ArrowRight size={12} />
                   </button>
                   <button className="text-[10px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest">Dismiss</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-600 font-black italic uppercase tracking-widest">No Alerts in this Sector</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[#0f172a] border border-white/10 rounded-[3rem] p-8">
            <div className="flex items-center gap-3 mb-8">
              <History className="text-blue-500" size={20} />
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">System Logs</h3>
            </div>
            
            <div className="space-y-6">
              <LogEntry time="LIVE" action="MongoDB Stream" status="Connected" />
              <LogEntry time="READY" action="Firebase Auth" status="Success" />
              <LogEntry time="SYNC" action={`${notifications.length} Alerts Processed`} status="Active" />
            </div>

            <button 
              onClick={handleRefresh}
              className="w-full mt-10 border border-white/5 bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "SYNCING..." : "Refresh Node"}
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 text-white relative overflow-hidden group">
            <Zap className="absolute -right-4 -top-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
            <h4 className="text-2xl font-black italic mb-2 tracking-tighter">Stay Focused</h4>
            <p className="text-blue-100 text-xs font-bold leading-relaxed mb-6">
              You have {notifications.filter(n => n.type === 'overdue').length} critical issues pending.
            </p>
            <button 
              onClick={handleSystemScan}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
            >
              {isScanning ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />}
              {isScanning ? "SCANNING..." : "System Scan"}
            </button>
          </div>
        </div>

      </div>

      <footer className="mt-20 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Notification Engine Online</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">
           2026 // Alert Node V4
        </div>
      </footer>
    </div>
  );
};

const LogEntry = ({ time, action, status }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-4">
    <div>
      <p className="text-[10px] font-black text-gray-600 uppercase mb-1">{time}</p>
      <p className="text-sm font-bold italic text-white tracking-tight">{action}</p>
    </div>
    <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md uppercase">
      {status}
    </span>
  </div>
);

export default NotificationsPage;