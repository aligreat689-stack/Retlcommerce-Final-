
import React, { useState, useEffect } from 'react';
import { useSiteData } from '../store';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { state, toggleDarkMode } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('twitter') || lower === 'x') return 'fa-brands fa-x-twitter';
    if (lower.includes('linkedin')) return 'fab fa-linkedin-in';
    return `fab fa-${lower}`;
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full transition-all duration-500 z-[1200] ${
          scrolled || isOpen 
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm py-3 md:py-4 border-b border-slate-100 dark:border-white/5' 
          : 'bg-transparent py-5 md:py-7'
        }`}
      >
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group relative z-[1300]">
            {state.config.logoImage ? (
              <img 
                src={state.config.logoImage} 
                alt={state.config.siteName} 
                className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg"
                style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}
              >
                {state.config.logoText}
              </div>
            )}
            <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              {state.config.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 mr-6">
              {menuItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`px-5 py-2 rounded-full transition-all font-bold text-sm xl:text-base ${
                    location.pathname === item.path 
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-white/10 pl-6">
              <button 
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition-all hover:scale-110 active:scale-95 shadow-sm"
                aria-label="Toggle Theme"
              >
                <i className={`fas ${state.isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <Link 
                to="/contact" 
                className="px-6 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105 shadow-xl active:scale-95 whitespace-nowrap"
                style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}
              >
                Book a Call
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center space-x-3 lg:hidden relative z-[1300]">
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 transition-all"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${state.isDarkMode ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
            </button>
            <button 
              className={`w-10 h-10 flex flex-col justify-center items-center outline-none rounded-full transition-all shadow-lg relative active:scale-90 ${isOpen ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-900 dark:bg-teal-400'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-900 dark:bg-white rotate-45 translate-y-[7px]' : 'bg-white dark:bg-slate-900'}`}></span>
                <span className={`block w-5 h-0.5 rounded-full transition-all duration-200 ${isOpen ? 'opacity-0' : 'bg-white dark:bg-slate-900 opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-900 dark:bg-white -rotate-45 -translate-y-[7px]' : 'bg-white dark:bg-slate-900'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[1100] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.85, 0, 0.15, 1)] ${
          isOpen ? 'translate-y-0 opacity-100 visible pointer-events-auto' : '-translate-y-full opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-white dark:bg-slate-950"></div>
        
        <div className="relative h-full flex flex-col px-8 pt-28 pb-12 sm:px-12">
          {/* Main Navigation Links */}
          <div className="flex-grow flex flex-col justify-center">
            <div className="space-y-0">
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`group flex items-center justify-between py-6 border-b border-slate-100 dark:border-white/5 transition-all duration-500 ${
                      isOpen ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                    }`}
                    style={{ transitionDelay: `${idx * 70}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`text-5xl font-black tracking-tighter transition-colors ${
                      isActive 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-300 dark:text-slate-800'
                    }`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <i className="fas fa-arrow-right text-2xl" style={{ color: state.config.primaryColor }}></i>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Branding & Socials */}
          <div className={`mt-auto pt-10 transition-all duration-700 delay-500 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
             <div className="flex flex-wrap gap-4 mb-10">
               {Object.entries(state.config.socialLinks).map(([platform, url]) => (
                 <a key={platform} href={url} target="_blank" rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-900 dark:hover:bg-teal-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-white/5">
                   <i className={`${getPlatformIcon(platform)} text-xl`}></i>
                 </a>
               ))}
             </div>
             <div className="space-y-1.5 pt-8">
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Inquiry Line</p>
               <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-all tracking-tight">
                 {state.config.contactEmail}
               </p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer: React.FC = () => {
  const { state, addSubmission, setToast } = useSiteData();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const year = 2026;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    addSubmission({
      name: 'Newsletter Subscriber',
      email: email,
      phone: 'N/A',
      service: 'Newsletter',
      message: 'New subscription request from the website footer.'
    });

    try {
      await fetch(`https://formsubmit.co/ajax/${state.config.contactEmail}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: `Newsletter Signup: ${email}`,
          _captcha: "false",
          message: `User signed up for the newsletter from the website footer.`
        })
      });
    } catch (error) {
      console.warn("External sync failed, captured locally.");
    } finally {
      setIsSubmitting(false);
      setEmail('');
      setToast('Subscription successful! You are now in our ecosystem.');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('twitter') || lower === 'x') return 'fa-brands fa-x-twitter';
    if (lower.includes('linkedin')) return 'fab fa-linkedin-in';
    return `fab fa-${lower}`;
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              {state.config.footerLogoImage ? (
                <img 
                  src={state.config.footerLogoImage} 
                  alt={state.config.siteName} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-lg"
                  style={{ backgroundColor: state.config.primaryColor }}
                >
                  {state.config.logoText}
                </div>
              )}
              <span className="text-2xl font-black text-white tracking-tighter">{state.config.siteName}</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              {state.config.tagline}. We empower Pakistani brands with localized strategic solutions and cutting-edge digital infrastructure.
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(state.config.socialLinks).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                  <i className={`${getPlatformIcon(platform)} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Sitemap</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link to="/about" className="hover:text-white transition-colors">Vision</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Insights</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/erp-waitlist" className="text-teal-400 hover:text-white transition-colors">ERP 2026</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 bg-white/5 p-8 rounded-[35px] border border-white/10">
            <h4 className="text-white font-black mb-2 text-xl tracking-tight">Strategy Brief</h4>
            <p className="text-xs mb-6 font-medium leading-relaxed">Join our exclusive circle for early access to retail strategy insights before our 2026 launch.</p>
            
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full bg-slate-900/50 border border-white/10 px-5 py-3.5 rounded-2xl focus:ring-1 focus:ring-teal-400 outline-none text-xs text-white placeholder-slate-600"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl font-black text-xs transition-all hover:opacity-90 active:scale-95 shadow-xl disabled:opacity-50"
                style={{ backgroundColor: state.config.primaryColor, color: state.config.secondaryColor }}
              >
                {isSubmitting ? 'Syncing...' : 'Subscribe Now'}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-medium space-y-4 md:space-y-0 opacity-40">
          <p>&copy; {year} {state.config.siteName}. Designed & Developed in Karachi.</p>
          <div className="flex items-center space-x-6">
            <span>Powered by RetlSystem v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, toast, setToast } = useSiteData();

  useEffect(() => {
    if (state.config.faviconImage) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = state.config.faviconImage;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [state.config.faviconImage]);

  return (
    <div className={`${state.isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col selection:bg-teal-100 selection:text-teal-900 bg-white dark:bg-slate-950 transition-colors duration-300 relative">
        <Header />
        <main className="flex-grow pt-[70px] md:pt-[90px]">
          {children}
        </main>
        <Footer />
        <ScrollToTopButton />

        {/* Global Toast / Popup Message */}
        {toast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-md animate-scale-in">
             <div className="bg-slate-900 dark:bg-teal-400 text-white dark:text-slate-900 p-6 rounded-[30px] shadow-3xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <i className="fas fa-check"></i>
                  </div>
                  <p className="font-bold text-sm tracking-tight">{toast}</p>
                </div>
                <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity p-2">
                   <i className="fas fa-times"></i>
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const { state } = useSiteData();
  const [scrollVisible, setScrollVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrollVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white z-[800] transition-all duration-500 hover:scale-110 active:scale-90 group ${scrollVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-50'}`}
      style={{ backgroundColor: state.isDarkMode ? state.config.primaryColor : '#0f172a', color: state.isDarkMode ? state.config.secondaryColor : 'white' }}
    >
      <span className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none" style={{ backgroundColor: state.config.primaryColor }}></span>
      <i className="fas fa-arrow-up text-sm transition-transform group-hover:-translate-y-0.5"></i>
    </button>
  );
};

export default Layout;
