
import React, { useState } from 'react';
import { useSiteData } from '../store';
import { Link } from 'react-router-dom';

const FALLBACK_BLOG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800";

const Blog: React.FC = () => {
  const { state } = useSiteData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(state.posts.map(post => post.category))];

  const filteredPosts = state.posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Insights & Trends</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
            Expert commentary on the shifting landscape of retail and branding with Retlcommerce.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0 px-2 lg:px-0">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === cat 
                  ? 'bg-slate-900 dark:bg-teal-400 text-white dark:text-slate-900 border-slate-900 dark:border-teal-400 shadow-lg' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search strategy articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-100 dark:border-white/10 focus:ring-2 focus:outline-none transition-all shadow-sm"
              // Fix: Use --tw-ring-color for dynamic Tailwind ring color instead of non-existent ringColor property
              style={{ '--tw-ring-color': state.config.primaryColor } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredPosts.map(post => (
            <article key={post.id} className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500">
              {/* Image Container */}
              <div className="aspect-[16/10] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img 
                  src={post.image || FALLBACK_BLOG_IMAGE} 
                  alt={post.title} 
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BLOG_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-teal-400 shadow-sm border border-black/5 dark:border-white/5">
                  {post.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-grow p-6 md:p-8 lg:p-9 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                   <span className="flex items-center"><i className="far fa-calendar-alt mr-1.5"></i> {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   <span className="opacity-30">•</span>
                   <span className="flex items-center"><i className="far fa-user mr-1.5"></i> {post.author}</span>
                </div>

                <div className="flex-grow space-y-3">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight break-words line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base font-medium line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-6 border-t border-slate-50 dark:border-white/5">
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center font-black text-sm uppercase tracking-widest text-slate-900 dark:text-teal-400 group/link">
                    <span>Read Full Insight</span>
                    <i className="fas fa-arrow-right ml-2.5 transition-transform group-hover/link:translate-x-1.5"></i>
                  </Link>
                </div>
              </div>
            </article>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-24 text-center">
               <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fas fa-search-minus text-4xl text-slate-200 dark:text-slate-800"></i>
               </div>
               <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-600">No matching strategy articles found.</h3>
               <button onClick={() => {setSearchTerm(''); setActiveCategory('All');}} className="mt-4 text-teal-500 font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
