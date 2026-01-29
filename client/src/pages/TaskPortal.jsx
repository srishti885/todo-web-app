import React, { useState } from 'react';
import { auth } from '../firebase';
import AboutPage from './AboutPage'; 
import Vault from './Vault';
import ContactPage from './ContactPage';
import SupportPage from './SupportPage';
import ProjectsPage from './ProjectsPage';
import AnalyticsPage from './AnalyticsPage';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';
import HistoryPage from './HistoryPage'; 

import { 
  Home, LogOut, LayoutDashboard, Sparkles, Menu, X, 
  Settings, Briefcase, BarChart3, Bell, User, History 
} from 'lucide-react';

const TaskPortal = ({ user }) => {
  const [activeNav, setActiveNav] = useState('Vault'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const goToLanding = () => {
    auth.signOut();
  };

  // Sidebar Menu Items logic
  const sideItems = [
    { id: 'Projects', icon: <Briefcase size={20} />, label: 'Projects' },
    { id: 'Analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { id: 'Notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'History', icon: <History size={20} />, label: 'History' }, // New History Item
    { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
    { id: 'Profile', icon: <User size={20} />, label: 'My Profile' },
  ];

  const renderContent = () => {
    // --- YAHAN SIRF USEREMAIL PROPS ADD KIYE HAIN ---
    switch (activeNav) {
      case 'Vault': return <Vault userEmail={user?.email} />;
      case 'About': return <AboutPage onBack={() => setActiveNav('Vault')} />;
      case 'Contact': return <ContactPage onBack={() => setActiveNav('Vault')} />;
      case 'Support': return <SupportPage onBack={() => setActiveNav('Vault')} />;
      case 'Projects': return <ProjectsPage userEmail={user?.email} />;
      case 'Analytics': return <AnalyticsPage userEmail={user?.email} />; // Fixed
      case 'Notifications': return <NotificationsPage userEmail={user?.email} />; // Fixed
      case 'History': return <HistoryPage userEmail={user?.email} />; // Fixed
      case 'Settings': return <SettingsPage userEmail={user?.email} />;
      case 'Profile': return <ProfilePage userEmail={user?.email} />;
      default: return <Vault userEmail={user?.email} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col overflow-x-hidden">
      
      {/* --- SLIDE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- PREMIUM SIDEBAR --- */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#0f172a] border-r border-white/10 z-[1001] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <span className="text-xl font-black italic tracking-tighter text-blue-500 underline decoration-2 underline-offset-8">CONTROL CENTER</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => { setActiveNav('Vault'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black italic text-xs uppercase tracking-widest transition-all ${activeNav === 'Vault' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>

            {sideItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black italic text-xs uppercase tracking-widest transition-all ${activeNav === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <button onClick={goToLanding} className="flex items-center gap-4 px-4 py-4 text-red-500 font-black italic text-xs uppercase tracking-widest hover:bg-red-500/10 w-full rounded-2xl transition-all">
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- PREMIUM NAVBAR --- */}
      <nav className="h-20 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-[100] px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-xl transition-all text-blue-500"
            >
              <Menu size={28} />
            </button>

            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                  <LayoutDashboard size={20} className="text-white" />
              </div>
              <span className="text-xl font-black italic tracking-tighter uppercase hidden sm:block">TaskVault</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <button onClick={() => {setActiveNav('Vault'); window.scrollTo(0,0)}} className={`hover:text-blue-400 transition-colors ${activeNav === 'Vault' ? 'text-white' : ''}`}>Vault</button>
            <button onClick={() => setActiveNav('About')} className={`hover:text-blue-400 transition-colors ${activeNav === 'About' ? 'text-white' : ''}`}>About</button>
            <button onClick={() => setActiveNav('Contact')} className={`hover:text-blue-400 transition-colors ${activeNav === 'Contact' ? 'text-white' : ''}`}>Contact</button>
            <button onClick={() => setActiveNav('Support')} className={`hover:text-blue-400 transition-colors ${activeNav === 'Support' ? 'text-white' : ''}`}>Support</button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest leading-none mb-1">Status: Active</p>
              <p className="text-xs font-black italic text-white tracking-tighter">{user?.displayName || 'OPERATOR'}</p>
            </div>
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff`} 
              className="w-10 h-10 rounded-full border-2 border-blue-600/50 p-0.5 cursor-pointer hover:scale-110 transition-transform" 
              alt="Profile"
              onClick={() => setActiveNav('Profile')}
            />
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      

    </div>
  );
};

export default TaskPortal;