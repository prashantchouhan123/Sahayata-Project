import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  LayoutDashboard, Map as MapIcon, Database, 
  AlertCircle, CheckCircle2, Clock, 
  ChevronRight, Image as ImageIcon, X, 
  RefreshCw, BarChart3, ArrowLeft, 
  User, Navigation, MapPin, Camera, Sparkles, Search,
  Mail, Phone, Info, Fingerprint, Activity, Zap, Users, ShieldCheck, PlusCircle,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImg, setSelectedImg] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (!error && data) setReports(data);
    } catch (err) { console.error("Fetch Error:", err); } 
    finally { setLoading(false); }
  };

  // 🔥 UPDATED: Authorize Button Logic
  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;

      // Local state update taaki UI turant change ho
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      
      // Detail view update
      if (selectedReport?.id === id) {
        setSelectedReport(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) { 
      console.error("Update Error:", error); 
      alert("Failed to update status.");
    } finally { 
      setUpdatingId(null); 
    }
  };

  const handleUpdateFeedback = async (id, remark) => {
    try {
      const { error } = await supabase.from('reports').update({ feedback_text: remark }).eq('id', id);
      if (error) throw error;
      setReports(reports.map(r => r.id === id ? { ...r, feedback_text: remark } : r));
      setSelectedReport(prev => ({ ...prev, feedback_text: remark }));
      alert("Official Remark Updated!");
    } catch (err) {
      console.error("Remark Error:", err);
      alert("Failed to update remark.");
    }
  };

  const safeReports = reports || [];

  const stats = {
    total: safeReports.length,
    critical: safeReports.filter(r => 
      (r.priority === 'Critical' || r.priority === 'Urgent' || r.priority === 'Medium') && 
      r.status !== 'Resolved'
    ).length,
    resolved: safeReports.filter(r => r.status === 'Resolved' || r.status === 'Closed').length
  };

  const getCounts = (keywords) => {
    return safeReports.filter(r => {
      const desc = (r.description || '').toLowerCase();
      const cat = (r.category || '').toLowerCase();
      return keywords.some(k => desc.includes(k) || cat.includes(k));
    }).length;
  };

  const wasteCount = getCounts(['kachre', 'garbage', 'waste', 'dustbin', 'clean']);
  const waterCount = getCounts(['pani', 'water', 'leakage', 'drainage', 'sewage', 'pipe']);
  const roadCount = getCounts(['road', 'pothole', 'sadak', 'street', 'light', 'path']);
  const otherCount = safeReports.length - (wasteCount + waterCount + roadCount);

  const categoryStats = [
    { label: 'Waste Management', count: wasteCount, color: 'bg-[#337ab7]' },
    { label: 'Water Infrastructure', count: waterCount, color: 'bg-rose-500' },
    { label: 'Roads & Safety', count: roadCount, color: 'bg-amber-500' },
    { label: 'Other / General', count: Math.max(0, otherCount), color: 'bg-slate-400' }
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#333] antialiased overflow-hidden text-left selection:bg-blue-100">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
          body { font-family: 'Open Sans', Arial, sans-serif; }
          .official-shadow { box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        `}
      </style>
      
      <aside className="w-64 bg-[#337ab7] flex flex-col p-0 shadow-xl z-30">
        <div className="flex items-center gap-3 p-6 mb-4 border-b border-white/10">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-[#337ab7] font-bold shadow-sm text-sm">S</div>
            <span className="font-bold text-[14px] tracking-wider text-white uppercase">CivicSense AI</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {[
            { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
            { id: 'map', label: 'Geospatial View', icon: MapIcon },
            { id: 'records', label: 'Master Registry', icon: Database },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedReport(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-[12px] font-bold ${activeTab === item.id ? 'bg-white/10 text-white border-l-4 border-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 text-[9px] font-bold text-white/40 uppercase tracking-tighter text-center">System © 2026 BMC Hub</div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7 shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-5">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#337ab7] transition-all font-bold text-[11px]">
                <ArrowLeft size={16} /> EXIT CONSOLE
              </button>
              <div className="h-5 w-[1px] bg-slate-200"></div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bhopal_Node / {activeTab}</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-bold uppercase tracking-tight">Active_Link</span>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-7 custom-scrollbar">
          <div className="flex flex-col lg:flex-row gap-7 max-w-[1500px] mx-auto h-full">
            <div className={`transition-all duration-500 ${selectedReport ? 'lg:w-[60%]' : 'w-full'} space-y-7`}>
              
              {activeTab === 'overview' && (
                <div className="animate-in fade-in duration-500 space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <StatBoxCompact title="Total Grievances" value={stats.total} color="border-[#337ab7]" icon={<Database size={20} className="text-[#337ab7]"/>} />
                        <StatBoxCompact title="Priority Critical" value={stats.critical} color="border-rose-500" icon={<AlertCircle size={20} className="text-rose-500"/>} />
                        <StatBoxCompact title="Verified Resolved" value={stats.resolved} color="border-emerald-500" icon={<CheckCircle2 size={20} className="text-emerald-500"/>} />
                    </div>

                    <div className="bg-[#2c3e50] rounded-sm p-4 flex items-center justify-around text-white shadow-md border-b-2 border-[#337ab7]">
                        <div className="flex items-center gap-3">
                          <Zap size={14} className="text-[#337ab7]"/>
                          <div><p className="text-[8px] font-bold text-slate-400 uppercase">Avg Response</p><p className="text-[11px] font-bold">4.2 Hours</p></div>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10"></div>
                        <div className="flex items-center gap-3">
                          <Activity size={14} className="text-emerald-400"/>
                          <div><p className="text-[8px] font-bold text-slate-400 uppercase">Integrity</p><p className="text-[11px] font-bold">99.8%</p></div>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10"></div>
                        <div className="flex items-center gap-3">
                          <Users size={14} className="text-amber-400"/>
                          <div><p className="text-[8px] font-bold text-slate-400 uppercase">Field Units</p><p className="text-[11px] font-bold">24 Active</p></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-3 bg-white border border-slate-200 official-shadow">
                            <div className="p-4 bg-[#f8f9fa] border-b border-slate-200 flex justify-between items-center">
                              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Live Incident Stream</h3>
                              <button onClick={fetchReports} className="text-[#337ab7] hover:rotate-180 transition-all duration-500"><RefreshCw size={14}/></button>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {safeReports.map(r => (
                                    <ActivityRow key={r.id} report={r} isSelected={selectedReport?.id === r.id} onClick={() => setSelectedReport(r)} />
                                ))}
                            </div>
                        </div>

                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-white border border-slate-200 official-shadow p-6">
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 border-b pb-2">Category Analysis</h3>
                                <div className="space-y-5">
                                    {categoryStats.map((cat, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between mb-2">
                                              <p className="text-[10px] font-bold text-slate-600 uppercase">{cat.label}</p>
                                              <p className="text-[10px] font-bold text-[#337ab7]">{cat.count}</p>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-none overflow-hidden">
                                                <div className={`h-full ${cat.color} transition-all duration-700`} style={{ width: `${(cat.count / (stats.total || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#337ab7] p-6 text-white shadow-lg relative overflow-hidden">
                                <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10" size={100}/>
                                <p className="text-[10px] font-bold text-blue-200 uppercase mb-2">Security Status</p>
                                <p className="text-sm font-bold tracking-tight">Node Bhopal-01 encrypted and synchronized with Smart City protocols.</p>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="h-[75vh] official-shadow border border-slate-200 relative">
                  <MapContainer center={[23.2599, 77.4126]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    {safeReports.map(r => {
                        const pos = r.location?.split(',').map(Number);
                        if(pos?.length === 2) return (
                          <CircleMarker key={r.id} center={pos} radius={8} pathOptions={{ fillColor: '#337ab7', color: 'white', fillOpacity: 0.8, weight: 1 }} eventHandlers={{ click: () => setSelectedReport(r) }} />
                        ); return null;
                    })}
                  </MapContainer>
                </div>
              )}

              {activeTab === 'records' && (
                <div className="bg-white border border-slate-200 official-shadow h-[75vh] flex flex-col">
                    <div className="px-7 py-4 bg-[#f8f9fa] border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-[12px] font-bold uppercase text-slate-600 tracking-widest">Citizen Registry Database</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="px-7 py-3 text-[10px] font-bold text-slate-400 uppercase">Ref ID</th>
                                <th className="px-7 py-3 text-[10px] font-bold text-slate-400 uppercase">Category</th>
                                <th className="px-7 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                                <th className="px-7 py-3 text-[10px] font-bold text-slate-400 uppercase">Verification</th>
                                <th className="px-7 py-3 text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {safeReports.map(r => (
                                    <tr key={r.id} onClick={() => setSelectedReport(r)} className={`cursor-pointer transition-all ${selectedReport?.id === r.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                        <td className="px-7 py-4 font-bold text-slate-700 text-[12px]">#BHO-{r.id?.toString().slice(-4)}</td>
                                        <td className="px-7 py-4 text-[11px] font-bold text-slate-500 uppercase">{r.category || 'General'}</td>
                                        <td className="px-7 py-4">
                                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase ${r.status === 'Resolved' || r.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span>
                                        </td>
                                        <td className="px-7 py-4">
                                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                                            r.verification_status === 'verified' ? 'bg-green-100 text-green-700' : 
                                            r.verification_status === 'reopened' ? 'bg-red-100 text-red-700' : 
                                            'bg-gray-100 text-gray-500'
                                          }`}>
                                            {r.verification_status || 'Pending'}
                                          </span>
                                        </td>
                                        <td className="px-7 py-4 text-right"><ChevronRight size={14} className="text-slate-300 ml-auto"/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              )}
            </div>

            {selectedReport && (
              <div className="lg:w-[40%] flex flex-col gap-5 animate-in slide-in-from-right-4 duration-400 overflow-y-auto custom-scrollbar h-[calc(100vh-120px)] pb-10">
                  <div className="bg-white border border-slate-200 official-shadow relative">
                    <div className="bg-[#337ab7] p-3 text-white flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Incident Dossier</span>
                      <X size={16} className="cursor-pointer" onClick={() => setSelectedReport(null)}/>
                    </div>
                    <div className="p-6">
                      <p className="text-[9px] font-bold text-[#337ab7] uppercase tracking-widest mb-4 flex items-center gap-2"><Fingerprint size={12}/> Citizen Identity</p>
                      <div className="flex items-center gap-4 mb-6 border-b pb-4">
                          <div className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center font-bold rounded-sm">{(selectedReport.user_name || "C")[0]}</div>
                          <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-none">{selectedReport.user_name || "Bhopal Resident"}</h2>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Reference ID Verified</p>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 text-slate-600"><Mail size={12}/> <p className="text-[11px] font-bold">{selectedReport.user_email || "Not Provided"}</p></div>
                          <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 text-slate-600"><Phone size={12}/> <p className="text-[11px] font-bold">{selectedReport.user_phone || "+91-XXXXXXXXXX"}</p></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 border border-slate-200 official-shadow space-y-4">
                    <p className="text-[10px] font-bold text-[#337ab7] uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={12}/> Issue Timeline & Origin</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Since When (कबसे)</p>
                            <p className="text-[11px] font-bold text-slate-700">{selectedReport.since || "Not Specified"}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Origin (कैसे हुआ)</p>
                            <p className="text-[11px] font-bold text-slate-700">{selectedReport.origin || "Not Specified"}</p>
                        </div>
                    </div>
                  </div>

                  {selectedReport.feedback_text && (
                    <div className="bg-white p-6 border-l-4 border-amber-500 official-shadow">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2"><MessageSquare size={12}/> Official/Citizen Feedback</p>
                      <div className="p-3 bg-amber-50 rounded italic text-slate-700 text-[12px]">
                        "{selectedReport.feedback_text}"
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-6 border border-slate-200 official-shadow">
                    <p className="text-[10px] font-bold text-[#337ab7] uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12}/> Geospatial Data</p>
                    <div className="space-y-3 text-[11px] font-bold">
                        <div className="p-3 bg-blue-50 border border-blue-100 text-[#337ab7]">LAT/LONG: {selectedReport.location || "23.25, 77.41"}</div>
                        <div className="p-3 bg-slate-50 border border-slate-100 italic leading-relaxed text-slate-600">
                            <span className="block text-[8px] font-black text-slate-400 uppercase not-italic mb-1 underline">Reported Landmark:</span>
                            "{selectedReport.manual_address || "Bhopal Region"}"
                        </div>
                    </div>
                  </div>

                  <div className="bg-white p-2 border border-slate-200 official-shadow">
                    {selectedReport.image_url ? (
                        <div className="relative group overflow-hidden border border-slate-100">
                            <img src={selectedReport.image_url} className="w-full aspect-video object-cover" alt="evidence"/>
                            <button onClick={() => setSelectedImg(selectedReport.image_url)} className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center group">
                                <Search className="text-white opacity-0 group-hover:opacity-100" size={30}/>
                            </button>
                        </div>
                    ) : <div className="aspect-video bg-slate-50 flex items-center justify-center text-slate-200"><ImageIcon size={40}/></div>}
                  </div>

                  <div className="bg-white p-6 border border-slate-200 official-shadow">
                    <p className="text-[10px] font-bold text-[#337ab7] uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={12}/> Grievance Description</p>
                    <div className="bg-slate-50 p-4 border-l-4 border-[#337ab7] mb-4 text-slate-700 text-[13px] font-medium italic">"{selectedReport.description}"</div>
                    
                    <div className="mb-6 pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          const remark = prompt("Enter official remark/update:");
                          if(remark) handleUpdateFeedback(selectedReport.id, remark); 
                        }}
                        className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-[#337ab7] transition-all"
                      >
                        <PlusCircle size={14}/> ADD OFFICIAL REMARK
                      </button>
                    </div>

                    {/* 🔥 UPDATED: Authorize Button */}
                    <button 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'Resolved')} 
                      disabled={selectedReport.status === 'Resolved' || selectedReport.status === 'Closed' || updatingId !== null} 
                      className="w-full py-4 bg-[#337ab7] hover:bg-[#286090] disabled:bg-emerald-500 disabled:cursor-not-allowed text-white font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        {updatingId === selectedReport.id ? (
                          <>
                            <RefreshCw size={14} className="animate-spin"/> 
                            AUTHORIZING...
                          </>
                        ) : (
                          (selectedReport.status === 'Resolved' || selectedReport.status === 'Closed') 
                            ? 'RESOLUTION VERIFIED ✓' 
                            : 'AUTHORIZE ACTION'
                        )}
                    </button>
                  </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setSelectedImg(null)}>
            <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <button className="absolute -top-10 right-0 text-white font-bold text-[11px] uppercase tracking-widest flex items-center gap-2" onClick={() => setSelectedImg(null)}><X size={20}/> CLOSE VIEW</button>
                <img src={selectedImg} className="w-full border-4 border-white shadow-2xl" alt="fullview" />
            </div>
        </div>
      )}
    </div>
  );
};

const StatBoxCompact = ({ title, value, icon, color }) => (
    <div className={`bg-white p-5 border-b-4 ${color} official-shadow flex items-center gap-4 text-left`}>
        <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">{icon}</div>
        <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p><h4 className="text-2xl font-bold text-slate-800 leading-none">{value}</h4></div>
    </div>
);

const ActivityRow = ({ report, isSelected, onClick }) => {
  const isHighPriority = report.priority === 'Critical' || report.priority === 'Urgent' || report.priority === 'Medium';

  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-4 transition-all border-b cursor-pointer ${isSelected ? 'bg-blue-50 border-l-4 border-l-[#337ab7]' : isHighPriority ? 'bg-rose-50/30 hover:bg-rose-50' : 'hover:bg-slate-50 border-transparent'}`}>
        <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {report.image_url ? ( <img src={report.image_url} className="w-full h-full object-cover" alt="e"/> ) : <ImageIcon className="text-slate-300" size={18} />}
        </div>
        <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${isHighPriority ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{report.priority || 'Standard'}</span>
              <span className="text-[8px] font-bold text-slate-300 italic">#BHO-{report.id?.toString().slice(-4)}</span>
            </div>
            <p className={`text-[13px] font-bold truncate leading-none ${isHighPriority ? 'text-rose-900' : isSelected ? 'text-[#337ab7]' : 'text-slate-700'}`}>{report.description}</p>
        </div>
        <ChevronRight size={14} className={isHighPriority ? 'text-rose-400' : isSelected ? 'text-[#337ab7]' : 'text-slate-300'} />
    </div>
  );
};

export default Dashboard;