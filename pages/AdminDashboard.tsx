
import React, { useState, useMemo } from 'react';
import { useSiteData } from '../store';
import { Service, BlogPost, TeamMember, ServiceCategory, Task, TaskStatus, TaskPriority, ContactSubmission } from '../types';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200";

const AdminDashboard: React.FC = () => {
  const { 
    state, 
    logout, 
    login, 
    updateConfig, 
    updateServices, 
    updatePosts, 
    updateTeam, 
    updateTasks, 
    deleteSubmission, 
    toggleDarkMode, 
    updateAdminPassword 
  } = useSiteData();

  const [passInput, setPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [localToast, setLocalToast] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');

  // Editing States
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('seo_')) {
      const field = name.split('_')[1];
      updateConfig({ ...state.config, seo: { ...state.config.seo, [field as keyof typeof state.config.seo]: value } });
    } else if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      updateConfig({ 
        ...state.config, 
        socialLinks: { ...state.config.socialLinks, [platform]: value } 
      });
    } else {
      updateConfig({ ...state.config, [name as keyof typeof state.config]: value });
    }
  };

  const exportToCSV = (data: ContactSubmission[], filename: string) => {
    if (data.length === 0) return alert("No data to export.");
    const headers = ["ID", "Name", "Email", "Phone", "Service", "Message", "Date"];
    const csvContent = [
      headers.join(","),
      ...data.map(item => [
        item.id,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.phone || '').replace(/"/g, '""')}"`,
        `"${(item.service || '').replace(/"/g, '""')}"`,
        `"${(item.message || '').replace(/"/g, '""')}"`,
        item.date
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Export Successful");
  };

  // Robust filtering for categories
  const inquiries = useMemo(() => 
    (state.submissions || []).filter(s => {
      const svc = (s.service || '').trim().toLowerCase();
      return svc !== 'erp software' && svc !== 'newsletter';
    }),
    [state.submissions]
  );

  const waitlist = useMemo(() => 
    (state.submissions || []).filter(s => {
      const svc = (s.service || '').trim().toLowerCase();
      return svc === 'erp software' || svc === 'newsletter';
    }),
    [state.submissions]
  );

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updatedTasks = state.tasks.map(t => t.id === taskId ? { ...t, status } : t);
    updateTasks(updatedTasks);
    showToast('Task updated');
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const updatedTeam = state.team.map(m => m.id === editingMember.id ? editingMember : m);
    updateTeam(updatedTeam);
    setEditingMember(null);
    showToast('Member profile updated');
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    const updatedTasks = state.tasks.map(t => t.id === editingTask.id ? editingTask : t);
    updateTasks(updatedTasks);
    setEditingTask(null);
    showToast('Task details synchronized');
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 opacity-40">
       <i className="fas fa-folder-open text-6xl"></i>
       <p className="font-black text-xs uppercase tracking-[0.2em]">{message}</p>
    </div>
  );

  if (!state.isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${state.isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`max-w-md w-full p-10 rounded-[40px] shadow-2xl border ${state.isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
           <h1 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter">Retl Hub Access</h1>
           {!showResetModal ? (
             <form onSubmit={(e) => { e.preventDefault(); if(!login(passInput)) alert('Unauthorized Access'); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Secure Passkey</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={passInput} 
                      onChange={e => setPassInput(e.target.value)} 
                      className={`w-full px-5 py-4 pr-12 rounded-2xl border outline-none font-bold transition-all ${state.isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-200 focus:border-teal-400'}`} 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl font-black uppercase text-slate-900 transition-transform active:scale-95 shadow-xl" style={{ backgroundColor: state.config.primaryColor }}>Enter Dashboard</button>
                <button type="button" onClick={() => setShowResetModal(true)} className="w-full text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Emergency Recovery</button>
             </form>
           ) : (
             <form onSubmit={(e) => { e.preventDefault(); if (recoveryInput === 'RETL2026') { updateAdminPassword(newPassInput); showToast('Password Reset'); setShowResetModal(false); } else alert('Invalid Key'); }} className="space-y-6">
                <input required type="password" value={recoveryInput} onChange={e => setRecoveryInput(e.target.value)} className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold ${state.isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-slate-50'}`} placeholder="RECOVERY KEY" />
                <input required type="text" value={newPassInput} onChange={e => setNewPassInput(e.target.value)} className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold ${state.isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-slate-50'}`} placeholder="NEW ACCESS PASS" />
                <button type="submit" className="w-full py-4 rounded-2xl bg-red-500 text-white font-black shadow-lg">Reset Passkey</button>
                <button type="button" onClick={() => setShowResetModal(false)} className="w-full text-xs opacity-50">Back to Login</button>
             </form>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${state.isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
       {/* Global Overlay for Modals */}
       {(editingService || editingPost || editingMember || editingTask) && <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[1000]" onClick={() => { setEditingService(null); setEditingPost(null); setEditingMember(null); setEditingTask(null); }}></div>}

       {/* Enhanced Sidebar */}
       <div className="w-64 bg-slate-900 text-white flex flex-col p-8 fixed h-full z-50">
          <div className="mb-12 flex items-center space-x-3">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-900" style={{ backgroundColor: state.config.primaryColor }}>R</div>
             <h2 className="text-xl font-black tracking-tighter text-white">ADMIN 2.0</h2>
          </div>
          <nav className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
             {[
               {id: 'Overview', icon: 'fa-chart-pie'},
               {id: 'Config', icon: 'fa-cog'},
               {id: 'Services', icon: 'fa-rocket'},
               {id: 'Blog', icon: 'fa-newspaper'},
               {id: 'Team', icon: 'fa-users'},
               {id: 'Tasks', icon: 'fa-tasks'},
               {id: 'Inquiries', icon: 'fa-envelope-open-text'},
               {id: 'Waitlist', icon: 'fa-list-ol'}
             ].map(t => (
               <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)} 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-teal-400 text-slate-900' : 'hover:bg-white/5 text-slate-400'}`}
               >
                 <i className={`fas ${t.icon} w-5`}></i>
                 <span>{t.id}</span>
               </button>
             ))}
          </nav>
          <div className="mt-10 pt-6 border-t border-white/5 space-y-4">
             <div className="flex items-center space-x-3 px-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">AD</div>
                <div className="overflow-hidden">
                   <p className="text-[10px] font-black truncate">Retl Admin</p>
                   <p className="text-[8px] opacity-40 uppercase tracking-widest">Master Control</p>
                </div>
             </div>
             <button onClick={logout} className="w-full py-3 rounded-xl text-red-400 font-black text-xs uppercase hover:bg-red-500/10 transition-all text-left px-4 flex items-center space-x-3">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
             </button>
          </div>
       </div>

       <div className="flex-grow pl-64">
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-10 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">{activeTab}</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node Registry Management</p>
             </div>
             <div className="flex items-center space-x-4">
                <button onClick={toggleDarkMode} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:scale-105 transition-transform text-slate-600 dark:text-slate-400">
                   <i className={`fas ${state.isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
                <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/5 mx-2"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">{new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
             </div>
          </header>

          <main className="p-10 max-w-7xl mx-auto">
            {activeTab === 'Overview' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="p-8 rounded-[35px] bg-teal-400/10 border border-teal-400/20"><p className="text-[10px] font-black uppercase text-teal-500 mb-2">Total Leads</p><p className="text-4xl font-black">{state.submissions.length}</p></div>
                   <div className="p-8 rounded-[35px] bg-blue-400/10 border border-blue-400/20"><p className="text-[10px] font-black uppercase text-blue-500 mb-2">Service Nodes</p><p className="text-4xl font-black">{state.services.length}</p></div>
                   <div className="p-8 rounded-[35px] bg-purple-400/10 border border-purple-400/20"><p className="text-[10px] font-black uppercase text-purple-500 mb-2">Articles</p><p className="text-4xl font-black">{state.posts.length}</p></div>
                   <div className="p-8 rounded-[35px] bg-amber-400/10 border border-amber-400/20"><p className="text-[10px] font-black uppercase text-amber-500 mb-2">Team Capacity</p><p className="text-4xl font-black">{state.team.length}</p></div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                   <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase tracking-tight">Recent Inquiries</h3>
                        <button onClick={() => setActiveTab('Inquiries')} className="text-[10px] font-black uppercase tracking-widest text-teal-500 hover:underline">View All</button>
                      </div>
                      {inquiries.length > 0 ? (
                        <div className="space-y-4">
                          {inquiries.slice(0, 5).map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
                               <div><p className="font-bold text-sm">{sub.name}</p><p className="text-[10px] opacity-50 uppercase font-black">{sub.service}</p></div>
                               <span className="text-[10px] opacity-40">{new Date(sub.date).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : <EmptyState message="No Inquiries Detected" />}
                   </div>
                   <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase tracking-tight">Internal Tasks</h3>
                        <button onClick={() => setActiveTab('Tasks')} className="text-[10px] font-black uppercase tracking-widest text-teal-500 hover:underline">View All</button>
                      </div>
                      {state.tasks.length > 0 ? (
                        <div className="space-y-4">
                           {state.tasks.slice(0, 5).map(task => (
                             <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${task.priority === TaskPriority.CRITICAL ? 'bg-red-500' : 'bg-teal-400'}`}></div>
                                  <p className="font-bold text-sm line-clamp-1">{task.title}</p>
                                </div>
                                <select 
                                  value={task.status} 
                                  onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                                  className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                                >
                                  {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                           ))}
                        </div>
                      ) : <EmptyState message="No Active Tasks" />}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Config' && (
              <div className="max-w-4xl space-y-12">
                 <section className="space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Core Identity</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase opacity-50 ml-1">Site Title</label>
                          <input name="siteName" value={state.config.siteName} onChange={handleConfigChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold focus:border-teal-400" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase opacity-50 ml-1">Primary Brand Color</label>
                          <div className="flex items-center space-x-3">
                             <input name="primaryColor" value={state.config.primaryColor} onChange={handleConfigChange} className="flex-grow px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold focus:border-teal-400" />
                             <div className="w-14 h-14 rounded-2xl shadow-xl shrink-0" style={{ backgroundColor: state.config.primaryColor }}></div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase opacity-50 ml-1">Tagline</label>
                       <input name="tagline" value={state.config.tagline} onChange={handleConfigChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold focus:border-teal-400" />
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Brand Assets (Logos)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase opacity-50 ml-1">Main Logo URL</label>
                          <input name="logoImage" value={state.config.logoImage} onChange={handleConfigChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold" placeholder="https://..." />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase opacity-50 ml-1">Favicon URL</label>
                          <input name="faviconImage" value={state.config.faviconImage} onChange={handleConfigChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold" placeholder="https://..." />
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Global Social Links</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {Object.keys(state.config.socialLinks).map(platform => (
                         <div key={platform} className="space-y-2">
                            <label className="text-[10px] font-black uppercase opacity-50 ml-1">{platform}</label>
                            <input name={`social_${platform}`} value={state.config.socialLinks[platform]} onChange={handleConfigChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold text-xs" placeholder={`https://${platform}.com/...`} />
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">SEO Meta Layers</h3>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase opacity-50 ml-1">Meta Title</label>
                       <input name="seo_metaTitle" value={state.config.seo.metaTitle} onChange={handleConfigChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase opacity-50 ml-1">Meta Description</label>
                       <textarea name="seo_metaDescription" value={state.config.seo.metaDescription} onChange={handleConfigChange} rows={3} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-white/5 outline-none font-bold resize-none" />
                    </div>
                 </section>
                 
                 <button onClick={() => showToast('Configuration Synchronized')} className="px-10 py-5 rounded-2xl font-black text-slate-900 transition-all hover:scale-105 shadow-2xl" style={{ backgroundColor: state.config.primaryColor }}>Save Global Config</button>
              </div>
            )}

            {activeTab === 'Services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.services.map(service => (
                  <div key={service.id} className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 group relative">
                     <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                        <i className={service.icon}></i>
                     </div>
                     <h4 className="font-black text-xl mb-2 line-clamp-1">{service.title}</h4>
                     <p className="text-xs text-slate-400 line-clamp-2 mb-6 font-medium">{service.description}</p>
                     <button onClick={() => setEditingService(service)} className="w-full py-4 rounded-xl border border-slate-200 dark:border-white/10 font-black text-xs uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all">Manage Node</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Blog' && (
              <div className="space-y-6">
                {state.posts.length > 0 ? state.posts.map(post => (
                  <div key={post.id} className="flex items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-white/5">
                    <div className="w-24 h-16 rounded-2xl overflow-hidden shrink-0 mr-6 bg-slate-200">
                       <img src={post.image || FALLBACK_IMAGE} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                       <h4 className="font-bold line-clamp-1">{post.title}</h4>
                       <p className="text-[10px] font-black uppercase tracking-widest text-teal-500 mt-1">{post.category} • {post.author}</p>
                    </div>
                    <button onClick={() => setEditingPost(post)} className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest">Edit</button>
                  </div>
                )) : <EmptyState message="No Blog Articles Published" />}
              </div>
            )}

            {activeTab === 'Team' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.team.map(member => (
                  <div key={member.id} className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 group relative flex flex-col items-center text-center">
                     <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-white dark:border-white/5 shadow-xl bg-slate-200">
                        <img src={member.image || FALLBACK_IMAGE} className="w-full h-full object-cover" />
                     </div>
                     <h4 className="font-black text-xl mb-1">{member.name}</h4>
                     <p className="text-[10px] font-black uppercase tracking-widest text-teal-500 mb-4">{member.position}</p>
                     <p className="text-xs text-slate-400 line-clamp-2 mb-8 font-medium italic">"{member.bio}"</p>
                     <button onClick={() => setEditingMember(member)} className="w-full py-4 rounded-xl border border-slate-200 dark:border-white/10 font-black text-xs uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all">Update Node</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Tasks' && (
              <div className="space-y-6">
                 {state.tasks.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {state.tasks.map(task => (
                        <div key={task.id} className="p-8 rounded-[35px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 relative group">
                            <div className="flex justify-between items-start mb-6">
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                task.priority === TaskPriority.CRITICAL ? 'bg-red-500 text-white' : 
                                task.priority === TaskPriority.HIGH ? 'bg-orange-500 text-white' :
                                'bg-teal-400 text-slate-900'
                            }`}>
                                {task.priority}
                            </div>
                            <button onClick={() => setEditingTask(task)} className="text-slate-400 hover:text-teal-400 transition-colors"><i className="fas fa-edit"></i></button>
                            </div>
                            <h4 className="font-black text-lg mb-2 leading-tight">{task.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-medium">{task.description}</p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[8px] font-black">
                                {state.team.find(t => t.id === task.assignedToId)?.name.charAt(0) || '?'}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight opacity-40">Assigned Node</span>
                            </div>
                            <select 
                                value={task.status} 
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                                className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
                            >
                                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            </div>
                        </div>
                        ))}
                    </div>
                 ) : <EmptyState message="No Tasks in Registry" />}
              </div>
            )}

            {activeTab === 'Inquiries' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[35px] text-white">
                    <div>
                      <h3 className="text-2xl font-black">CRM Hub</h3>
                      <p className="text-slate-400 font-medium text-xs">Direct strategic inquiries node.</p>
                    </div>
                    <button onClick={() => exportToCSV(inquiries, "Retlcommerce_Inquiries")} className="px-8 py-4 rounded-2xl bg-teal-400 text-slate-900 font-black uppercase text-xs tracking-widest">Export Dataset</button>
                 </div>
                 {inquiries.length > 0 ? (
                    <div className="space-y-4">
                        {inquiries.map(sub => (
                        <div key={sub.id} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                            <button onClick={() => deleteSubmission(sub.id)} className="absolute top-6 right-8 text-red-400 opacity-20 hover:opacity-100 transition-opacity"><i className="fas fa-trash text-xs"></i></button>
                            <div className="space-y-2">
                                <p className="text-xl font-black">{sub.name}</p>
                                <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">{sub.email}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{sub.service}</p>
                            </div>
                            <div className="flex-grow md:mx-10 p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5 italic text-sm text-slate-500 font-medium">
                                "{sub.message}"
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black opacity-30">{new Date(sub.date).toLocaleDateString()}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">{sub.phone}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                 ) : <EmptyState message="No Inquiries Captured" />}
              </div>
            )}

            {activeTab === 'Waitlist' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[35px] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/5 blur-2xl -mr-16 -mt-16"></div>
                    <div>
                      <h3 className="text-2xl font-black">Growth Pipeline</h3>
                      <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">ERP 2026 & Newsletter Nodes</p>
                    </div>
                    <button onClick={() => exportToCSV(waitlist, "Retl_Waitlist_Dataset")} className="px-8 py-4 rounded-2xl bg-teal-400 text-slate-900 font-black uppercase text-xs tracking-widest relative z-10">Download List</button>
                </div>
                {waitlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {waitlist.map(sub => (
                        <div key={sub.id} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-white/5 flex flex-col justify-between group transition-all hover:border-teal-400/30">
                            <div className="space-y-1">
                                <p className="font-black text-lg break-all">{sub.email}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">{sub.service}</p>
                            </div>
                            <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-5">
                                <span className="text-[10px] opacity-40 font-bold">{new Date(sub.date).toLocaleDateString()}</span>
                                <button onClick={() => deleteSubmission(sub.id)} className="text-red-400 text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Remove</button>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : <EmptyState message="Waitlist Node is Empty" />}
              </div>
            )}
          </main>
       </div>

       {/* Edit Service Modal */}
       {editingService && (
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-white dark:bg-slate-900 rounded-[45px] p-10 shadow-3xl z-[1100] animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100 dark:border-white/5">
            <h2 className="text-2xl font-black mb-8 uppercase">Edit Service Node</h2>
            <form onSubmit={(e) => { e.preventDefault(); updateServices(state.services.map(s => s.id === editingService.id ? editingService : s)); setEditingService(null); showToast('Service Synchronized'); }} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Title</label>
                    <input value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Category</label>
                    <select value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value as ServiceCategory})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold">
                       {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-1">Short Description</label>
                  <textarea value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} rows={2} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold resize-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-1">Full Technical Overview</label>
                  <textarea value={editingService.fullDescription} onChange={e => setEditingService({...editingService, fullDescription: e.target.value})} rows={5} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold resize-none" />
               </div>
               <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow py-5 rounded-2xl font-black text-slate-900" style={{ backgroundColor: state.config.primaryColor }}>Commit Changes</button>
                  <button type="button" onClick={() => setEditingService(null)} className="px-10 py-5 rounded-2xl bg-slate-100 dark:bg-white/5 font-black uppercase text-xs tracking-widest">Cancel</button>
               </div>
            </form>
         </div>
       )}

       {/* Edit Team Modal */}
       {editingMember && (
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-white dark:bg-slate-900 rounded-[45px] p-10 shadow-3xl z-[1100] animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100 dark:border-white/5">
            <h2 className="text-2xl font-black mb-8 uppercase">Update Member Node</h2>
            <form onSubmit={handleSaveTeamMember} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Full Name</label>
                    <input value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Position</label>
                    <input value={editingMember.position} onChange={e => setEditingMember({...editingMember, position: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold" />
                  </div>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Image URL</label>
                    <input value={editingMember.image} onChange={e => setEditingMember({...editingMember, image: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Work Email</label>
                    <input value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-1">Strategic Bio</label>
                  <textarea value={editingMember.bio} onChange={e => setEditingMember({...editingMember, bio: e.target.value})} rows={2} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold resize-none" />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-1">Social Connectivity (Links)</label>
                  <div className="grid md:grid-cols-2 gap-4">
                     {['LinkedIn', 'WhatsApp', 'Twitter', 'Instagram', 'Facebook', 'TikTok'].map(plat => (
                        <div key={plat} className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">{plat}</label>
                            <input 
                                value={(editingMember as any)[plat.toLowerCase()] || ''} 
                                onChange={e => setEditingMember({...editingMember, [plat.toLowerCase()]: e.target.value})} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold text-xs" 
                            />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow py-5 rounded-2xl font-black text-slate-900" style={{ backgroundColor: state.config.primaryColor }}>Sync Node</button>
                  <button type="button" onClick={() => setEditingMember(null)} className="px-10 py-5 rounded-2xl bg-slate-100 dark:bg-white/5 font-black uppercase text-xs tracking-widest">Cancel</button>
               </div>
            </form>
         </div>
       )}

       {/* Edit Task Modal */}
       {editingTask && (
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-white dark:bg-slate-900 rounded-[45px] p-10 shadow-3xl z-[1100] animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100 dark:border-white/5">
            <h2 className="text-2xl font-black mb-8 uppercase">Manage Task Node</h2>
            <form onSubmit={handleSaveTask} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-1">Task Title</label>
                  <input value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold" />
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Priority</label>
                    <select value={editingTask.priority} onChange={e => setEditingTask({...editingTask, priority: e.target.value as TaskPriority})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold">
                       {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-50 ml-1">Status</label>
                    <select value={editingTask.status} onChange={e => setEditingTask({...editingTask, status: e.target.value as TaskStatus})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold">
                       {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 ml-1">Assigned Node</label>
                  <select value={editingTask.assignedToId} onChange={e => setEditingTask({...editingTask, assignedToId: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none font-bold">
                     {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
               </div>
               <div className="flex space-x-4 pt-4">
                  <button type="submit" className="flex-grow py-5 rounded-2xl font-black text-slate-900" style={{ backgroundColor: state.config.primaryColor }}>Update Registry</button>
                  <button type="button" onClick={() => setEditingTask(null)} className="px-10 py-5 rounded-2xl bg-slate-100 dark:bg-white/5 font-black uppercase text-xs tracking-widest">Cancel</button>
               </div>
            </form>
         </div>
       )}

       {/* Toast Notification */}
       {localToast && (
         <div className="fixed bottom-10 right-10 z-[2000] animate-scale-in">
            <div className="bg-slate-900 text-teal-400 px-8 py-5 rounded-2xl shadow-3xl border border-white/10 flex items-center space-x-3">
               <i className="fas fa-check-circle"></i>
               <p className="font-black text-xs uppercase tracking-widest">{localToast}</p>
            </div>
         </div>
       )}
    </div>
  );
};

export default AdminDashboard;
