import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import { 
  Camera, ShieldCheck, Mail, MapPin, 
  Calendar, Award, Zap, Star, 
  Edit3, Share2, Hexagon, Download, X, Check, Trash2, Upload
} from 'lucide-react';

const ProfilePage = ({ userEmail }) => {
  const [avatar, setAvatar] = useState(localStorage.getItem(`avatar_${userEmail}`) || null);
  const [loading, setLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [userStats, setUserStats] = useState({
    rank: '#0',
    streak: '0 Days',
    badges: '0',
    progressData: { architect: 0, executioner: 0, king: 0 }
  });

  // ---  MERN DATA FETCH ---
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userEmail) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/projects?email=${userEmail}`);
        const projects = response.data;
        const totalCompleted = projects.reduce((acc, p) => acc + (p.completed || 0), 0);
        const totalProjects = projects.length;
        const avgProgress = totalProjects > 0 
          ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects) 
          : 0;

        setUserStats({
          rank: `#${1000 - totalCompleted}`, 
          streak: `${totalProjects * 2} Days`, 
          badges: totalCompleted > 5 ? "12" : "04",
          progressData: {
            architect: avgProgress,
            executioner: Math.min(100, totalCompleted * 5),
            king: totalProjects > 0 ? 90 : 0
          }
        });
        setLoading(false);
      } catch (err) {
        console.error("MERN Profile Error:", err);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userEmail]);

  // ---  LIVE CAMERA & SAVE LOGIC ---
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera Access Denied");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      savePhoto(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const savePhoto = (image) => {
    setAvatar(image);
    localStorage.setItem(`avatar_${userEmail}`, image); // Persistence logic
  };

  const deletePhoto = () => {
    setAvatar(null);
    localStorage.removeItem(`avatar_${userEmail}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => savePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const identityData = { operator: userEmail.split('@')[0].toUpperCase(), email: userEmail, stats: userStats };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(identityData, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `identity_${userEmail.split('@')[0]}.json`);
    link.click();
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-black italic tracking-widest animate-pulse">AUTHORIZING IDENTITY...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-top-10 duration-1000 pb-20 p-4 md:p-8">
      
      <div className="mb-16">
        <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-r from-white via-gray-400 to-gray-700 bg-clip-text text-transparent">
          IDENTITY
        </h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-500" /> Authorized System Access
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group bg-[#0f172a] border border-white/10 rounded-[4rem] p-10 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px] rounded-full"></div>
            
            <div className="relative flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white/5 bg-white/5 shadow-2xl transition-transform duration-500">
                  {isCameraActive ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                  ) : avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-[#0f172a]">
                      <UserPlaceholder />
                    </div>
                  )}
                </div>

                {/* --- DUAL ACTION BUTTONS --- */}
                <div className="absolute -bottom-4 -right-4 flex flex-col gap-2">
                  {!isCameraActive ? (
                    <>
                      <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl shadow-xl border-4 border-[#0f172a] transition-all active:scale-90">
                        <Camera size={20} className="text-white" />
                      </button>
                      <label className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl shadow-xl border-4 border-[#0f172a] cursor-pointer transition-all active:scale-90">
                        <Upload size={20} className="text-white" />
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                      {avatar && (
                        <button onClick={deletePhoto} className="bg-red-600 hover:bg-red-500 p-4 rounded-2xl shadow-xl border-4 border-[#0f172a] transition-all active:scale-90">
                          <Trash2 size={20} className="text-white" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={capturePhoto} className="bg-emerald-500 p-4 rounded-2xl border-4 border-[#0f172a] shadow-xl"><Check size={20}/></button>
                      <button onClick={stopCamera} className="bg-red-500 p-4 rounded-2xl border-4 border-[#0f172a] shadow-xl"><X size={20}/></button>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-black italic tracking-tighter mb-2">OPERATOR</h2>
              <span className="text-[10px] font-black bg-white/5 px-4 py-1 rounded-full text-blue-400 border border-white/10 uppercase tracking-[0.2em]">
                Verified Node
              </span>
            </div>
            
            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
              <InfoRow icon={<Mail size={14}/>} label="Email" value={userEmail} />
              <InfoRow icon={<MapPin size={14}/>} label="Location" value="Internal Server" />
              <InfoRow icon={<Calendar size={14}/>} label="Joined" value="Jan 2026" />
            </div>
          </div>

          <button onClick={handleExport} className="w-full bg-white/5 border border-white/10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
            <Share2 size={16} /> Export Identity
          </button>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProfileStat label="Global Rank" value={userStats.rank} icon={<Star className="text-yellow-500" />} />
            <ProfileStat label="Active Streak" value={userStats.streak} icon={<Zap className="text-blue-500" />} />
            <ProfileStat label="Badges" value={userStats.badges} icon={<Award className="text-purple-500" />} />
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic">ACHIEVEMENTS</h3>
              <button className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest">View All</button>
            </div>
            <div className="space-y-8">
              <AchievementItem title="System Architect" progress={userStats.progressData.architect} />
              <AchievementItem title="Task Executioner" progress={userStats.progressData.executioner} />
              <AchievementItem title="Consistency King" progress={userStats.progressData.king} />
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// --- COMPONENTS ---
const UserPlaceholder = () => (
  <div className="flex flex-col items-center text-gray-600">
    <div className="w-12 h-1 bg-gray-700 rounded-full mb-2"></div>
    <div className="w-20 h-1 bg-gray-700 rounded-full"></div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-3 text-gray-500">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-sm font-bold italic text-white group-hover:text-blue-400 transition-colors">{value}</span>
  </div>
);

const ProfileStat = ({ label, value, icon }) => (
  <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-all">
    <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center mb-4">{icon}</div>
    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black italic tracking-tighter text-white">{value}</p>
  </div>
);

const AchievementItem = ({ title, progress }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <h4 className="text-xs font-black italic text-gray-400 uppercase tracking-widest">{title}</h4>
      <span className="text-[10px] font-black text-blue-500">{progress}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default ProfilePage;