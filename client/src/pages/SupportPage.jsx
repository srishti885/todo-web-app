import React, { useState, useEffect } from 'react';
import { HelpCircle, ShieldCheck, Zap, ArrowLeft, LifeBuoy, ChevronDown, MessageSquare, Headphones, X, Heart, Github } from 'lucide-react';
import axios from 'axios';

const SupportPage = ({ onBack }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', issue: '' });

  useEffect(() => {
    document.body.style.overflow = 'auto';
    const style = document.createElement("style");
    style.innerHTML = `
      ::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const faqs = [
    { 
      q: "Is TaskVault free?", 
      a: "Yes, currently in Srishti's Dev Mode, all features are free to use. No hidden credits required.", 
      icon: <Zap size={20} className="text-yellow-400" /> 
    },
    { 
      q: "Where is my data stored?", 
      a: "Everything is securely locked in our Google Firebase Cloud Vault with multi-layer encryption.", 
      icon: <ShieldCheck size={20} className="text-emerald-400" /> 
    },
    { 
      q: "Need custom features?", 
      a: "Reach out via the Contact page. Our system architects can synchronize custom mission parameters for enterprise solutions.", 
      icon: <LifeBuoy size={20} className="text-blue-400" /> 
    }
  ];

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setTicketLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tickets`, formData);
      if (response.status === 201) {
        alert("Mission Received! Ticket ID: " + response.data._id);
        setFormData({ name: '', email: '', issue: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Transmission Error:", error);
      alert("System Overload: Could not send ticket.");
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-y-auto relative no-scrollbar selection:bg-blue-500/30 flex flex-col">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto font-sans flex-grow w-full">
        {/* Navigation */}
        <button 
          onClick={onBack} 
          className="group flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-16 shadow-2xl"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform text-blue-400" /> 
          Back to Vault
        </button>

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6">
            <Headphones size={14} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Support Terminal Active</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter mb-6 leading-none uppercase">
            Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Center.</span>
          </h1>
          <p className="text-gray-500 font-bold italic text-xl uppercase tracking-widest max-w-2xl mx-auto">
            Operational guidance for system commanders
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className={`cursor-pointer overflow-hidden border transition-all duration-500 rounded-[2rem] ${
                activeIndex === i 
                ? 'bg-white/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl transition-all duration-500 ${activeIndex === i ? 'bg-blue-600 rotate-12' : 'bg-white/5'}`}>
                    {faq.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black italic tracking-tight">{faq.q}</h3>
                </div>
                <ChevronDown 
                  size={24} 
                  className={`text-gray-500 transition-transform duration-500 ${activeIndex === i ? 'rotate-180 text-blue-400' : ''}`} 
                />
              </div>
              <div className={`transition-all duration-500 ease-in-out ${activeIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 pt-0">
                  <div className="h-[1px] w-full bg-white/10 mb-6"></div>
                  <p className="text-gray-400 font-bold italic text-lg leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Card */}
        <div className="mt-24 relative group animate-in zoom-in duration-1000 mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[4rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white/5 border border-white/10 p-12 md:p-16 rounded-[4rem] text-center max-w-4xl mx-auto backdrop-blur-3xl">
            {!showForm ? (
              <>
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl"><MessageSquare className="text-white" size={32} /></div>
                <h2 className="text-4xl md:text-5xl font-black italic mb-6 tracking-tighter uppercase">Still stuck in the void?</h2>
                <button onClick={() => setShowForm(true)} className="group relative bg-white text-black px-16 py-5 rounded-2xl font-black text-xl italic hover:scale-105 transition-all shadow-2xl">
                  <span className="flex items-center gap-3">Initialize Form <LifeBuoy size={20} className="group-hover:rotate-180 transition-all duration-1000" /></span>
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmitTicket} className="max-w-lg mx-auto space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black italic uppercase text-blue-400">Support Directive</h3>
                  <X className="cursor-pointer text-gray-500 hover:text-white" onClick={() => setShowForm(false)} />
                </div>
                <input required type="text" placeholder="COMMANDER NAME" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold italic" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input required type="email" placeholder="RETURN FREQUENCY" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold italic" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <textarea required rows="4" placeholder="DESCRIBE THE SYSTEM ANOMALY..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold italic resize-none" value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})}></textarea>
                <button type="submit" disabled={ticketLoading} className="w-full bg-blue-600 py-4 rounded-xl font-black italic text-lg hover:bg-blue-500 transition-all flex justify-center items-center gap-3">
                  {ticketLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "TRANSMIT DATA"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* --- FOOTER SECTION --- */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">System Architecture</p>
            <p className="text-sm font-bold italic text-white/80 tracking-tight">
              Developed by 
              <span className="text-blue-400 ml-1 hover:text-blue-300 transition-colors cursor-pointer"> SRISHTI</span>
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              © 2026 TaskVault Protocol
            </p>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white">
              <Github size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupportPage;