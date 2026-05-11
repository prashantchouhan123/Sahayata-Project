import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import { 
  Mic, Camera, Loader2, ArrowRight, MapPin, 
  History, Clock, AlertCircle, ChevronLeft, 
  Trash2, MicOff, Image as ImageIcon,
  LayoutDashboard, Navigation, Upload, Smartphone,
  MessageSquare // 🆕 Feedback icon import kiya
} from 'lucide-react';

const ReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    sinceWhen: "",
    problemOrigin: "",
    landmark: ""
  });

  // 🎙️ Voice Input Logic
  const handleVoiceInput = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.Recognition;
    if (!SpeechRecognition) {
      alert("Voice support is not available in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      setFormData({ ...formData, description: event.results[0][0].transcript });
    };
    recognition.start();
  };

  // 📍 AUTO FETCH LOCATION LOGIC
  const handleAutoFetchLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS is not supported by your browser.");
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const address = data.display_name || `${latitude}, ${longitude}`;
        setFormData(prev => ({ ...prev, landmark: address }));
      } catch (err) {
        setFormData(prev => ({ ...prev, landmark: `${latitude}, ${longitude}` }));
      } finally {
        setLocLoading(false);
      }
    }, (error) => {
      alert("Location access denied. Please enable GPS.");
      setLocLoading(false);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.description || !formData.landmark) {
      alert("Bhai, Description aur Landmark dono fill kar!");
      return;
    }

    setLoading(true);
    let uploadedImageUrl = null;

    try {
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('report-images').getPublicUrl(fileName);
        uploadedImageUrl = publicUrl;
      }

      const { error: dbError } = await supabase.from('reports').insert([{
        description: formData.description,
        category: "General",
        priority: "Medium",
        location: formData.landmark.includes(',') ? formData.landmark : "23.2599, 77.4126",
        manual_address: formData.landmark,
        since: formData.sinceWhen,
        origin: formData.problemOrigin,
        status: "Pending",
        image_url: uploadedImageUrl,
        user_name: "Prashant Chouhan",
        user_email: "prashant@bhopal.in"
      }]);

      if (dbError) throw dbError;
      alert("Bhopal Sahayata AI: Report Registered Successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F0F2F5] flex flex-col overflow-hidden text-[#333]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
        body { font-family: 'Open Sans', sans-serif; }
      `}</style>

      <header className="h-14 w-full bg-[#337ab7] flex items-center justify-between px-8 shrink-0 shadow-md">
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-sm text-[#337ab7] font-black text-[10px]">S</div>
            <span className="font-bold text-sm tracking-wide">SAHAYATA AI (BHOPAL)</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[11px] font-semibold hover:text-white/80 transition-colors uppercase">
            <LayoutDashboard size={14}/> Dashboard
          </button>
        </div>
        <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-bold uppercase"><ChevronLeft size={16}/> Back</button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Left with Feedback Option */}
        <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
          <div className="p-4 bg-[#f8f9fa] border-b border-slate-200"><h3 className="text-sm font-bold">Quick Links</h3></div>
          <div className="flex flex-col text-[11px] font-semibold text-[#555]">
            {['Reporting Rules', 'Privacy Policy', 'Bhopal Smart City'].map((link) => (
              <div key={link} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between group">{link} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#337ab7]"/></div>
            ))}
            
            {/* 🆕 GIVE FEEDBACK SIDEBAR OPTION */}
            <div 
              onClick={() => navigate('/feedback')} 
              className="p-4 border-b border-slate-100 bg-blue-50/50 hover:bg-blue-100 cursor-pointer flex items-center justify-between group text-[#337ab7]"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={14} />
                <span>GIVE FEEDBACK (REF ID)</span>
              </div>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"/>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border-t-4 border-[#337ab7] shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#333]">Grievance Registration Form</h2>
              <p className="text-[12px] text-slate-500 italic">CivicSense AI Infrastructure Monitoring</p>
            </div>

            <div className="bg-white shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-[#333] uppercase">Problem Description *</label>
                <button onClick={handleVoiceInput} className={`flex items-center gap-2 px-3 py-1 rounded border text-[10px] font-bold uppercase transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-600'}`}>
                  {isListening ? <Mic size={14}/> : <MicOff size={14}/>} {isListening ? 'Listening...' : 'Voice Input'}
                </button>
              </div>
              <textarea className="w-full h-40 bg-slate-50 border border-slate-200 p-4 text-sm focus:border-[#337ab7] outline-none" placeholder="Explain the issue in detail..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-[#337ab7] font-bold text-[11px] uppercase"><Clock size={14}/> Duration</div>
                <input type="text" value={formData.sinceWhen} className="w-full border border-slate-200 p-2 text-sm outline-none focus:border-[#337ab7]" placeholder="e.g. 3 days" onChange={(e) => setFormData({...formData, sinceWhen: e.target.value})}/>
              </div>

              <div className="bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-[#337ab7] font-bold text-[11px] uppercase"><History size={14}/> Cause/Origin</div>
                <input type="text" value={formData.problemOrigin} className="w-full border border-slate-200 p-2 text-sm outline-none focus:border-[#337ab7]" placeholder="e.g. Pipeline leak" onChange={(e) => setFormData({...formData, problemOrigin: e.target.value})}/>
              </div>

              <div className="bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 text-[#337ab7] font-bold text-[11px] uppercase">
                  <div className="flex items-center gap-2"><Navigation size={14}/> Landmark *</div>
                  <button onClick={handleAutoFetchLocation} className="text-[9px] bg-[#337ab7] text-white px-2 py-0.5 rounded">{locLoading ? '...' : 'GPS'}</button>
                </div>
                <input type="text" value={formData.landmark} className="w-full border border-slate-200 p-2 text-sm outline-none focus:border-[#337ab7]" placeholder="Location" onChange={(e) => setFormData({...formData, landmark: e.target.value})}/>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase border-b pb-2">Evidence Upload</h3>
          <div className="h-56 bg-slate-50 border-2 border-dashed border-slate-300 rounded flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <div className="relative w-full h-full"><img src={imagePreview} className="w-full h-full object-cover" alt="preview" /><button onClick={() => {setImagePreview(null); setImageFile(null);}} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"><Trash2 size={14}/></button></div>
            ) : ( <ImageIcon size={32} className="text-slate-200"/> )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#337ab7] text-white rounded cursor-pointer text-[11px] font-bold uppercase justify-center"><input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange}/><Smartphone size={16}/> Camera</label>
            <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 text-slate-700 rounded cursor-pointer text-[11px] font-bold uppercase justify-center hover:bg-slate-50 transition-all"><input type="file" className="hidden" accept="image/*" onChange={handleFileChange}/><Upload size={16}/> Gallery</label>
          </div>
          <div className="mt-auto">
            <button onClick={handleFinalSubmit} disabled={loading} className="w-full py-4 bg-[#337ab7] text-white font-bold text-[12px] uppercase shadow-md active:translate-y-0.5 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Submit Grievance'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;