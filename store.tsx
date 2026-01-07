
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, SiteConfig, Service, BlogPost, TeamMember, Testimonial, ContactSubmission, Task } from './types';
import { INITIAL_STATE } from './constants';

interface SiteContextType {
  state: AppState;
  toast: string | null;
  setToast: (msg: string | null) => void;
  updateConfig: (config: SiteConfig) => void;
  updateServices: (services: Service[]) => void;
  updatePosts: (posts: BlogPost[]) => void;
  updateTeam: (team: TeamMember[]) => void;
  updateTasks: (tasks: Task[]) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  addSubmission: (submission: Omit<ContactSubmission, 'id' | 'date'>) => void;
  deleteSubmission: (id: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
  resetToDefaults: () => void;
  toggleDarkMode: () => void;
  updateAdminPassword: (newPass: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToastState] = useState<string | null>(null);

  const setToast = (msg: string | null) => {
    setToastState(msg);
    if (msg) setTimeout(() => setToastState(null), 4000);
  };

  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('retlcommerce_state');
      if (!saved) return INITIAL_STATE;
      const parsed = JSON.parse(saved);
      return { 
        ...INITIAL_STATE, 
        ...parsed, 
        submissions: parsed.submissions || [],
        isAuthenticated: parsed.isAuthenticated || false 
      };
    } catch (e) {
      console.error("Failed to parse local state:", e);
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem('retlcommerce_state', JSON.stringify({ ...state, isAuthenticated: state.isAuthenticated }));
  }, [state]);

  const updateConfig = (config: SiteConfig) => {
    setState(prev => ({ ...prev, config }));
  };

  const updateServices = (services: Service[]) => {
    setState(prev => ({ ...prev, services }));
  };

  const updatePosts = (posts: BlogPost[]) => {
    setState(prev => ({ ...prev, posts }));
  };

  const updateTeam = (team: TeamMember[]) => {
    setState(prev => ({ ...prev, team }));
  };

  const updateTasks = (tasks: Task[]) => {
    setState(prev => ({ ...prev, tasks }));
  };

  const updateTestimonials = (testimonials: Testimonial[]) => {
    setState(prev => ({ ...prev, testimonials }));
  };

  const addSubmission = (submission: Omit<ContactSubmission, 'id' | 'date'>) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setState(prev => ({ 
      ...prev, 
      submissions: [newSubmission, ...(prev.submissions || [])] 
    }));
  };

  const deleteSubmission = (id: string) => {
    setState(prev => ({ ...prev, submissions: (prev.submissions || []).filter(s => s.id !== id) }));
  };

  const login = (password: string) => {
    if (password === state.adminPassword) {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false }));
  };

  const resetToDefaults = () => {
    setState({ ...INITIAL_STATE, isAuthenticated: state.isAuthenticated });
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const updateAdminPassword = (newPass: string) => {
    setState(prev => ({ ...prev, adminPassword: newPass }));
  };

  return (
    <SiteContext.Provider value={{
      state,
      toast,
      setToast,
      updateConfig,
      updateServices,
      updatePosts,
      updateTeam,
      updateTasks,
      updateTestimonials,
      addSubmission,
      deleteSubmission,
      login,
      logout,
      resetToDefaults,
      toggleDarkMode,
      updateAdminPassword
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSiteData must be used within a SiteProvider');
  return context;
};
