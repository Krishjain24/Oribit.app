import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CapabilityStrip } from './components/CapabilityStrip';
import { PlatformSection } from './components/PlatformSection';
import { WorkflowSection } from './components/WorkflowSection';
import { BuildersSection } from './components/BuildersSection';
import { ClosingSection } from './components/ClosingSection';
import { Footer } from './components/Footer';
import { WaitlistModal } from './components/WaitlistModal';
import { InquiryModal } from './components/InquiryModal';
import { QuickStartModal } from './components/QuickStartModal';
import { AdminDashboard } from './components/AdminDashboard';

export const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      window.history.replaceState(null, '', '/admin');
      return true;
    }
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  });

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(false);
  const [currentBuilderRole, setCurrentBuilderRole] = useState<'frontend' | 'fullstack' | 'teams'>('fullstack');

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="orbit-app">
      {isAdminView ? (
        <AdminDashboard onBackToWebsite={closeAdmin} />
      ) : (
        <>
          <Header
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
            onOpenAdmin={openAdmin}
            isAdminView={false}
          />
          <main id="top">
            <Hero
              currentBuilderRole={currentBuilderRole}
              onOpenWaitlist={() => setIsWaitlistOpen(true)}
              onOpenQuickStart={() => setIsQuickStartOpen(true)}
            />
            <CapabilityStrip />
            <PlatformSection />
            <WorkflowSection />
            <BuildersSection onRoleChange={setCurrentBuilderRole} />
            <ClosingSection
              onOpenWaitlist={() => setIsWaitlistOpen(true)}
              onOpenInquiry={() => setIsInquiryOpen(true)}
            />
          </main>
          <Footer
            onOpenAdmin={openAdmin}
          />
        </>
      )}

      {/* Global Modals */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        onOpenAdmin={openAdmin}
      />
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        onOpenAdmin={openAdmin}
      />
      <QuickStartModal
        isOpen={isQuickStartOpen}
        onClose={() => setIsQuickStartOpen(false)}
      />
    </div>
  );
};

export default App;
