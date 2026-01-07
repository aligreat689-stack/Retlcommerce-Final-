
import React, { useEffect } from 'react';
import { useSiteData } from '../store';

const TermsOfConditions: React.FC = () => {
  const { state } = useSiteData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Terms & Conditions</h1>
            <p className="text-slate-500 font-medium">Effective Date: January 1, 2026</p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Agreement to Terms</h2>
              <p>
                By accessing Retlcommerce.com, you agree to be bound by these Terms and Conditions and all applicable laws and regulations in Pakistan. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Service Description</h2>
              <p>
                Retlcommerce provides brand consultancy, design, e-commerce development, and retail software solutions. All services are subject to separate formal agreements signed between the client and Retlcommerce.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. Intellectual Property</h2>
              <p>
                The content, logos, designs, and software on this website are the intellectual property of Retlcommerce unless otherwise stated. You may not reproduce, distribute, or create derivative works without express written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. User Conduct</h2>
              <p>
                Users agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the site for any fraudulent or illegal activity.</li>
                <li>Attempt to gain unauthorized access to our ERP waitlist or server systems.</li>
                <li>Scrape content from our blog or insights sections for commercial use.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">5. Limitation of Liability</h2>
              <p>
                Retlcommerce shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the services described on this website. Our total liability is limited to the amount paid for any specific service in question.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">7. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. You irrevocably submit to the exclusive jurisdiction of the courts in Karachi.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfConditions;
