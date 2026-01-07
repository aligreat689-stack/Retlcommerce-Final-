
import React from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSiteData } from '../store';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useSiteData();
  const navigate = useNavigate();
  
  const service = state.services.find(s => s.slug === slug);

  if (!service) return <Navigate to="/services" />;

  const handlePlanSelect = (planName: string) => {
    navigate('/contact', { state: { selectedService: service.title + ' - ' + planName } });
  };

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center space-x-2 text-xs md:text-sm text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
             <Link to="/services" className="hover:text-slate-900 dark:hover:text-white transition-colors font-medium">Services</Link>
             <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
             <span className="text-slate-900 dark:text-white font-bold">{service.title}</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-center lg:items-start mb-20 md:mb-24 text-center lg:text-left">
             <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-[28px] md:rounded-[35px] flex items-center justify-center text-3xl md:text-4xl shadow-2xl border border-white dark:border-white/10" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                <i className={service.icon}></i>
             </div>
             <div className="space-y-6 md:space-y-8 flex-grow">
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{service.title}</h1>
                <p className="text-base md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl font-medium">
                   {service.fullDescription}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 pt-2">
                   {service.benefits.map((benefit, i) => (
                     <div key={i} className="flex items-center space-x-2 md:space-x-3 bg-slate-50 dark:bg-slate-900 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-white/10">
                        <i className="fas fa-check-circle text-teal-500 dark:text-teal-400 text-xs md:text-base"></i>
                        <span>{benefit}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-24 md:mb-32">
             <div className="text-center mb-16 md:mb-20 space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Investment Tiers</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-medium px-4">Transparent local pricing in PKR tailored for Pakistani growth.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-stretch">
                {service.pricing.map((plan, i) => (
                  <div key={i} className={`flex flex-col p-8 md:p-12 rounded-[40px] md:rounded-[50px] border transition-all duration-300 hover:translate-y-[-8px] ${i === 1 ? 'border-teal-400 dark:border-teal-400 bg-white dark:bg-slate-900 shadow-xl relative z-10' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50'}`}>
                    {i === 1 && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-400 text-slate-900 px-5 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg">Most Popular</span>
                    )}
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="mb-8 border-b border-slate-200/60 dark:border-white/5 pb-8">
                       <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none">{plan.price}</span>
                       <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
                         {plan.name === 'Enterprise' || plan.name === 'Chain/Franchise' ? 'Custom Quote' : 'Monthly Starting Price'}
                       </p>
                    </div>
                    <ul className="space-y-5 mb-10 flex-grow">
                       {plan.features.map((feat, j) => (
                         <li key={j} className="flex items-start space-x-3 md:space-x-4 text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                            <i className="fas fa-check mt-1 md:mt-1.5 text-teal-500 dark:text-teal-400 text-xs md:text-sm"></i>
                            <span className="leading-tight text-left">{feat}</span>
                         </li>
                       ))}
                    </ul>
                    <button 
                      onClick={() => handlePlanSelect(plan.name)}
                      className={`block w-full text-center py-4 md:py-5 rounded-2xl md:rounded-[22px] font-black text-lg transition-all ${i === 1 ? 'bg-slate-900 dark:bg-teal-400 text-white dark:text-slate-900 hover:opacity-90 shadow-xl' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-slate-900 dark:hover:border-teal-400 text-slate-900 dark:text-white'}`}
                    >
                      Select {plan.name}
                    </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Process Section */}
          <div className="bg-slate-900 dark:bg-slate-900/80 rounded-[40px] md:rounded-[60px] p-10 md:p-28 text-white relative overflow-hidden border border-white/5">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" alt="Consultancy" className="w-full h-full object-cover" />
             </div>
             <div className="relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto space-y-3 md:space-y-4">
                   <h2 className="text-3xl md:text-5xl font-black tracking-tight">Execution Roadmap</h2>
                   <p className="text-slate-400 text-base md:text-lg font-medium">A standardized 5-step process to ensure quality and consistency.</p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-10 md:gap-0">
                   {service.process.map((step, i) => (
                     <div key={i} className="flex md:flex-col items-center gap-6 md:gap-0 relative z-10 w-full md:w-auto group">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[28px] bg-white/5 flex items-center justify-center shrink-0 text-2xl md:text-3xl font-black border border-white/10 group-hover:bg-teal-400 group-hover:text-slate-900 transition-all duration-500 shadow-xl">
                           {i + 1}
                        </div>
                        <div className="md:mt-8 text-left md:text-center flex-grow">
                          <h4 className="font-bold text-lg md:text-xl leading-tight tracking-tight">{step}</h4>
                        </div>
                        {/* Desktop lines */}
                        {i < service.process.length - 1 && (
                           <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t border-dashed border-white/20 -z-10"></div>
                        )}
                        {/* Mobile lines */}
                        {i < service.process.length - 1 && (
                          <div className="md:hidden absolute left-8 top-16 w-0.5 h-10 border-l border-dashed border-white/20"></div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
