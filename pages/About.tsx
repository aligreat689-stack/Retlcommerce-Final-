
import React from 'react';
import { useSiteData } from '../store';

const About: React.FC = () => {
  const { state } = useSiteData();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Our Mission</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Empowering the next generation of Pakistani brands with high-performance retail strategies and digital excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-32">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">Redefining Retail</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Retlcommerce was founded to bridge the gap between traditional retail and the modern digital ecosystem. Most brands in Pakistan face unique challenges—from supply chain fragmentation to payment friction. We solve these by providing a cohesive technical and operational foundation.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Our team operates at the intersection of brand building, product sourcing, and software engineering. We don't just advise; we build the infrastructure that allows Pakistani founders to scale their vision globally.
            </p>
          </div>
          <div className="relative rounded-[50px] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" alt="Retlcommerce Strategic Vision" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-teal-400/10 mix-blend-multiply"></div>
          </div>
        </div>

        {/* Vision 2026 Section */}
        <div className="mb-32 relative group">
           <div className="absolute inset-0 bg-slate-900 rounded-[50px] transform transition-transform group-hover:scale-[1.01] duration-500"></div>
           <div className="relative z-10 p-10 md:p-20 text-center space-y-8 overflow-hidden rounded-[50px]">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 blur-[100px] -mr-32 -mt-32"></div>
              
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                 <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                 <span className="text-xs font-black uppercase tracking-[0.2em] text-teal-400">Strategic Roadmap</span>
              </div>
              
              <h2 className="text-3xl md:text-6xl font-black text-white leading-tight">
                Vision 2026: <br/> 
                <span style={{ color: state.config.primaryColor }}>The Future of Commerce.</span>
              </h2>
              
              <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
                Retlcommerce is scaling operations for a monumental market-wide launch in <span className="text-white font-bold">2026</span>. We are building the most advanced retail ecosystem ever seen in Pakistan.
              </p>
           </div>
        </div>

        {/* Team Leadership Section */}
        <div className="mb-20">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Director Ecosystem</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium">The visionary force nodes behind Retlcommerce.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {state.team.map(member => (
              <div key={member.id} className="group bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[50px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                <div className="relative rounded-[50px] overflow-hidden w-56 h-56 md:w-72 md:h-72 mb-10 shadow-2xl border-8 border-slate-50 dark:border-slate-800/50">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-6 max-w-sm">
                  <div>
                    <h4 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{member.name}</h4>
                    <p className="text-teal-600 dark:text-teal-400 font-black uppercase tracking-[0.2em] text-[11px] md:text-xs mt-3">{member.position}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic text-base md:text-lg">"{member.bio}"</p>
                  
                  {/* Social Grid with improved styling matching reference */}
                  <div className="flex flex-wrap justify-center gap-3 pt-6">
                     <a href={`mailto:${member.email}`} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5" title="Email">
                       <i className="fas fa-envelope text-lg"></i>
                     </a>
                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5" title="LinkedIn">
                       <i className="fab fa-linkedin-in text-lg"></i>
                     </a>
                     {member.whatsapp && (
                       <a href={`https://wa.me/${member.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5" title="WhatsApp">
                        <i className="fab fa-whatsapp text-lg"></i>
                       </a>
                     )}
                     {member.twitter && (
                       <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white dark:text-teal-400 hover:bg-slate-700 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-xl" title="X (Twitter)">
                        <i className="fa-brands fa-x-twitter text-lg"></i>
                       </a>
                     )}
                     {member.facebook && (
                       <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5" title="Facebook">
                        <i className="fab fa-facebook-f text-lg"></i>
                       </a>
                     )}
                     {member.instagram && (
                       <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5" title="Instagram">
                        <i className="fab fa-instagram text-lg"></i>
                       </a>
                     )}
                     {member.tiktok && (
                       <a href={member.tiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5" title="TikTok">
                        <i className="fab fa-tiktok text-lg"></i>
                       </a>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
