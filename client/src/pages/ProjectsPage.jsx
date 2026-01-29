import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // MongoDB API call ke liye
import { 
  Plus, Layout, Search, Filter, Trash2, X, Zap 
} from 'lucide-react';

const ProjectsPage = ({ userEmail }) => {
  // --- 1. STATE MANAGEMENT ---
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', category: 'Dev', tasks: 0 });

  // --- 2. BACKEND FETCH (MONGODB via NODE.JS) ---
  const fetchProjects = async () => {
    // Debugging: Check if userEmail exists
    if (!userEmail) {
      console.warn("User email missing! Cannot fetch projects.");
      setLoading(false);
      return;
    }

    try {
      // Added a console log to see what's happening in background
      console.log(`Fetching projects for: ${userEmail}`);
      const response = await axios.get(`http://localhost:5000/api/projects?email=${userEmail}`);
      
      if (response.data) {
        setProjects(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("MongoDB Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userEmail]);

  // --- 3. BACKEND CREATE (MONGODB) ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.tasks) return;
    
    try {
      const payload = {
        title: newProject.title,
        category: newProject.category,
        tasks: parseInt(newProject.tasks),
        completed: 0,
        progress: 0,
        status: 'In Progress',
        userEmail: userEmail
      };

      await axios.post('http://localhost:5000/api/projects', payload);
      
      fetchProjects();
      setShowModal(false);
      setNewProject({ title: '', category: 'Dev', tasks: 0 });
    } catch (err) {
      console.error("Error creating project in MongoDB:", err);
    }
  };

  // --- 4. BACKEND UPDATE (QUICK PROGRESS) ---
  const handleQuickProgress = async (id, currentCompleted, totalTasks) => {
    if (currentCompleted < totalTasks) {
      const newCompleted = currentCompleted + 1;
      const newProgress = Math.round((newCompleted / totalTasks) * 100);
      
      try {
        await axios.patch(`http://localhost:5000/api/projects/${id}`, {
          completed: newCompleted,
          progress: newProgress,
          status: newProgress === 100 ? 'Active' : 'In Progress'
        });
        fetchProjects(); 
      } catch (err) {
        console.error("Update Error:", err);
      }
    }
  };

  // --- 5. BACKEND DELETE (MONGODB) ---
  const handleDelete = async (id) => {
    if(window.confirm("Bhai, pakka delete karna hai?")) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  // 6. FILTER & SEARCH LOGIC
  const filteredProjects = useMemo(() => {
    // Check if projects is an array before filtering
    if (!Array.isArray(projects)) return [];

    return projects.filter(p => {
      const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, projects]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-black italic tracking-widest animate-pulse">CONNECTING TO MONGODB...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 animate-in fade-in duration-700 pb-20 p-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">PROJECTS</h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              MERN Stack Active: {userEmail || "No User Detected"}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 rounded-xl outline-none focus:border-blue-500 transition-all font-bold italic"
              />
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent outline-none font-bold text-sm cursor-pointer appearance-none text-blue-400"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
              <Plus size={20} /> NEW
            </button>
          </div>
        </div>

        {/* --- STATS BAR --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</p>
            <p className="text-3xl font-black italic tracking-tighter">{projects.length}</p>
          </div>
          <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">In Progress</p>
            <p className="text-3xl font-black italic tracking-tighter text-blue-400">
              {projects.filter(p => p.status !== 'Active').length}
            </p>
          </div>
        </div>

        {/* --- PROJECTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <div key={p._id} className="group bg-[#0f172a]/50 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all relative overflow-hidden">
                <button onClick={() => handleDelete(p._id)} className="absolute top-8 right-8 text-gray-700 hover:text-red-500 transition-colors z-10">
                  <Trash2 size={18} />
                </button>

                <div className="mb-8">
                  <span className="text-[10px] font-black bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">
                    {p.category}
                  </span>
                  <h3 className="text-3xl font-black italic mt-4 group-hover:text-blue-400 transition-colors">{p.title}</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[10px] font-black italic text-gray-400 uppercase tracking-widest">
                    <span>Execution Status</span>
                    <span className="text-blue-400">{p.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full transition-all duration-700" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-600 uppercase">Velocity</p>
                    <p className="text-xl font-black italic">{p.completed} / {p.tasks}</p>
                  </div>
                  <button 
                    onClick={() => handleQuickProgress(p._id, p.completed, p.tasks)} 
                    className="bg-white/5 hover:bg-blue-600 p-3 rounded-2xl transition-all active:scale-90"
                  >
                    <Zap size={20} className="text-blue-500 hover:text-white" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
               <p className="text-gray-600 font-black italic text-xl uppercase tracking-tighter">No Projects Found in the Vault</p>
               <p className="text-gray-700 text-xs mt-2 uppercase font-bold tracking-widest">Verify MongoDB Collection for: {userEmail}</p>
            </div>
          )}
        </div>

        {/* --- MODAL --- */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl">
              <h2 className="text-4xl font-black italic mb-8 tracking-tighter">INITIALIZE</h2>
              <form onSubmit={handleCreate} className="space-y-5">
                <input 
                  type="text" 
                  placeholder="Project Identity" 
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none font-bold text-white"
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                  >
                    <option value="Dev" className="bg-[#0f172a]">Dev</option>
                    <option value="Design" className="bg-[#0f172a]">Design</option>
                    <option value="Marketing" className="bg-[#0f172a]">Marketing</option>
                  </select>
                  <input 
                    type="number" 
                    placeholder="Total Tasks" 
                    className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none font-bold"
                    onChange={(e) => setNewProject({...newProject, tasks: e.target.value})}
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 py-5 mt-4 rounded-2xl font-black text-xl italic shadow-xl transition-all">
                  LAUNCH PROJECT
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full border-t border-white/5 bg-[#020617] py-16 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 p-1 rounded-md"><Layout size={16} /></div>
              <span className="text-xl font-black italic tracking-tighter">TASKVAULT</span>
            </div>
          </div>
          <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.5em]">2026 INTERNAL NETWORK</p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectsPage;