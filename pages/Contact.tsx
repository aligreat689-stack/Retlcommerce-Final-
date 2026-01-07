
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteData } from '../store';

const Contact: React.FC = () => {
  const { state, addSubmission } = useSiteData();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: 'Consultancy', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Handle pre-filling service from ServiceDetail navigation
    if (location.state && (location.state as any).selectedService) {
      setForm(prev => ({ ...prev, service: (location.state as any).selectedService }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 1. Always save locally first to ensure it shows up in the admin panel immediately
    addSubmission({ ...form });

    try {
      // 2. Attempt to send real email via FormSubmit
      const response = await fetch(`https://formsubmit.co/ajax/${state.config.contactEmail}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          _subject: `New Inquiry from ${form.name} - Retlcommerce`,
          _captcha: "false",
          _template: 'table'
        })
      });

      // Handle response even if it's not ok but didn't throw (e.g. 404)
      console.log("Sync Status:", response.status);
    } catch (error) {
      // Catch "Failed to fetch" (Network/Ad-blocker errors)
      console.warn("External sync paused by browser security/network. Local record successfully created.", error);
    } finally {
      // 3. Always show success and reset form because local save is confirmed
      setIsSubmitting(false);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', service: 'Consultancy', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const inputClasses = "w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-none outline-none focus:ring-2 transition-colors";

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">Let's Talk</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Have a project in mind? We'd love to hear from you. All inquiries are received at <span className="text-teal-600 dark:text-teal-400 font-bold">{state.config.contactEmail}</span>. Our team typically responds within 24 hours.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
               <a href={`mailto:${state.config.contactEmail}`} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Email Us</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm break-all font-medium">{state.config.contactEmail}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-bold">Priority Response Channel</p>
               </a>
               <a href={`tel:${state.config.contactPhone}`} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Call Us</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{state.config.contactPhone}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-bold">Mon-Fri, 9am - 6pm</p>
               </a>
               <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 sm:col-span-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Location</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{state.config.address}</p>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Follow Our Journey</h4>
               <div className="flex space-x-4">
                  {Object.entries(state.config.socialLinks).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all text-slate-600 dark:text-slate-400">
                      <i className={`fab fa-${platform}`}></i>
                    </a>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/5">
             {success ? (
               <div className="text-center py-20 space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-400/10 text-green-600 dark:text-green-400 flex items-center justify-center text-4xl mx-auto shadow-inner">
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Inquiry Received!</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Thank you for reaching out. We have logged your request and our team will contact you from <span className="font-bold">{state.config.contactEmail}</span> very soon.</p>
                  <button onClick={() => setSuccess(false)} className="text-sm font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 hover:underline">Submit another request</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClasses} style={{ ringColor: state.config.primaryColor }} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClasses} style={{ ringColor: state.config.primaryColor }} placeholder="john@example.com" />
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                      <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClasses} style={{ ringColor: state.config.primaryColor }} placeholder="+92 000 0000000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Service Interest</label>
                      <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} className={inputClasses} style={{ ringColor: state.config.primaryColor }}>
                        {state.services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={`${inputClasses} resize-none`} style={{ ringColor: state.config.primaryColor }} placeholder="Describe your project goals..."></textarea>
                 </div>
                 <button 
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}
                 >
                   {isSubmitting ? <><i className="fas fa-circle-notch fa-spin mr-3"></i> Processing...</> : 'Send Inquiry'}
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
