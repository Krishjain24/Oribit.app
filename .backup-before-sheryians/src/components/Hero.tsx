import React, { useState } from 'react';
import { AgentService } from '../services/agentService';
import { AgentStep } from '../types';

interface HeroProps {
  currentBuilderRole?: string;
  onOpenWaitlist?: () => void;
  onOpenQuickStart?: () => void;
  onInspect?: (target: any) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentBuilderRole = 'fullstack',
  onOpenWaitlist,
  onInspect,
}) => {
  const [prompt, setPrompt] = useState(
    'Give the product page a calmer layout and make the gallery feel more immersive.'
  );
  const [projectName, setProjectName] = useState('atlas / storefront-refresh');
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([
    {
      step_number: 1,
      title: 'Plan ready',
      description: 'Mapped the page structure',
      status: 'done',
      time_label: '2m',
    },
    {
      step_number: 2,
      title: 'Building gallery',
      description: 'Updating 3 components',
      status: 'active',
      time_label: 'now',
    },
    {
      step_number: 3,
      title: 'Check in browser',
      description: 'Waiting for build',
      status: 'pending',
      time_label: '—',
    },
  ]);

  const handleRunAgent = () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);

    setTimeout(() => {
      const result = AgentService.simulateDemo(prompt, currentBuilderRole);
      setSteps(result.steps);
      setProjectName(result.project_name);
      setIsRunning(false);
    }, 450);
  };

  const handleSelectSamplePrompt = (sampleText: string) => {
    setPrompt(sampleText);
    setIsRunning(true);
    setTimeout(() => {
      const result = AgentService.simulateDemo(sampleText, currentBuilderRole);
      setSteps(result.steps);
      setProjectName(result.project_name);
      setIsRunning(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunAgent();
    }
  };

  const openHeroInspect = () => {
    if (onInspect) {
      onInspect({
        id: 'hero-workspace',
        title: 'Orbit Autonomous Workspace Console',
        subtitle: `${projectName} • Multi-Agent Orchestration Engine`,
        category: 'workspace',
        summary: `Interactive multi-agent canvas showing real-time prompt decomposition, AST tree-sitter code indexing, and continuous headless browser verification loops for "${prompt}".`,
        details: {
          metrics: [
            { label: 'Active Plan', value: '3 Milestones' },
            { label: 'Files Tracked', value: '18 files' },
            { label: 'Latency', value: '420ms' },
            { label: 'Audit Status', value: 'Verified' },
          ],
        },
      });
    }
  };

  const openPreviewInspect = () => {
    if (onInspect) {
      onInspect({
        id: 'hero-preview',
        title: 'Headless Browser Visual Review',
        subtitle: 'Chromium Audit • Viewport Verification',
        category: 'browser',
        summary: 'Automated Playwright runner validates rendered layout, DOM styling, zero visual regressions, and interactive state transitions before pull request synthesis.',
        details: {
          metrics: [
            { label: 'Engine', value: 'Chromium' },
            { label: 'Viewports', value: 'Desktop + Mobile' },
            { label: 'Dom Errors', value: '0' },
            { label: 'Lighthouse', value: '99/100' },
          ],
        },
      });
    }
  };

  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="live-dot"></span> THE AGENT-FIRST WORKSPACE
        </p>
        <h1 id="hero-title">
          Architect the vision.
          <br />
          <span>Let agents build the rest.</span>
        </h1>
        <p className="hero-description">
          Turn high-level product intent into working, production-grade software. Orbit coordinates autonomous engineering agents to plan, execute surgical edits across your codebase, and verify every change in real headless browsers before landing.
        </p>
        <div className="hero-actions">
          {onOpenWaitlist && (
            <button
              type="button"
              className="button button-lime"
              onClick={onOpenWaitlist}
              style={{ cursor: 'pointer', border: 'none' }}
              title="Join Early Access waitlist"
            >
              Join Early Access <span aria-hidden="true">↗</span>
            </button>
          )}
          <a className="button button-dark" href="#platform" title="Explore Orbit platform capabilities">
            Explore the platform <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="#workflow" title="See orchestration workflow in action">
            See how it works <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-note">
          <span className="note-check" aria-hidden="true">
            ✓
          </span>{' '}
          From architectural brief to verified pull request
        </div>
      </div>

      <div className="hero-art" aria-label="Illustration of an AI agent planning, building, and checking a project">
        <div className="hero-grid-bg" aria-hidden="true"></div>
        <div className="orbit-ring orbit-ring-one"></div>
        <div className="orbit-ring orbit-ring-two"></div>
        <div
          className="hero-window hover-expand"
          onClick={openHeroInspect}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openHeroInspect();
            }
          }}
          title="Click to expand & inspect full architectural workspace"
          style={{ cursor: 'pointer' }}
        >
          <div className="window-topbar">
            <div className="window-dots" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="window-path">
              <span className="path-icon">◈</span> {projectName}
            </div>
            <span className="window-expand-hint" style={{ fontSize: '9px', fontWeight: 600, color: 'var(--violet)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              Expand ↗
            </span>
          </div>
          <div className="workspace-layout">
            <aside className="workspace-rail" aria-hidden="true">
              <div className="rail-logo">◉</div>
              <span className="rail-icon selected">⌘</span>
              <span className="rail-icon">▤</span>
              <span className="rail-icon">⌕</span>
              <span className="rail-icon rail-bottom">⚙</span>
            </aside>
            <div className="workspace-main">
              <div className="project-heading">
                <div>
                  <span className="mini-label">PROJECT</span>
                  <h2>{projectName.split('/')[1]?.trim() || 'Storefront refresh'}</h2>
                </div>
                <span className="branch-pill">
                  <span></span> main
                </span>
              </div>
              <div
                className="task-prompt-interactive"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sparkle" style={{ color: 'var(--violet)', fontSize: '13px' }}>
                  ✳
                </span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want the agent to build..."
                  aria-label="Agent execution prompt"
                />
                <button
                  type="button"
                  className="task-run-btn"
                  onClick={handleRunAgent}
                  disabled={isRunning}
                  aria-label="Run AI agent"
                  title="Execute prompt across agents"
                >
                  {isRunning ? '...' : 'Run'} <span>✳</span>
                </button>
              </div>
              <div
                style={{ display: 'flex', gap: '6px', margin: '8px 0 14px', flexWrap: 'wrap' }}
                onClick={(e) => e.stopPropagation()}
              >
                <span style={{ fontSize: '10px', color: 'var(--muted)', alignSelf: 'center', fontWeight: 600, letterSpacing: '0.04em' }}>TRY:</span>
                {[
                  { label: 'Storefront refresh', text: 'Give the product page a calmer layout and make the gallery feel more immersive.' },
                  { label: 'Auth flow', text: 'Implement JWT login with refresh tokens, password reset, and session storage.' },
                  { label: 'Dark mode engine', text: 'Build a zero-runtime CSS variable theme switcher with system preference detection.' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectSamplePrompt(item.text)}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid var(--line)',
                      borderRadius: '999px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--ink)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--ink)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.color = 'var(--ink)';
                      e.currentTarget.style.borderColor = 'var(--line)';
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="activity-label">
                <span>AGENT ACTIVITY</span>
                <span>
                  LIVE <i></i>
                </span>
              </div>
              <div className="agent-list">
                {steps.map((step, idx) => (
                  <div key={idx} className={`agent-step ${step.status}`}>
                    <span className="step-symbol">
                      {step.status === 'done' ? (
                        '✓'
                      ) : step.status === 'active' ? (
                        <i></i>
                      ) : (
                        '○'
                      )}
                    </span>
                    <div>
                      <strong>{step.title}</strong>
                      <small>{step.description}</small>
                    </div>
                    <span className="step-time">{step.time_label || 'now'}</span>
                  </div>
                ))}
              </div>
              <div className="workspace-footer">
                <span className="footer-avatar">O</span>
                <span>Orbit is working through your brief</span>
                <span className="footer-pulse"></span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="preview-float hover-expand"
          onClick={openPreviewInspect}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPreviewInspect();
            }
          }}
          title="Click to expand browser preview & Playwright audit"
          style={{ cursor: 'pointer' }}
        >
          <div className="preview-label">
            <span className="preview-dot"></span> LIVE PREVIEW
          </div>
          <div className="preview-image">
            <div className="preview-sun"></div>
            <div className="preview-product"></div>
            <div className="preview-copy">
              <i></i>
              <i></i>
              <b></b>
            </div>
          </div>
          <div className="preview-caption">
            <span>Product detail</span>
            <span style={{ color: 'var(--violet)' }}>Expand ↗</span>
          </div>
        </div>
        <div className="floating-tag tag-plan hover-expand">
          <span>✳</span> Plan
        </div>
        <div className="floating-tag tag-verify hover-expand">
          <span>✓</span> Verify
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span></span> SCROLL TO EXPLORE
      </div>
    </section>
  );
};
