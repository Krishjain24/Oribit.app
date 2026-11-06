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
import { VisualInspectModal, VisualInspectTarget } from './components/VisualInspectModal';
import { PlatformPage } from './pages/PlatformPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { BuildersPage } from './pages/BuildersPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { PricingPage } from './pages/PricingPage';
import { DocsPage } from './pages/DocsPage';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', '/admin');
        return '/admin';
      }
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(false);
  const [inspectTarget, setInspectTarget] = useState<VisualInspectTarget | null>(null);
  const [currentBuilderRole, setCurrentBuilderRole] = useState<'frontend' | 'fullstack' | 'teams'>('fullstack');

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminView = currentPath.startsWith('/admin');

  return (
    <div className="orbit-app">
      {isAdminView ? (
        <AdminDashboard onBackToWebsite={() => navigate('/')} />
      ) : (
        <>
          <Header
            currentPath={currentPath}
            onNavigate={navigate}
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
            onOpenAdmin={() => navigate('/admin')}
            isAdminView={false}
          />

          <main id="top" className="page-transition-wrapper">
            {currentPath === '/platform' && (
              <PlatformPage
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
                onNavigate={navigate}
              />
            )}

            {currentPath === '/workflow' && (
              <WorkflowPage
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
                onNavigate={navigate}
              />
            )}

            {currentPath === '/builders' && (
              <BuildersPage
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
                onNavigate={navigate}
                onSelectRole={(role) => setCurrentBuilderRole(role)}
              />
            )}

            {(currentPath === '/playground' || currentPath === '/studio') && (
              <PlaygroundPage
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
                onNavigate={navigate}
              />
            )}

            {currentPath === '/pricing' && (
              <PricingPage
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
                onOpenInquiry={() => setIsInquiryOpen(true)}
                onNavigate={navigate}
              />
            )}

            {currentPath === '/docs' && (
              <DocsPage
                onOpenWaitlist={() => setIsWaitlistOpen(true)}
                onNavigate={navigate}
              />
            )}

            {/* Fallback to Home if root or unknown route */}
            {currentPath !== '/platform' &&
              currentPath !== '/workflow' &&
              currentPath !== '/builders' &&
              currentPath !== '/playground' &&
              currentPath !== '/studio' &&
              currentPath !== '/pricing' &&
              currentPath !== '/docs' && (
                <>
                  <Hero
                    currentBuilderRole={currentBuilderRole}
                    onOpenWaitlist={() => setIsWaitlistOpen(true)}
                    onOpenQuickStart={() => setIsQuickStartOpen(true)}
                    onInspect={(target) => setInspectTarget(target)}
                  />
                  <CapabilityStrip />
                  <PlatformSection />
                  <WorkflowSection />
                  <BuildersSection onRoleChange={setCurrentBuilderRole} />
                  <ClosingSection
                    onOpenWaitlist={() => setIsWaitlistOpen(true)}
                    onOpenInquiry={() => setIsInquiryOpen(true)}
                  />
                </>
              )}
          </main>

          <Footer
            onOpenAdmin={() => navigate('/admin')}
            onNavigate={navigate}
          />
        </>
      )}

      {/* Global Modals */}
      <VisualInspectModal
        target={inspectTarget}
        onClose={() => setInspectTarget(null)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        onOpenAdmin={() => navigate('/admin')}
      />
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        onOpenAdmin={() => navigate('/admin')}
      />
      <QuickStartModal
        isOpen={isQuickStartOpen}
        onClose={() => setIsQuickStartOpen(false)}
      />
    </div>
  );
};

export default App;
