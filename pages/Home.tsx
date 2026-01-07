
import React, { useEffect } from 'react';
import { useSiteData } from '../store';
import { Link } from 'react-router-dom';

const FALLBACK_BLOG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800";

const Home: React.FC = () => {
  const { state } = useSiteData();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-24 pb-12 md:pt-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full opacity-10 blur-[60px] md:blur-[120px]" style={{ backgroundColor: state.config.primaryColor }}></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full opacity-10 blur-[60px] md:blur-[120px]" style={{ backgroundColor: '#2d3047' }}></div>

        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
          <div className="space-y-6 md:space-y-10 animate-fade-in-up text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
              Create & Run Your <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${state.config.primaryColor}, #2d3047)` }}>Brand</span> With Retlcommerce
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              We provide the strategic brand consultancy and technical execution needed for the next generation of retailers in Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4 px-4 sm:px-0">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-2xl transition-all text-center hover:scale-105 active:scale-95"
                style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}
              >
                Get in touch
              </Link>
              <Link 
                to="/services" 
                className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm hover:border-slate-900 dark:hover:border-teal-400 transition-all text-center"
              >
                Our Services
              </Link>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-12 pt-8 border-t border-slate-200 dark:border-white/10 opacity-0 animate-fade-in-up [animation-delay:400ms]">
              <div className="text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">Expert</p>
                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400">Consultancy</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">Karachi</p>
                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400">Hub</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">Local</p>
                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400">Expertise</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative animate-slide-in-right">
             <div className="relative z-20 rounded-[50px] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.01]">
               <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000" alt="Retlcommerce Strategic Workspace" className="w-full h-auto object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
               <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
                  <p className="text-white text-lg font-medium italic">"Building a brand in Pakistan is complex. Retlcommerce made it look easy. They are the true partners of growth."</p>
                  <p className="text-teal-300 font-bold mt-4">— Founder, ModernRetail PK</p>
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-800 p-6 rounded-[30px] shadow-2xl z-30 flex items-center space-x-4 border border-slate-100 dark:border-white/10 animate-bounce-slow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                  <i className="fas fa-chart-line"></i>
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase text-slate-400">Results Focused</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white">Growth Methodology</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="reveal flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-20 gap-6 text-center md:text-left">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">Solutions Built for Scaling.</h2>
              <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-medium">
                Whether you're launching your first product in Faisalabad or expanding your outlet in Karachi, we provide the leverage you need.
              </p>
            </div>
            <Link to="/services" className="w-full md:w-auto px-8 py-4 rounded-xl font-bold bg-slate-900 dark:bg-teal-400 text-white dark:text-slate-900 transition-all text-center text-sm md:text-base">
              Explore All <i className="fas fa-arrow-right ml-2 text-xs"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {state.services.slice(0, 4).map((service, idx) => (
              <div key={service.id} className="reveal group p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl duration-500 text-center sm:text-left" style={{ transitionDelay: `${idx * 150}ms` }}>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[16px] md:rounded-[24px] flex items-center justify-center mb-6 mx-auto sm:mx-0 shadow-lg group-hover:rotate-6 transition-transform" style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}>
                  <i className={`${service.icon} text-lg md:text-2xl`}></i>
                </div>
                <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                  {service.description}
                </p>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center font-bold text-xs md:text-sm group-hover:underline text-slate-900 dark:text-teal-400">
                  Learn More <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 md:py-32 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 md:px-6">
           <div className="reveal text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Retail Insights & Strategy</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Expert advice on brand building and e-commerce in Pakistan.</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {state.posts.slice(0, 4).map((post, idx) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="reveal group flex flex-col h-full bg-white dark:bg-slate-900 rounded-[35px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-300" style={{ transitionDelay: `${idx * 150}ms` }}>
                   <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      <img 
                        src={post.image || FALLBACK_BLOG_IMAGE} 
                        alt={post.title} 
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BLOG_IMAGE; }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                   </div>
                   <div className="p-6 md:p-7 flex flex-col flex-grow space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">{post.category}</span>
                      <div className="flex-grow space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-2 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors break-words">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 font-medium leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="pt-4 mt-auto border-t border-slate-50 dark:border-white/5 flex items-center font-black text-[10px] uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                        Read Story <i className="fas fa-arrow-right ml-2 text-[10px] transition-transform group-hover:translate-x-1.5" style={{ color: state.config.primaryColor }}></i>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
           <div className="reveal bg-slate-900 dark:bg-slate-900 rounded-[32px] md:rounded-[70px] p-8 md:p-32 text-center relative overflow-hidden border border-white/5 shadow-3xl">
              <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[600px] md:h-[600px] blur-[80px] md:blur-[150px] rounded-full opacity-10" style={{ backgroundColor: state.config.primaryColor }}></div>
              <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-blue-500/10 blur-[80px] md:blur-[150px] rounded-full"></div>
              
              <div className="relative z-10 max-w-4xl mx-auto space-y-6 md:space-y-12">
                 <h2 className="text-2xl md:text-7xl font-black text-white leading-tight">Create & Run Your Brand with <span style={{ color: state.config.primaryColor }}>Retlcommerce.</span></h2>
                 <p className="text-sm md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                   Ditch the guesswork. Partner with Pakistan's leading brand consultancy.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 pt-4">
                    <Link to="/contact" className="w-full sm:w-auto px-8 py-4 md:px-14 md:py-6 rounded-2xl md:rounded-[28px] bg-teal-400 text-slate-900 font-black text-base md:text-xl hover:scale-105 transition-transform shadow-2xl" style={{ backgroundColor: state.config.primaryColor }}>
                      Get in touch
                    </Link>
                    <Link to="/about" className="text-white font-bold text-sm md:text-lg hover:text-teal-400 transition-colors">How we work <i className="fas fa-arrow-right ml-2 text-xs md:text-sm"></i></Link>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
