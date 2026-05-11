import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Cpu, ShieldCheck, Languages, Hexagon } from 'lucide-react';
// ✅ Supabase Client Import
import { supabase } from '../supabaseClient'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('English');

  const translations = {
    English: {
      title: "Sign in to Portal",
      subtitle: "Enter your credentials to access the Bhopal Node.",
      emailLabel: "Email Address",
      passLabel: "Password",
      btn: "Sign In",
      google: "Continue with Google",
      brandSub: "AI-powered citizen grievance classification system for smart city governance and efficient resolution."
    },
    Hindi: {
      title: "पोर्टल में साइन इन करें",
      subtitle: "भोपाल नोड तक पहुंचने के लिए अपना विवरण दर्ज करें।",
      emailLabel: "ईमेल पता",
      passLabel: "पासवर्ड",
      btn: "साइन इन करें",
      google: "गूगल के साथ जारी रखें",
      brandSub: "स्मार्ट सिटी शासन और कुशल समाधान के लिए एआई-आधारित नागरिक शिकायत वर्गीकरण प्रणाली।"
    }
  };

  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    localStorage.clear();
    localStorage.setItem('activePage', 'report');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data?.user) navigate('/report');
    } catch (err) { 
      setError(err.message || 'Invalid credentials'); 
    } finally { 
      setLoading(false); 
    }
  };

  if (showSplash) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center animate-pulse">
           <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
              <Cpu size={24} className="text-[#337ab7]" />
           </div>
           <span className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Loading System</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* 🎨 DECENT MESH GRADIENT ANIMATION */}
      <style>{`
        @keyframes mesh-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .mesh-bg {
          background: linear-gradient(-45deg, #214c71, #337ab7, #1e3a8a, #2563eb);
          background-size: 400% 400%;
          animation: mesh-move 15s ease infinite;
        }
        .glass-overlay {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(1px);
        }
      `}</style>

      {/* Grid container expanded to fill 100% of the screen */}
      <div className="w-full h-full grid md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[1fr_1.1fr]">
        
        {/* Left Side: Professional Brand Panel (Now Full Height) */}
        <div className="hidden md:flex mesh-bg p-20 flex-col justify-between relative text-white h-full">
          <div className="absolute inset-0 glass-overlay"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
               <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                  <Hexagon size={24} className="fill-white/10" />
               </div>
               <span className="text-sm font-black tracking-[0.3em] uppercase opacity-90">Sahayata AI v2</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight mb-8 leading-[1.1]">
               Streamlining <br/>
               <span className="text-blue-200">Urban Governance</span>
            </h1>
            <p className="text-blue-50/70 text-base leading-relaxed max-w-md italic">
               "{t.brandSub}"
            </p>
          </div>

          <div className="relative z-10">
             <div className="inline-flex items-center gap-5 py-4 px-6 bg-black/10 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#337ab7] bg-slate-400" />)}
                </div>
                <p className="text-xs font-bold text-blue-100/80 uppercase tracking-widest">Trusted by Bhopal Administration</p>
             </div>
          </div>
        </div>

        {/* Right Side: Clean Form (Now Full Height) */}
        <div className="h-full flex flex-col justify-center items-center relative bg-white px-8">
          
          {/* Language Switcher */}
          <div className="absolute top-10 right-10">
             <button 
               onClick={() => setLang(lang === 'English' ? 'Hindi' : 'English')}
               className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#337ab7] transition-all border border-slate-100 px-4 py-2 rounded-full hover:bg-slate-50"
             >
               <Languages size={14} />
               {lang === 'English' ? 'HINDI' : 'ENGLISH'}
             </button>
          </div>

          <div className="w-full max-w-[380px]">
            <header className="mb-12">
               <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{t.title}</h3>
               <p className="text-sm text-slate-400 font-medium">{t.subtitle}</p>
            </header>
            
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-3">
                 <ShieldCheck size={18} />
                 {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.emailLabel}</label>
                <div className="flex items-center gap-4 px-5 bg-slate-50 border border-slate-100 rounded-xl focus-within:border-[#337ab7] focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-900/5 transition-all duration-300">
                  <Mail size={18} className="text-slate-300" />
                  <input 
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full bg-transparent py-4 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-200" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.passLabel}</label>
                <div className="flex items-center gap-4 px-5 bg-slate-50 border border-slate-100 rounded-xl focus-within:border-[#337ab7] focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-900/5 transition-all duration-300">
                  <Lock size={18} className="text-slate-300" />
                  <input 
                    type="password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-transparent py-4 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-200" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1e293b] hover:bg-[#337ab7] text-white py-4.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all mt-4 flex justify-center items-center gap-3 shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>{t.btn} <ArrowRight size={20} /></>
                )}
              </button>
            </form>

            <div className="relative my-10">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
               <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-300 bg-white px-4 tracking-[0.3em]">Identity Gateway</div>
            </div>

            <button 
              type="button"
              className="w-full border border-slate-200 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4" />
              {t.google}
            </button>
          </div>

          <footer className="absolute bottom-10 text-center">
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.5em]">
                Official Administration Gateway • Bhopal
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;