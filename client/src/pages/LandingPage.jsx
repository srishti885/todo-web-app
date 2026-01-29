import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  Sparkles, ArrowRight, LayoutDashboard, X, Mail, Lock, 
  Zap, ShieldCheck, Globe, ChevronRight, Github, Twitter,
  Eye, EyeOff // Added for password visibility
} from 'lucide-react';

const LandingPage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false); 
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for eye toggle

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#020617] relative overflow-hidden selection:bg-blue-500/30 font-sans flex flex-col">
      
      {/* --- LIVE ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- AUTH MODAL --- */}
      {showAuthForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0f172a]/80 w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-500 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 blur-[60px]"></div>
            
            <button onClick={() => setShowAuthForm(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-10 hover:rotate-90 duration-300">
              <X size={24} />
            </button>
            
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic animate-pulse">
                {isLogin ? 'Access' : 'Deploy'}
              </h2>
              <p className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mt-2">Protocol Interface v4.0.2</p>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-8 relative z-10">
              <div className="relative flex items-center group">
                <Mail className="absolute left-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="IDENTIFIER" 
                  required
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm tracking-widest" 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="ENCRYPTION KEY" 
                  required
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 pr-12 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm tracking-widest" 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center gap-2 group/btn">
                {isLogin ? 'Establish Link' : 'Initialize Node'} 
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="text-center relative z-10">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                {isLogin ? "Generate New Credentials" : "Return to Access Portal"}
              </button>
            </div>

            <div className="relative py-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] font-black text-gray-600 uppercase tracking-widest"><span className="bg-[#111827] px-4 italic">Biometric Alternative</span></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98] uppercase tracking-tighter shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa_google_main_logo.svg" className="w-5 h-5" alt="G" />
              Sync with Google
            </button>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full sticky top-0 z-50 backdrop-blur-md bg-[#020617]/50 border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.5)] group-hover:rotate-180 transition-transform duration-700">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">TaskVault</span>
        </div>
        
        <div className="flex items-center gap-8 font-black uppercase tracking-widest text-[10px]">
          <button onClick={() => {setIsLogin(true); setShowAuthForm(true);}} className="text-gray-500 hover:text-white transition-colors tracking-[0.2em]">Access Portal</button>
          <button onClick={() => {setIsLogin(false); setShowAuthForm(true);}} className="bg-white text-black px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 border border-transparent hover:border-white/20">
            Initialize
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 text-center relative py-20 z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-8 border border-blue-500/20 animate-bounce-slow">
          <ShieldCheck size={14} className="text-blue-500" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-blue-400">Zero-Knowledge Task Architecture</span>
        </div>
        
        <h1 className="text-7xl md:text-[120px] font-black tracking-tighter mb-8 leading-[0.8] uppercase italic drop-shadow-2xl">
          Master Your <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-800 animate-shimmer-text bg-[length:200%_auto]">Workflow</span>
        </h1>
        
        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mb-12 font-bold uppercase tracking-[0.2em] leading-relaxed opacity-0 animate-fade-in-up">
          The ultimate engine for high-performance teams. <br />
          Deploy projects, analyze data-nodes, and scale at the speed of light.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 opacity-0 animate-fade-in-up animation-delay-500">
          <button 
            onClick={() => setShowAuthForm(true)}
            className="group relative bg-blue-600 text-white px-12 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all hover:-translate-y-2 active:scale-95 overflow-hidden border border-white/10"
          >
            <span className="relative z-10 uppercase italic">Get Started</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={24} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
          </button>
        </div>

        <div className="hidden lg:flex absolute bottom-10 left-0 right-0 justify-between w-full px-20 opacity-30">
            <div className="flex items-center gap-4 group cursor-help transition-all hover:opacity-100 hover:scale-110">
              <Globe size={40} className="text-blue-500 animate-spin-slow" />
              <div className="text-left font-black uppercase text-[10px] tracking-widest">Global<br/>Protocol</div>
            </div>
            <div className="flex items-center gap-4 group cursor-help transition-all hover:opacity-100 hover:scale-110">
              <Zap size={40} className="text-yellow-500 animate-pulse" />
              <div className="text-left font-black uppercase text-[10px] tracking-widest">Instant<br/>Execution</div>
            </div>
            <div className="flex items-center gap-4 group cursor-help transition-all hover:opacity-100 hover:scale-110">
              <ShieldCheck size={40} className="text-green-500 animate-float" />
              <div className="text-left font-black uppercase text-[10px] tracking-widest">Distributed<br/>Vault</div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#020617]/80 backdrop-blur-md py-16 w-full mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start group">
            <div className="flex items-center gap-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <Zap size={18} className="text-blue-500" />
              <span className="font-black tracking-tighter text-xl uppercase italic">TaskVault</span>
            </div>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">Next-Gen Productivity Framework © 2026</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="px-8 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
                Architected by <span className="text-blue-500 ml-1 hover:text-blue-400 transition-colors">S. Goenka</span>
              </p>
            </div>
            <div className="flex gap-6 mt-6 grayscale opacity-40 hover:grayscale-0 transition-all">
                <Github size={16} className="hover:text-white cursor-pointer" />
                <Twitter size={16} className="hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic animate-pulse">All Systems Operational</p>
            <p className="text-[8px] text-blue-500 font-bold uppercase mt-1 tracking-widest">Secure Cloud Infrastructure</p>
          </div>
        </div>
      </footer>

      {/* --- CUSTOM LIVE ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        
        @keyframes shimmer-text {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-shimmer-text { animation: shimmer-text 3s linear infinite; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}} />
    </div>
  );
};

export default LandingPage;