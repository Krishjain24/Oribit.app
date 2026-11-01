import React, { useState } from 'react';
import { AgentService } from '../services/agentService';
import { AgentStep } from '../types';

interface HeroProps {
  currentBuilderRole?: string;
  onOpenQuickStart?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentBuilderRole = 'fullstack', onOpenQuickStart }) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunAgent();
    }
  };

  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="live-dot"></span> THE AGENT-FIRST WORKSPACE
        </p>
        <h1 id="hero-title">
          Make room
          <br />
          for <span>what’s next.</span>
        </h1>
        <p className="hero-description">
          Bring your best ideas. Orbit’s AI agents plan, build, and check your work while you stay in control of the direction.
        </p>
        <div className="hero-actions">
          {onOpenQuickStart && (
            <button
              type="button"
              className="button button-lime"
              onClick={onOpenQuickStart}
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Start on Win / Mac <span>⚡</span>
            </button>
          )}
          <a className="button button-dark" href="#platform">
            Explore the platform <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href="#workflow">
            See how it works <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-note">
          <span className="note-check" aria-hidden="true">
            ✓
          </span>{' '}
          From first sketch to finished build
        </div>
      </div>

      <div className="hero-art" aria-label="Illustration of an AI agent planning, building, and checking a project">
        <div className="orbit-glow"></div>
        <div className="orbit-ring orbit-ring-one"></div>
        <div className="orbit-ring orbit-ring-two"></div>
        <div className="hero-window">
          <div className="window-topbar">
            <div className="window-dots" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="window-path">
              <span className="path-icon">◈</span> {projectName}
            </div>
            <span className="window-menu" aria-hidden="true">
              •••
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
              <div className="task-prompt-interactive">
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
                >
                  {isRunning ? '...' : 'Run'} <span>✳</span>
                </button>
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

        <div className="preview-float">
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
            <span>↗</span>
          </div>
        </div>
        <div className="floating-tag tag-plan">
          <span>✳</span> Plan
        </div>
        <div className="floating-tag tag-verify">
          <span>✓</span> Verify
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span></span> SCROLL TO EXPLORE
      </div>
    </section>
  );
};
