import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { analyzeFeedback } from '../services/gemini'; 
import { Loader2, CheckCircle, Send, MessageSquare, Hash, ChevronLeft } from 'lucide-react';

const Feedback = () => {
  const { id: urlId } = useParams(); // URL se ID (agar link se aaya ho)
  const navigate = useNavigate();
  
  // States
  const [manualId, setManualId] = useState(''); // Sidebar se aane par Ref ID ke liye
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final ID check (URL wali ya Manual wali)
    const finalId = urlId || manualId;
    
    if (!finalId) {
      alert("Bhai, Reference ID daalna zaroori hai!");
      return;
    }

    setLoading(true);

    try {
      // 1. Gemini AI Analysis
      const decision = await analyzeFeedback(feedback);

      // 2. AI Logic
      const finalStatus = decision === 'REOPEN' ? 'Pending' : 'Closed';
      const vStatus = decision === 'REOPEN' ? 'reopened' : 'verified';

      // 3. Supabase Update
      const { data, error } = await supabase
        .from('reports')
        .update({
          feedback_text: feedback,
          verification_status: vStatus,
          status: finalStatus
        })
        .eq('id', finalId)
        .select();

      if (error) throw error;

      // Check if ID actually existed
      if (data.length === 0) {
        alert("Bhai, ye Ref ID sahi nahi hai. Check karke wapis daalo.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Kuch galat hua, dubara koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center animate-in fade-in duration-500">
        <div className="bg-green-50 p-6 rounded-full mb-4">
          <CheckCircle size={64} className="text-green-500 animate-bounce" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Feedback Received!</h1>
        <p className="text-slate-500 mt-2 font-medium">Sahayata AI has processed your response. <br/> Status: <span className="text-[#337ab7] font-bold">Synchronized</span></p>
        <button onClick={() => navigate('/')} className="mt-8 text-[11px] font-bold text-[#337ab7] uppercase border-b-2 border-[#337ab7] pb-1">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-['Open_Sans']">
      <div className="w-full max-w-md bg-white shadow-2xl p-8 border-t-8 border-[#337ab7]">
        
        {/* Navigation Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#337ab7] mb-6 uppercase transition-all">
          <ChevronLeft size={14}/> Back to Report
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-50 text-[#337ab7]">
            <MessageSquare size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Citizen Verification</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Node: Bhopal_Admin_01</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🆕 ID INPUT FIELD (Agar URL mein ID nahi hai tabhi dikhega) */}
          {!urlId && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Reference ID (#BHO-XXXX)
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="Enter ID (e.g., 102)"
                  className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#337ab7] outline-none transition-all text-sm font-bold text-slate-700 pl-11"
                />
                <Hash size={18} className="absolute left-4 top-4 text-slate-300" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Work Status / Experience
            </label>
            <textarea
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Kya kaam sahi se hua? (e.g., 'Haan, kachra uth gaya' ya 'Nahi, abhi bhi ganda hai')"
              className="w-full h-36 p-5 bg-slate-50 border border-slate-200 focus:border-[#337ab7] outline-none transition-all resize-none text-sm font-medium text-slate-700 italic"
            />
          </div>

          <div className="p-4 bg-amber-50 border-l-4 border-amber-400 mb-4">
            <p className="text-[11px] text-amber-700 font-bold italic leading-relaxed">
              "Note: AI will analyze your feedback to determine if the complaint needs to be re-opened."
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !feedback}
            className="w-full bg-[#1e293b] hover:bg-[#337ab7] text-white py-4 font-black text-[11px] uppercase tracking-[0.3em] transition-all flex justify-center items-center gap-3 disabled:opacity-50 shadow-lg active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Process Verification</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;