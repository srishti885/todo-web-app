import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Heart, Code2, Globe, Rocket, ArrowLeft, 
  ShieldCheck, Layers, Layout, Zap, Cpu, Terminal,
  CpuIcon, Database, Blocks
} from 'lucide-react';

const AboutPage = ({ onBack }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome to TaskFlow, where every node turns into progress.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md hover:bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 transition-all font-black group text-[10px] uppercase tracking-widest shadow-2xl"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Portal
      </button>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-2xl mb-10 border border-white/10 shadow-inner">
            <Terminal size={14} className="text-blue-400" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-blue-200">System.Initialize(TaskFlow)</span>
          </div>
          
          <h1 className="text-6xl md:text-[120px] font-black italic tracking-tighter leading-none mb-10 uppercase">
            Future of <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-purple-500">Workflows.</span>
          </h1>

          <div className="h-8 mb-12">
             <p className="text-xl md:text-2xl font-bold text-gray-400 italic">
               {typedText}<span className="animate-ping">|</span>
             </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid - Glassmorphism */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Box 1: SaaS Architecture */}
          <div className="md:col-span-2 group relative p-1 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full bg-[#020617]/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 flex flex-col justify-between">
              <div>
                <Layers className="text-blue-400 mb-6" size={32} />
                <h2 className="text-4xl font-black italic uppercase mb-6 tracking-tighter">SaaS Style Core</h2>
                <p className="text-gray-400 font-bold leading-relaxed text-lg">
                  TaskFlow is architected as a modern SaaS platform where every user commands a personalized encrypted workspace. 
                  Forget static data—our system manages dynamic priorities, statuses, and live-tracked deadlines through a high-performance backend.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-blue-300">Scalable</div>
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-purple-300">Dynamic</div>
              </div>
            </div>
          </div>

          {/* Box 2: Secure Login */}
          <div className="group relative p-1 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.01]">
            <div className="relative h-full bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center justify-center">
              <ShieldCheck size={60} className="text-emerald-400 mb-6 animate-pulse" />
              <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">Encrypted Login</h3>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
                Powered by Firebase Auth for military-grade email verification and session security.
              </p>
            </div>
          </div>

          {/* Box 3: MERN Stack */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
            {[
              { icon: <Database />, title: "MongoDB", desc: "NoSQL Scaling" },
              { icon: <Blocks />, title: "Express.js", desc: "Robust API" },
              { icon: <CpuIcon />, title: "Node.js", desc: "Runtime Speed" },
              { icon: <Layout />, title: "React.js", desc: "Modern UI" }
            ].map((tech, idx) => (
              <div key={idx} className="bg-white/[0.03] hover:bg-white/[0.08] p-8 rounded-3xl border border-white/5 transition-all group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {tech.icon}
                </div>
                <div className="text-blue-400 mb-4">{tech.icon}</div>
                <h4 className="text-lg font-black italic uppercase tracking-tighter">{tech.title}</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
             <div className="bg-blue-600/20 p-4 w-fit rounded-2xl border border-blue-500/30 mb-8">
               <Zap className="text-blue-400" />
             </div>
             <h2 className="text-5xl font-black italic uppercase mb-8 tracking-tighter leading-tight">
               Turning Plans into <br /> 
               <span className="text-blue-500">Actual Progress.</span>
             </h2>
             <p className="text-gray-400 font-bold leading-relaxed text-xl italic">
               Clean UI/UX isn't a luxury, it's a necessity. We focus on modular architecture and maintainable code 
               so you experience a smooth interface and a reliable system. Whether managing personal goals or 
               complex workflows, TaskFlow is your reliable engine.
             </p>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[4rem] border border-white/10 flex items-center justify-center backdrop-blur-3xl overflow-hidden group shadow-[0_0_50px_rgba(37,99,235,0.1)]">
               <Rocket size={100} className="text-white/20 group-hover:scale-125 group-hover:-translate-y-8 transition-all duration-700 ease-in-out" />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
               {/* Decorative Lines */}
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 rotate-45"></div>
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -rotate-45"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Marquee */}
      <div className="py-20 bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <div className="flex gap-20 items-center justify-center whitespace-nowrap opacity-30">
           {["MERN STACK", "FIREBASE SECURE", "GLASSMORPHISM", "TAILWIND CSS", "LUCIDE ICONS"].map((text, i) => (
             <span key={i} className="text-4xl font-black italic tracking-[0.2em]">{text}</span>
           ))}
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="py-32 text-center relative">
          <div className="flex items-center justify-center gap-4 text-gray-600 mb-8">
            <div className="h-[1px] w-12 bg-gray-800"></div>
            <Globe size={18} />
            <span className="font-bold tracking-[0.3em] text-[10px] uppercase">Architected for Scalability</span>
            <div className="h-[1px] w-12 bg-gray-800"></div>
          </div>
          <p className="text-3xl font-black italic tracking-tighter uppercase mb-2">
            Crafted with Precision by 
          </p>
          <p className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase">
            Srishti Goenka
          </p>
          <div className="mt-12 inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-600 uppercase">
            <Heart size={12} className="text-red-500 animate-bounce" /> Version 4.2.0 Stable Node
          </div>
      </footer>
    </div>
  );
};

export default AboutPage;