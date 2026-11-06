import React, { useState } from 'react';

type BuilderType = 'frontend' | 'fullstack' | 'teams';

interface BuildersSectionProps {
  onRoleChange?: (role: BuilderType) => void;
}

export const BuildersSection: React.FC<BuildersSectionProps> = ({ onRoleChange }) => {
  const [activeTab, setActiveTab] = useState<BuilderType>('frontend');

  const builderContent: Record<
    BuilderType,
    { kicker: string; title: string; description: string; points: string[] }
  > = {
    frontend: {
      kicker: 'FOR FRONTEND DEVELOPERS',
      title: 'Shape the experience while agents handle the loops.',
      description: 'Explore visual directions, refine components, and review the result right beside your code.',
      points: [
        'Iterate on real browser previews',
        'Keep design intent with the code',
        'Review each change as it lands',
      ],
    },
    fullstack: {
      kicker: 'FOR FULL STACK BUILDERS',
      title: 'Keep the whole system in view as you build.',
      description: 'Give agents context across your project so they can trace a change from the interface through to the data layer.',
      points: [
        'Work across connected parts of a codebase',
        'Keep decisions and implementation together',
        'Check changes in the running application',
      ],
    },
    teams: {
      kicker: 'FOR PRODUCT TEAMS',
      title: 'Move together from brief to shared outcome.',
      description: 'Make plans, progress, and review visible so teammates can contribute with a shared understanding of the work.',
      points: [
        'Keep the project brief close at hand',
        'Follow progress as work takes shape',
        'Review outcomes with your team',
      ],
    },
  };

  const handleTabChange = (role: BuilderType) => {
    setActiveTab(role);
    if (onRoleChange) onRoleChange(role);
  };

  const content = builderContent[activeTab];

  return (
    <section className="builders-section shell section-space" id="for-builders" aria-labelledby="builders-title">
      <div className="builders-heading">
        <div>
          <p className="eyebrow">MADE FOR HOW YOU BUILD</p>
          <h2 id="builders-title">
            Your craft stays
            <br />
            at the center.
          </h2>
        </div>
        <p>
          Whether you are shaping an interface, shipping a complete product, or coordinating work across a team, Orbit adapts to your flow.
        </p>
      </div>

      <div className="builder-tabs" role="tablist" aria-label="Ways to work with Orbit">
        <button
          type="button"
          className={`builder-tab ${activeTab === 'frontend' ? 'is-active' : ''}`}
          id="tab-frontend"
          role="tab"
          aria-selected={activeTab === 'frontend'}
          aria-controls="builder-panel"
          onClick={() => handleTabChange('frontend')}
        >
          Frontend
        </button>
        <button
          type="button"
          className={`builder-tab ${activeTab === 'fullstack' ? 'is-active' : ''}`}
          id="tab-fullstack"
          role="tab"
          aria-selected={activeTab === 'fullstack'}
          aria-controls="builder-panel"
          onClick={() => handleTabChange('fullstack')}
        >
          Full stack
        </button>
        <button
          type="button"
          className={`builder-tab ${activeTab === 'teams' ? 'is-active' : ''}`}
          id="tab-teams"
          role="tab"
          aria-selected={activeTab === 'teams'}
          aria-controls="builder-panel"
          onClick={() => handleTabChange('teams')}
        >
          Teams
        </button>
      </div>

      <div className="builder-panel" id="builder-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} tabIndex={0}>
        <div className="builder-panel-copy">
          <span className="panel-kicker" id="panel-kicker">
            {content.kicker}
          </span>
          <h3 id="panel-title">{content.title}</h3>
          <p id="panel-description">{content.description}</p>
          <ul id="panel-points">
            {content.points.map((pt, i) => (
              <li key={i}>
                <span>✓</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <div className="builder-visual" aria-hidden="true">
          <div className="builder-orbit orbit-a"></div>
          <div className="builder-orbit orbit-b"></div>
          <div className="builder-cube">
            <div className="cube-face cube-front"></div>
            <div className="cube-face cube-side"></div>
            <div className="cube-face cube-top"></div>
          </div>
          <span className="builder-star star-a">✳</span>
          <span className="builder-star star-b">✦</span>
          <span className="builder-caption">YOUR VISION, IN MOTION</span>
        </div>
      </div>
    </section>
  );
};
