
import React, { useEffect } from 'react';
import { useSiteData } from '../store';

const PrivacyPolicy: React.FC = () => {
  const { state } = useSiteData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">Last updated: January 2026</p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Introduction</h2>
              <p>
                Retlcommerce ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our brand consultancy services in Pakistan in 2026.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us through our contact forms, waitlists, and consultation bookings. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and Contact Information (Email, Phone Number)</li>
                <li>Business Details (Brand name, industry, scale of operations)</li>
                <li>Strategic interests (Sourcing, Design, ERP requirements)</li>
                <li>Any other information you choose to provide in your messages.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. How We Use Your Information</h2>
              <p>We use the collected data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our consultancy and technical services.</li>
                <li>Communicate with you regarding your inquiries or project status.</li>
                <li>Send you newsletters and retail insights (only if you opt-in).</li>
                <li>Manage our ERP early access waitlist.</li>
                <li>Improve our website and user experience.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. Data Security</h2>
              <p>
                We implement robust security measures to protect your data. However, please note that no method of transmission over the internet or electronic storage is 100% secure. Given the strategic nature of retail consultancy, we treat all client data as strictly confidential.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">7. Contact Us</h2>
              <p>
                If you have questions about this policy, please reach out to our team at:
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 inline-block">
                <p className="font-bold text-slate-900 dark:text-white">Retlcommerce Compliance Team</p>
                <p className="text-teal-600 dark:text-teal-400 font-black">{state.config.contactEmail}</p>
                <p className="text-slate-500 dark:text-slate-500 font-medium">{state.config.address}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
