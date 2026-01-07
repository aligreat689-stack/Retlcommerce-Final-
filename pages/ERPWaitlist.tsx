
import React, { useState } from 'react';
import { useSiteData } from '../store';

const ERPWaitlist: React.FC = () => {
  const { state, addSubmission, setToast } = useSiteData();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    // 1. Always store locally so it appears in Admin Panel Waitlist section immediately
    addSubmission({
      name: 'ERP Waitlist User',
      email: email,
      phone: 'N/A',
      service: 'ERP Software',
      message: 'Joined early access waitlist for Summer 2026 launch.'
    });

    try {
      // 2. Attempt external sync
      await fetch("https://formsubmit.co/ajax/retlcommerce@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: `ERP Waitlist Signup: ${email}`,
          _captcha: "false",
          message: `User requested early access to the retail ERP platform.`
        })
      });
    } catch (error) {
      // Catch "Failed to fetch" - purely network/ad-blocker level, still success as data is safe locally
      console.warn("External sync bypassed. Lead captured locally for Admin review.", error);
    } finally {
      // 3. Show global popup message and reset
      setIsSubmitting(false);
      setEmail('');
      setToast('Successfully registered for early access. Welcome aboard!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
        <div className="space-y-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-teal-400 text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">Coming Summer 2026</span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            The Only ERP Your <span className="text-teal-400">Retail Brand</span> Ever Needs
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Integrated inventory, sales, and supply chain management designed specifically for modern direct-to-consumer brands.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
            <form onSubmit={handleWaitlist} className="bg-slate-800 p-8 md:p-10 rounded-[40px] shadow-2xl space-y-6 border border-white/5">
               <h3 className="text-2xl font-black uppercase tracking-tight">Join the Early Access List</h3>
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-slate-900 text-white border-none outline-none focus:ring-2 focus:ring-teal-400 transition-all font-bold" 
                    placeholder="Enter your email" 
                  />
               </div>
               <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-teal-400 text-slate-900 font-black text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
               >
                 {isSubmitting ? <><i className="fas fa-circle-notch fa-spin mr-3"></i> Syncing...</> : 'Subscribe Now'}
               </button>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Leads are managed via retlcommerce@gmail.com</p>
            </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
           {[
             { icon: "fa-warehouse", label: "Inventory" },
             { icon: "fa-calculator", label: "Accounting" },
             { icon: "fa-shipping-fast", label: "Logistics" },
             { icon: "fa-users", label: "CRM" }
           ].map((feat, i) => (
             <div key={i} className="space-y-3">
                <i className={`fas ${feat.icon} text-2xl text-teal-400`}></i>
                <p className="font-black text-[10px] uppercase tracking-widest">{feat.label}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ERPWaitlist;
