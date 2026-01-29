import React, { useState, useRef } from 'react';
import { Mail, MapPin, Phone, Send, ArrowLeft, MessageSquare, ShieldCheck, Zap, Globe, ExternalLink, Github, Linkedin, Twitter, Instagram, Cpu } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactPage = ({ onBack }) => {
  // form reference aur state management
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // email bhejne ka function logic
  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // emailjs integration setup
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      formRef.current, 
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
        setSent(true);
        setLoading(false);
        // success ke 5 second baad status reset
        setTimeout(() => setSent(false), 5000);
        formRef.current.reset();
    }, (error) => {
        console.log(error.text);
        setLoading(false);
        alert("Transmission Failed! Please check your connection.");
    });
  };

  return (
    // main container - scrollbar hide karne ke liye custom css
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden relative pb-20 no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* background glow effects (blue aur purple blobs) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto font-sans">
        
        {/* back navigation button */}
        <button 
          onClick={onBack} 
          className="group flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-16 shadow-2xl"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform text-blue-400" /> 
          Return to Vault
        </button>

        {/* Updated Grid: lg:grid-cols-[1fr_1.2fr] aur gap-12 overlap fix karne ke liye */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          
          {/* left section: info aur headings */}
          <div className="animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6">
              <Zap size={14} className="text-blue-400 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Live Communication Node</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter mb-8 leading-[0.85] uppercase">
              Establish <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600">Contact.</span>
            </h1>
            
            <p className="text-gray-400 font-bold italic text-xl mb-12 max-w-lg leading-relaxed">
              Have a directive or a mission for us? Srishti Goenka and the system architects are ready to synchronize.
            </p>

            <div className="space-y-8">
              <ContactInfo icon={<Mail className="text-blue-400" />} label="Data Stream" value="srishti@taskvault.com" />
              
              {/* location toggle map logic */}
              <div onClick={() => setShowMap(!showMap)} className="relative overflow-hidden group">
                 <ContactInfo 
                    icon={<MapPin className="text-purple-400" />} 
                    label="HQ Location" 
                    value="India, Digital Space" 
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 mr-4">
                    <ExternalLink size={16} />
                  </div>
              </div>

              <ContactInfo icon={<Globe className="text-emerald-400" />} label="Network" value="www.taskvault.io" />
            </div>

            {/* google map frame logic */}
            {showMap && (
              <div className="mt-8 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in duration-300 bg-white/5 p-2 backdrop-blur-xl">
                <iframe 
                  title="HQ Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.527376043148!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1625612345678"
                  width="100%" 
                  height="250" 
                  className="rounded-[2rem] opacity-70 grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

          {/* right section: card - translate hata diya hai overlap rokne ke liye */}
          <div className="relative group animate-in zoom-in duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#020617]/60 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <MessageSquare className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Transmission</h2>
                </div>
                <ShieldCheck className="text-gray-600" size={24} />
              </div>

              {/* form transmission fields */}
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Identity</label>
                  <input 
                    name="user_name"
                    required
                    type="text" 
                    placeholder="ENTER YOUR NAME" 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-sm tracking-wider placeholder:text-gray-700" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Frequency (Email)</label>
                  <input 
                    name="user_email"
                    required
                    type="email" 
                    placeholder="YOUR@EMAIL.COM" 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-sm tracking-wider placeholder:text-gray-700" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">The Directive</label>
                  <textarea 
                    name="message"
                    required
                    rows="4" 
                    placeholder="WHAT IS THE MISSION?" 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-sm tracking-wider placeholder:text-gray-700 resize-none"
                  ></textarea>
                </div>

                {/* status based button (loading, sent, default) */}
                <button 
                  disabled={loading}
                  className={`w-full group relative flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl italic transition-all active:scale-95 overflow-hidden ${
                    sent ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
                  } shadow-[0_10px_30px_rgba(37,99,235,0.3)]`}
                >
                  {loading ? (
                    <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : sent ? (
                    <>DATA TRANSMITTED <ShieldCheck size={24} /></>
                  ) : (
                    <>
                      SEND ENQUIRY 
                      <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* social links footer - frequency nodes */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-8 bg-white/5 px-6 py-2 rounded-full border border-white/10">
              <Cpu size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Social Frequency Nodes</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: <Github />, label: 'Github', color: 'hover:text-white hover:bg-white/10' },
                { icon: <Linkedin />, label: 'LinkedIn', color: 'hover:text-blue-400 hover:bg-blue-400/10' },
                { icon: <Twitter />, label: 'Twitter', color: 'hover:text-sky-400 hover:bg-sky-400/10' },
                { icon: <Instagram />, label: 'Instagram', color: 'hover:text-pink-500 hover:bg-pink-500/10' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className={`p-5 rounded-3xl bg-white/[0.03] border border-white/5 transition-all duration-500 group flex flex-col items-center gap-3 w-28 ${social.color}`}
                >
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(social.icon, { size: 24 })}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest">{social.label}</span>
                </a>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// contact row helper component
const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 group cursor-pointer">
    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:-rotate-12 transition-all duration-300 shadow-xl">
      {React.cloneElement(icon, { size: 24, className: "group-hover:text-white transition-colors" })}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] leading-none mb-2">{label}</p>
      <p className="text-xl font-black italic tracking-tight group-hover:text-blue-400 transition-colors uppercase">{value}</p>
    </div>
  </div>
);

export default ContactPage;