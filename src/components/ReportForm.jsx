import React, { useState } from 'react';
import { Mic, MicOff, Send, MessageSquare, ShieldCheck, Info, Radio, Zap } from 'lucide-react';

const VoiceReport = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const userName = "Prashant Chouhan";

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans text-slate-900 antialiased">
      
      {/* 1. SIDEBAR - Consistency with Dashboard */}
      <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-10 space-y-12 h-full z-20">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
            <ShieldCheck className="text-white" size={24} />
        </div>
        <nav className="flex-1 space-y-8 text-slate-400">
            <div className="p-3 hover:text-blue-600 transition-all cursor-pointer"><LayoutGrid size={22} /></div>
            <div className="p-3 text-blue-600 bg-blue-50 rounded-xl cursor-pointer transition-all"><Mic size={22} /></div>
            <div className="p-3 hover:text-blue-600 transition-all cursor-pointer"><MessageSquare size={22} /></div>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-12 overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16 pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Radio size={14} className="text-red-500 animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">AI Voice Processing Engine</p>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">Voice <span className="font-light text-slate-400">Reporter</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{userName}</p>
             <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white text-sm font-bold">PC</div>
          </div>
        </div>

        {/* --- CENTRAL INTERACTIVE SECTION --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto w-full items-center">
          
          {/* LEFT: VOICE INPUT (Professional Mic UI) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white rounded-[3rem] p-16 shadow-sm border border-slate-100 relative overflow-hidden group">
            {/* Background Decorative Blur */}
            <div className={`absolute inset-0 bg-blue-500/5 transition-opacity duration-700 ${isListening ? 'opacity-100' : 'opacity-0'}`}></div>
            
            {/* Sound Wave Animation (When Listening) */}
            <div className={`flex items-end gap-1.5 h-12 mb-12 ${isListening ? 'opacity-100' : 'opacity-20 transition-opacity'}`}>
                {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9].map((h, i) => (
                    <div 
                        key={i} 
                        className={`w-1.5 bg-blue-600 rounded-full ${isListening ? 'animate-bounce' : ''}`} 
                        style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                ))}
            </div>

            {/* MIC BUTTON */}
            <button 
                onClick={() => setIsListening(!isListening)}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isListening ? 'bg-red-500 scale-110 shadow-red-200 ring-8 ring-red-50' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100 ring-8 ring-blue-50'}`}
            >
                {isListening ? <MicOff size={44} className="text-white" /> : <Mic size={44} className="text-white" />}
            </button>

            <div className="mt-10 text-center relative z-10">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {isListening ? "Listening to your report..." : "Tap to Speak"}
                </h3>
                <p className="text-sm font-medium text-slate-400 mt-2">Speak clearly about any civic grievance in Bhopal</p>
            </div>
          </div>

          {/* RIGHT: TRANSCRIPT & INFO CARDS (Page Filling Logic) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Real-time Transcript Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex-1 min-h-[250px] flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <MessageSquare size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Live Transcript</span>
                </div>
                <div className="flex-1 italic text-slate-400 text-lg leading-relaxed">
                    {transcript || "Your speech will appear here in real-time..."}
                </div>
                <button className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                    <Send size={16} /> Submit Grievance
                </button>
            </div>

            {/* Pro-Touch: Info Cards (To fill space) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50">
                    <Zap className="text-emerald-600 mb-3" size={20} />
                    <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">AI Speed</p>
                    <p className="text-xs font-semibold text-slate-600 leading-snug">Processing report in 0.8s</p>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                    <Info className="text-blue-600 mb-3" size={20} />
                    <p className="text-[10px] font-bold text-blue-700 uppercase mb-1">Tip</p>
                    <p className="text-xs font-semibold text-slate-600 leading-snug">Mention specific landmarks.</p>
                </div>
            </div>

          </div>
        </div>

        {/* BOTTOM HELP FOOTER */}
        <div className="mt-auto pt-8 flex justify-center gap-12 text-slate-400 border-t border-slate-100">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Multi-language Support</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Bhopal Geofencing Active</span>
            </div>
        </div>

      </main>
    </div>
  );
};

// Placeholder LayoutGrid for icons (if not imported elsewhere)
const LayoutGrid = ({size, className}) => <div className={className} style={{width:size, height:size, border:'2px solid currentColor', borderRadius:'4px'}}></div>

export default VoiceReport;