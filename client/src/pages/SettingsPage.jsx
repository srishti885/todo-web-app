import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { 
 User, Palette, Lock, Bell, Shield, 
 ChevronRight, Save, LogOut, Moon, Sun, 
 Check, Info, Globe, Smartphone
} from 'lucide-react';

const SettingsPage = ({ userEmail }) => {
 const [activeTab, setActiveTab] = useState('Profile'); 
 const [activeTheme, setActiveTheme] = useState('Deep Blue');
 const [displayName, setDisplayName] = useState('');
 const [loading, setLoading] = useState(true);
 const [isSyncing, setIsSyncing] = useState(false);
 const [notifications, setNotifications] = useState({
   push: true,
   email: false,
   alerts: true
 });

 // --- 🔒 SECURITY STATE ---
 const [passwords, setPasswords] = useState({ current: '', new: '' });

 const applyTheme = (themeName) => {
   const root = document.documentElement;
   const themes = {
     'Deep Blue': { primary: '#2563eb', bg: '#0f172a' },
     'Cyber Purple': { primary: '#9333ea', bg: '#1e1b4b' },
     'Slate Noir': { primary: '#4b5563', bg: '#020617' },
     'Crimson': { primary: '#dc2626', bg: '#1a0a0a' }
   };
   const selected = themes[themeName] || themes['Deep Blue'];
   document.body.style.backgroundColor = selected.bg;
   document.body.style.transition = "background-color 0.5s ease";
   root.style.setProperty('--system-primary', selected.primary);
   setActiveTheme(themeName);
 };

 useEffect(() => {
   const fetchSettings = async () => {
     const localData = localStorage.getItem(`settings_${userEmail}`);
     if (localData) {
       const parsed = JSON.parse(localData);
       setActiveTheme(parsed.theme);
       setDisplayName(parsed.name);
       setNotifications(parsed.notifs);
       applyTheme(parsed.theme);
     }
     if (!userEmail) return;
     try {
       const response = await axios.get(`http://localhost:5000/api/settings?email=${userEmail}`);
       if (response.data) {
         const { theme, name, notifs } = response.data;
         setActiveTheme(theme || 'Deep Blue');
         setDisplayName(name || '');
         setNotifications(notifs || notifications);
         applyTheme(theme || 'Deep Blue');
       }
     } catch (err) {
       console.warn("Backend offline.");
     } finally {
       setLoading(false);
     }
   };
   fetchSettings();
 }, [userEmail]);

 const handleSync = async () => {
   setIsSyncing(true);
   const payload = {
     email: userEmail,
     theme: activeTheme,
     name: displayName,
     notifs: notifications,
     passwords: passwords.new ? passwords : null // Send passwords only if being changed
   };
   localStorage.setItem(`settings_${userEmail}`, JSON.stringify(payload));
   try {
     await axios.post(`http://localhost:5000/api/settings/update`, payload);
     alert("SYSTEM CONFIGURATION SYNCED");
     setPasswords({ current: '', new: '' }); // Reset fields after success
   } catch (err) {
     alert("LOCAL CACHE UPDATED");
   } finally {
     setIsSyncing(false);
   }
 };

 const toggleNotif = (key) => {
   setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
 };

 if (loading) return (
   <div className="h-[60vh] flex flex-col items-center justify-center">
     <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
     <p className="text-gray-500 font-black italic tracking-widest animate-pulse">RETRIVING CONFIG...</p>
   </div>
 );

 return (
   <div className="animate-in fade-in zoom-in-95 duration-700 pb-20 p-4 md:p-8">
     <div className="mb-16">
       <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">SETTINGS</h1>
       <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4 flex items-center gap-3">
         <Shield size={14} className="text-blue-500" /> System Configuration v4.0
       </p>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
       <div className="lg:col-span-1 space-y-2">
         <NavButton icon={<User size={18}/>} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
         <NavButton icon={<Palette size={18}/>} label="Appearance" active={activeTab === 'Appearance'} onClick={() => setActiveTab('Appearance')} />
         <NavButton icon={<Lock size={18}/>} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
         <NavButton icon={<Bell size={18}/>} label="Preferences" active={activeTab === 'Preferences'} onClick={() => setActiveTab('Preferences')} />
         <div className="pt-8 mt-8 border-t border-white/5">
           {/* --- EXIT BUTTON UPDATED HERE --- */}
           <button 
             onClick={() => window.location.href = '/'} 
             className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black italic uppercase text-xs tracking-widest"
           >
             <LogOut size={18} /> Exit System
           </button>
         </div>
       </div>

       <div className="lg:col-span-3 space-y-12">
         {/* Section: Profile */}
         {activeTab === 'Profile' && (
           <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md">
             <h3 className="text-2xl font-black italic mb-8 flex items-center gap-3"><span className="h-2 w-2 bg-blue-500 rounded-full"></span> Profile Node</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Identity</p>
                 <input disabled value={userEmail || ''} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-gray-400 outline-none cursor-not-allowed" />
               </div>
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Display Name</p>
                 <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Administrator" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white outline-none focus:border-blue-500 transition-all" />
               </div>
             </div>
           </section>
         )}

         {/* Section: Security (Functional Logic) */}
         {activeTab === 'Security' && (
           <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md">
             <h3 className="text-2xl font-black italic mb-8 flex items-center gap-3"><Lock className="text-blue-500" size={20}/> Access Control</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Current Access Key</p>
                 <input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white outline-none focus:border-blue-500" />
               </div>
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">New Access Key</p>
                 <input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white outline-none focus:border-blue-500" />
               </div>
             </div>
           </section>
         )}

         {/* Section: Appearance */}
         {activeTab === 'Appearance' && (
           <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
             <h3 className="text-2xl font-black italic mb-8">Theme Palette</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {['Deep Blue', 'Cyber Purple', 'Slate Noir', 'Crimson'].map((t) => (
                 <button key={t} onClick={() => applyTheme(t)} className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${activeTheme === t ? 'border-blue-500 bg-blue-500/10 shadow-lg' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                   <div className={`h-8 w-8 rounded-full ${t === 'Deep Blue' ? 'bg-blue-600' : t === 'Cyber Purple' ? 'bg-purple-600' : t === 'Slate Noir' ? 'bg-gray-800' : 'bg-red-600'}`}></div>
                   <span className="text-[10px] font-black uppercase italic">{t}</span>
                 </button>
               ))}
             </div>
           </section>
         )}

         {/* Section: Preferences */}
         {activeTab === 'Preferences' && (
           <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
             <h3 className="text-2xl font-black italic mb-8">System Signals</h3>
             <div className="space-y-4">
               <ToggleRow label="Push Notifications" active={notifications.push} onToggle={() => toggleNotif('push')} />
               <ToggleRow label="Email Reports" active={notifications.email} onToggle={() => toggleNotif('email')} />
               <ToggleRow label="Critical Alerts" active={notifications.alerts} onToggle={() => toggleNotif('alerts')} />
             </div>
           </section>
         )}

         <div className="flex justify-end gap-4 mt-12">
           <button onClick={handleSync} disabled={isSyncing} className={`px-10 py-5 rounded-2xl bg-white text-black font-black italic text-lg shadow-xl active:scale-95 transition-all flex items-center gap-3 ${isSyncing ? 'opacity-50' : ''}`}>
             <Save size={20} /> {isSyncing ? 'SYNCING...' : 'SYNC CHANGES'}
           </button>
         </div>
       </div>
     </div>
     <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
       <div className="text-[10px] font-black uppercase tracking-[0.5em]">System Node: 192.168.1.1</div>
       <div className="text-[10px] font-black uppercase tracking-[0.5em]">2026 Internal Build</div>
     </footer>
   </div>
 );
};

// --- HELPER COMPONENTS ---
const NavButton = ({ icon, label, active, onClick }) => (
 <button onClick={onClick} className={`flex items-center gap-4 px-6 py-4 w-full rounded-2xl transition-all font-black italic uppercase text-xs tracking-widest ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
   {icon} {label}
 </button>
);

const ToggleRow = ({ label, active, onToggle }) => (
 <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group transition-all">
   <h4 className="font-black italic text-lg uppercase group-hover:text-blue-400 transition-colors">{label}</h4>
   <button onClick={onToggle} className={`w-14 h-8 rounded-full p-1 transition-all duration-300 flex items-center ${active ? 'bg-blue-600' : 'bg-gray-800'}`}>
     <div className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
   </button>
 </div>
);

export default SettingsPage;