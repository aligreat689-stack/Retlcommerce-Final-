
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useSiteData } from '../store';

const FALLBACK_BLOG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, addSubmission } = useSiteData();
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const post = state.posts.find(p => p.id === id);
  const relatedPosts = state.posts.filter(p => p.category === post?.category && p.id !== post?.id).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      document.title = `${post.title} | ${state.config.siteName}`;
    }
  }, [post, state.config.siteName]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setIsSubmitting(true);
    
    // Log locally immediately
    addSubmission({
      name: 'Blog Subscriber',
      email: subscribeEmail,
      phone: 'N/A',
      service: 'Newsletter',
      message: `Subscribed while reading: ${post?.title}`
    });

    try {
      await fetch(`https://formsubmit.co/ajax/${state.config.contactEmail}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: subscribeEmail,
          _subject: `Newsletter Subscriber (Blog): ${subscribeEmail}`,
          _captcha: "false",
          message: `User subscribed while reading: ${post?.title}`
        })
      });

      setIsSubscribed(true);
      setSubscribeEmail('');
      setIsSubmitting(false);
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error) {
      console.warn("Newsletter sync failed, but subscriber saved locally.");
      setIsSubscribed(true);
      setSubscribeEmail('');
      setIsSubmitting(false);
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  if (!post) return <Navigate to="/blog" />;

  const wordsPerMinute = 200;
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <div className="pt-28 md:pt-32 pb-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
          
          <article className="lg:col-span-8 flex flex-col">
            <header className="space-y-6 mb-10">
              <nav className="flex items-center space-x-2 text-xs md:text-sm text-slate-400 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">Insights</Link>
                <i className="fas fa-chevron-right text-[10px]"></i>
                <span className="text-slate-900 dark:text-white font-bold">{post.category}</span>
              </nav>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight break-words">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-y-4 gap-x-8 py-6 border-y border-slate-100 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                     <img src={`https://ui-avatars.com/api/?name=${post.author}&background=70f0b8&color=1a1a2e`} alt={post.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Expert Consultant</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">
                    <i className="far fa-calendar-alt mr-2 text-teal-500"></i> {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">
                    <i className="far fa-clock mr-2 text-teal-500"></i> {readingTime} min read
                  </div>
                </div>
              </div>
            </header>

            <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/10] bg-slate-100 dark:bg-slate-800 mb-12">
              <img 
                src={post.image || FALLBACK_BLOG_IMAGE} 
                alt={post.title} 
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BLOG_IMAGE; }}
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg lg:text-xl space-y-8">
                <div className="font-bold text-slate-900 dark:text-white text-xl md:text-2xl lg:text-3xl leading-snug border-l-4 border-teal-400 pl-6 py-2 italic">
                  {post.excerpt}
                </div>
                
                {post.content.split('\n\n').map((paragraph, idx) => {
                  // Basic regex to turn [Title](URL) into clickable links for SEO sources
                  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                  const parts = paragraph.split(linkRegex);
                  
                  if (parts.length === 1) return <p key={idx} className="mb-6">{paragraph}</p>;

                  return (
                    <p key={idx} className="mb-6">
                      {parts.map((part, i) => {
                        if (i % 3 === 1) { // The link text
                          return (
                            <a 
                              key={i} 
                              href={parts[i+1]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-teal-600 dark:text-teal-400 font-black underline decoration-2 underline-offset-4 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              {part}
                            </a>
                          );
                        }
                        if (i % 3 === 2) return null; // Skip URL part as it's handled above
                        return part;
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
            
            {/* SEO Footnote */}
            <div className="mt-16 p-8 rounded-[35px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Retail E-commerce Strategy</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                This analysis is part of Retlcommerce's ongoing commitment to professionalizing the Pakistani retail market through data-driven insights and technical excellence.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
             <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center">
                  <span className="w-9 h-9 rounded-xl bg-teal-400 mr-3 flex items-center justify-center text-slate-900 text-xs font-black shadow-md">
                    <i className="fas fa-link"></i>
                  </span>
                  Related Insights
                </h3>
                <div className="space-y-8">
                   {relatedPosts.length > 0 ? relatedPosts.map(p => (
                     <Link key={p.id} to={`/blog/${p.id}`} className="group block space-y-3">
                        <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 shadow-sm">
                           <img 
                            src={p.image || FALLBACK_BLOG_IMAGE} 
                            alt={p.title} 
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BLOG_IMAGE; }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                           />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{p.category}</p>
                          <i className="fas fa-arrow-right text-[10px] text-teal-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"></i>
                        </div>
                     </Link>
                   )) : (
                     <p className="text-sm text-slate-400 italic">No related retail insights yet.</p>
                   )}
                </div>
             </div>

             {/* Sticky Newsletter */}
             <div className="sticky top-32 bg-slate-900 p-8 md:p-10 rounded-[45px] text-white overflow-hidden relative shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 blur-[80px] -mr-24 -mt-24"></div>
                <div className="relative z-10 space-y-6">
                   <div className="w-12 h-12 rounded-2xl bg-teal-400/20 flex items-center justify-center text-teal-400 text-xl border border-teal-400/20">
                     <i className="fas fa-paper-plane"></i>
                   </div>
                   <h3 className="text-2xl font-black leading-tight tracking-tight">Retlcommerce <br/><span className="text-teal-400">Inner Circle</span></h3>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">Join 5,000+ Pakistani retail leaders. Weekly e-commerce strategy delivered every Monday.</p>
                   
                   {isSubscribed ? (
                     <div className="bg-teal-400/20 text-teal-400 p-6 rounded-3xl text-center font-black animate-fadeIn border border-teal-400/30">
                       <i className="fas fa-check-circle mb-3 block text-3xl"></i>
                       Access Granted!
                     </div>
                   ) : (
                     <form className="space-y-4" onSubmit={handleSubscribe}>
                        <input 
                          required
                          type="email" 
                          value={subscribeEmail}
                          onChange={(e) => setSubscribeEmail(e.target.value)}
                          placeholder="Your professional email" 
                          className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-sm focus:ring-1 focus:ring-teal-400 outline-none text-white placeholder-slate-500 transition-all" 
                        />
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-4.5 rounded-2xl bg-teal-400 text-slate-900 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                        >
                          {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : 'Subscribe Now'}
                        </button>
                     </form>
                   )}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
