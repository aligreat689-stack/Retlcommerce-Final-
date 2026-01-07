
import React, { useState } from 'react';
import { useSiteData } from '../store';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const { state } = useSiteData();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Consultancy', 'Design', 'Development', 'Marketing', 'Software'];

  const filteredServices = state.services.filter(s => 
    activeCategory === 'All' || s.category === activeCategory
  );

  return (
    <div className="pt-28 md:pt-32 pb-20 md:pb-24 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Expert Solutions</h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 font-medium px-4">
            End-to-end retail and branding ecosystems designed for modern commerce growth in Pakistan.
          </p>
          
          {/* Category Filter */}
          <div className="flex items-center overflow-x-auto no-scrollbar md:flex-wrap md:justify-center gap-3 pt-6 md:pt-8 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
             {categories.map(cat => (
               <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${activeCategory === cat ? 'bg-slate-900 dark:bg-teal-400 text-white dark:text-slate-900 border-slate-900 dark:border-teal-400 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-white/10'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="group flex flex-col p-8 md:p-10 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 md:w-32 md:h-32 bg-slate-50 dark:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-[18px] md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-transform group-hover:scale-110 shadow-lg" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                <i className={`${service.icon} text-xl md:text-2xl`}></i>
              </div>
              
              <div className="flex-grow space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{service.category}</span>
                  {service.isComingSoon && <span className="bg-teal-100 dark:bg-teal-400/20 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Waitlist</span>}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">{service.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
                  {service.description}
                </p>
                
                <div className="pt-4 md:pt-6 border-t border-slate-50 dark:border-white/5 mt-auto">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400">Starts from</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{service.pricing[0].price}</span>
                   </div>
                </div>
              </div>

              <Link 
                to={`/services/${service.slug}`} 
                className="mt-6 md:mt-8 py-4 rounded-2xl font-black text-center border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white group-hover:bg-slate-900 dark:group-hover:bg-teal-400 group-hover:text-white dark:group-hover:text-slate-900 transition-all text-sm md:text-base active:scale-95"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 md:mt-32 p-10 md:p-20 bg-slate-900 dark:bg-slate-900/50 rounded-[40px] md:rounded-[50px] text-white overflow-hidden relative border border-white/5">
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
              <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                 <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Why trust Retlcommerce?</h2>
                 <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                   We've built many brands successfully across Pakistan. Our unique blend of local retail strategy and tech implementation ensures your brand performs at scale.
                 </p>
                 <Link to="/contact" className="inline-block px-10 py-4 rounded-2xl font-black text-slate-900 transition-all hover:scale-105 shadow-xl active:scale-95" style={{ backgroundColor: state.config.primaryColor }}>
                    Get Started Today
                 </Link>
              </div>
              <div className="space-y-6 md:space-y-8">
                 {[
                   { q: "Can I combine multiple services?", a: "Yes! Most of our clients opt for our 'Full Brand Ecosystem' package which combines consultancy, design, and web development." },
                   { q: "Do you offer custom pricing for large enterprises?", a: "Absolutely. We provide tailored proposals for enterprise-scale operations with specific needs." },
                   { q: "Is maintenance included in web development?", a: "We offer dedicated maintenance tiers to ensure your platform remains secure and optimized post-launch." }
                 ].map((faq, i) => (
                   <div key={i} className="space-y-3 border-b border-white/10 pb-6 last:border-0">
                      <h4 className="font-bold text-xl md:text-2xl tracking-tight text-white">{faq.q}</h4>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">{faq.a}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
