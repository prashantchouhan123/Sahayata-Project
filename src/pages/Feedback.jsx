import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { analyzeFeedback } from '../services/gemini';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Loader2, CheckCircle, MessageSquare, ChevronLeft, Mic, MicOff } from 'lucide-react';

const Feedback = () => {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  
  const [manualId, setManualId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Transcript ko live handle karne ke liye
  useEffect(() => {
    if (transcript) {
      setFeedback((prev) => prev + " " + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleMicToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      if (!browserSupportsSpeechRecognition) {
        alert("Browser speech support missing!");
        return;
      }
      // ✅ FIX: added continuous: true so it doesn't stop automatically
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: 'hi-IN' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalId = urlId || manualId;
    if (!finalId) return alert("Reference ID missing!");
    
    setLoading(true);
    try {
      const decision = await analyzeFeedback(feedback);
      const { data, error } = await supabase
        .from('reports')
        .update({
          feedback_text: feedback,
          verification_status: decision === 'REOPEN' ? 'reopened' : 'verified',
          status: decision === 'REOPEN' ? 'Pending' : 'Closed'
        })
        .eq('id', finalId)
        .select();

      if (error || data.length === 0) throw new Error("Update failed");
      setSubmitted(true);
    } catch (err) {
      alert("Error processing verification.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <CheckCircle size={48} className="text-green-500 mb-3" />
        <h1 className="text-lg font-bold text-slate-900 uppercase">Process Completed</h1>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-[#1e293b] text-white text-[10px] font-bold uppercase rounded-md tracking-wider">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans border-t-4 border-[#337ab7]">
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="flex items-center px-6 py-3 border-b border-slate-100 bg-white">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-all">
            <ChevronLeft size={14}/> BACK
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#1e293b] flex items-baseline gap-1 tracking-tight">
              Sahayata Portal<span className="text-[#337ab7] text-[10px] font-black italic uppercase tracking-tighter">AI</span>
            </h1>
            <div className="flex items-center gap-3 mt-5">
              <div className="p-2.5 bg-blue-50/50 rounded-lg text-[#337ab7] border border-blue-100/50">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">Citizen Verification</h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1">Node: Bhopal_Admin_01</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Reference ID</label>
              <input
                disabled={!!urlId}
                type="text"
                value={urlId || manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Reference ID input"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-bold text-slate-600 focus:bg-white focus:border-[#337ab7] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Work Status / Experience</label>
              <div className="relative">
                <textarea
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Yahan apna feedback likhein..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#337ab7] focus:bg-white transition-all resize-none text-[13px] font-medium text-slate-600 leading-normal"
                />
                
                <div className="absolute bottom-3 right-3 flex flex-col items-center">
                  <span className={`text-[7px] font-black uppercase tracking-tighter mb-1 transition-colors ${listening ? 'text-blue-500' : 'text-slate-300'}`}>
                    {listening ? 'STOP' : 'VOICE'}
                  </span>
                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={`p-2 rounded-md border transition-all ${
                      listening 
                        ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
                        : 'bg-white border-slate-200 text-slate-400 hover:text-[#337ab7]'
                    }`}
                  >
                    {listening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !feedback}
              className="w-full bg-[#1e293b] hover:bg-[#337ab7] text-white py-3.5 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-4 shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <>Process Verification →</>}
            </button>
          </form>

          <footer className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em]">Admin Gateway • Bhopal</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Feedback;