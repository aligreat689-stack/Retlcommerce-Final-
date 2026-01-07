
import React, { useState, useMemo } from 'react';
import { useSiteData } from '../store';
import { Service, BlogPost, TeamMember, ServiceCategory, Task, TaskStatus, TaskPriority, TaskCategory, ContactSubmission } from '../types';

const FALLBACK_BLOG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200";

const AdminDashboard: React.FC = () => {
  const { state, logout, login, updateConfig, updateServices, updatePosts, updateTeam, updateTasks, deleteSubmission, resetToDefaults, toggleDarkMode, updateAdminPassword } = useSiteData();
  const [passInput, setPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [localToast, setLocalToast] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');

  // Entity State for Editing
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filters for Tasks
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<string>('All');
  const [taskFilterCategory, setTaskFilterCategory] = useState<string>('All');

  // Brand Social Management State
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformUrl, setNewPlatformUrl] = useState('');

  // UI helpers
  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('seo_')) {
      const field = name.split('_')[1];
      updateConfig({ ...state.config, seo: { ...state.config.seo, [field as keyof typeof state.config.seo]: value } });
    } else {
      updateConfig({ ...state.config, [name as keyof typeof state.config]: value });
    }
  };

  // CSV Export Utility
  const exportToCSV = (data: ContactSubmission[], filename: string) => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }
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

  // Filter leads
  const inquiries = useMemo(() => 
    (state.submissions || []).filter(s => s.service !== 'ERP Software' && s.service !== 'Newsletter'),
    [state.submissions]
  );

  const waitlist = useMemo(() => 
    (state.submissions || []).filter(s => s.service === 'ERP Software' || s.service === 'Newsletter'),
    [state.submissions]
  );

  // --- CRUD HANDLERS ---
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const exists = state.services.find(s => s.id === editingService.id);
    updateServices(exists ? state.services.map(s => s.id === editingService.id ? editingService : s) : [...state.services, editingService]);
    setEditingService(null);
    showToast('Service updated.');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    const exists = state.posts.find(p => p.id === editingPost.id);
    updatePosts(exists ? state.posts.map(p => p.id === editingPost.id ? editingPost : p) : [editingPost, ...state.posts]);
    setEditingPost(null);
    showToast('Article published.');
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const exists = state.team.find(m => m.id === editingMember.id);
    updateTeam(exists ? state.team.map(m => m.id === editingMember.id ? editingMember : m) : [...state.team, editingMember]);
    setEditingMember(null);
    showToast('Team member saved.');
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    const exists = state.tasks.find(t => t.id === editingTask.id);
    updateTasks(exists ? state.tasks.map(t => t.id === editingTask.id ? editingTask : t) : [...state.tasks, editingTask]);
    setEditingTask(null);
    showToast('Task updated.');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryInput === 'RETL2026') {
      updateAdminPassword(newPassInput || 'admin123');
      showToast('Password reset complete.');
      setShowResetModal(false);
    } else {
      alert('Invalid recovery key.');
    }
  };

  const inputBaseClasses = `w-full px-5 py-4 rounded-xl border outline-none font-bold transition-all`;
  const getThemeClasses = () => state.isDarkMode ? `bg-slate-800 border-white/10 text-white` : `bg-slate-50 border-slate-200 text-slate-900`;

  if (!state.isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${state.isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`max-w-md w-full p-10 rounded-[40px] shadow-2xl border ${state.isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
           <h1 className="text-2xl font-black mb-8 text-center uppercase">Retl Admin</h1>
           {!showResetModal ? (
             <form onSubmit={(e) => { e.preventDefault(); if(!login(passInput)) alert('Wrong Pass'); }} className="space-y-6">
                <input type={showPass ? "text" : "password"} value={passInput} onChange={e => setPassInput(e.target.value)} className={`${inputBaseClasses} ${getThemeClasses()}`} placeholder="ACCESS KEY" />
                <button type="submit" className="w-full py-4 rounded-xl font-black uppercase text-slate-900" style={{ backgroundColor: state.config.primaryColor }}>Login</button>
                <button type="button" onClick={() => setShowResetModal(true)} className="w-full text-[10px] font-black uppercase tracking-widest opacity-50">Forgot Pass?</button>
             </form>
           ) : (
             <form onSubmit={handleResetPassword} className="space-y-6">
                <input required type="password" value={recoveryInput} onChange={e => setRecoveryInput(e.target.value)} className={`${inputBaseClasses} ${getThemeClasses()}`} placeholder="RECOVERY KEY" />
                <input required type="text" value={newPassInput} onChange={e => setNewPassInput(e.target.value)} className={`${inputBaseClasses} ${getThemeClasses()}`} placeholder="NEW PASS" />
                <button type="submit" className="w-full py-4 rounded-xl bg-red-500 text-white font-black">Reset</button>
                <button type="button" onClick={() => setShowResetModal(false)} className="w-full text-xs opacity-50">Cancel</button>
             </form>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${state.isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
       {/* Sidebar */}
       <div className="w-64 bg-slate-900 text-white flex flex-col p-8 fixed h-full z-50">
          <div className="mb-12"><h2 className="text-xl font-black">RETL HUB</h2></div>
          <nav className="flex-grow space-y-2">
             {['Overview', 'Tasks', 'Config', 'Services', 'Blog', 'Team', 'Inquiries', 'Waitlist'].map(t => (
               <button key={t} onClick={() => handleTabChange(t)} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest ${activeTab === t ? 'bg-teal-400 text-slate-900' : 'hover:bg-white/5 text-slate-400'}`}>{t}</button>
             ))}
          </nav>
          <button onClick={logout} className="mt-10 text-red-400 font-black text-xs uppercase">Logout</button>
       </div>

       <div className="flex-grow pl-64 p-10">
          <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100 dark:border-white/5">
             <h1 className="text-3xl font-black uppercase">{activeTab}</h1>
             <button onClick={toggleDarkMode} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800"><i className={`fas ${state.isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i></button>
          </header>

          {activeTab === 'Overview' && (
            <div className="grid grid-cols-4 gap-6">
               <div className="p-8 rounded-3xl bg-teal-400/10 border border-teal-400/20"><p className="text-[10px] font-black uppercase text-teal-500 mb-2">Total Leads</p><p className="text-3xl font-black">{state.submissions.length}</p></div>
               <div className="p-8 rounded-3xl bg-blue-400/10 border border-blue-400/20"><p className="text-[10px] font-black uppercase text-blue-500 mb-2">Active Tasks</p><p className="text-3xl font-black">{state.tasks.filter(t => t.status !== TaskStatus.COMPLETED).length}</p></div>
               <div className="p-8 rounded-3xl bg-purple-400/10 border border-purple-400/20"><p className="text-[10px] font-black uppercase text-purple-500 mb-2">Articles</p><p className="text-3xl font-black">{state.posts.length}</p></div>
               <div className="p-8 rounded-3xl bg-amber-400/10 border border-amber-400/20"><p className="text-[10px] font-black uppercase text-amber-500 mb-2">Team Nodes</p><p className="text-3xl font-black">{state.team.length}</p></div>
            </div>
          )}

          {activeTab === 'Inquiries' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center mb-4">
                 <p className="text-slate-500 font-bold">Standard service inquiries and contact forms.</p>
                 <button onClick={() => exportToCSV(inquiries, "Inquiries")} className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs">Export CSV</button>
               </div>
               {inquiries.map(sub => (
                 <div key={sub.id} className="p-6 rounded-3xl border border-slate-100 dark:border-white/5 relative bg-slate-50 dark:bg-slate-900/50">
                    <button onClick={() => deleteSubmission(sub.id)} className="absolute top-6 right-6 text-red-400"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-3 gap-8">
                       <div><p className="text-[10px] font-black uppercase opacity-40 mb-1">Sender</p><p className="font-bold">{sub.name}</p><p className="text-xs text-teal-500">{sub.email}</p></div>
                       <div><p className="text-[10px] font-black uppercase opacity-40 mb-1">Service</p><p className="font-bold">{sub.service}</p></div>
                       <div><p className="text-[10px] font-black uppercase opacity-40 mb-1">Message</p><p className="text-xs italic leading-relaxed">"{sub.message}"</p></div>
                    </div>
                 </div>
               ))}
               {inquiries.length === 0 && <p className="text-center py-20 opacity-30 italic">No inquiries found.</p>}
            </div>
          )}

          {activeTab === 'Waitlist' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center mb-4">
                 <p className="text-slate-500 font-bold">Newsletter and ERP Software signups.</p>
                 <button onClick={() => exportToCSV(waitlist, "Waitlist")} className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs">Export CSV</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 {waitlist.map(sub => (
                   <div key={sub.id} className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{sub.email}</p>
                        <p className="text-[10px] font-black uppercase text-teal-500">{sub.service}</p>
                      </div>
                      <button onClick={() => deleteSubmission(sub.id)} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
               </div>
               {waitlist.length === 0 && <p className="text-center py-20 opacity-30 italic">Waitlist is empty.</p>}
            </div>
          )}

          {/* ... Other tabs ... */}
       </div>

       {localToast && (
         <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl animate-scale-in border border-white/10">
            <p className="font-black text-xs uppercase tracking-widest">{localToast}</p>
         </div>
       )}
    </div>
  );
};

export default AdminDashboard;
