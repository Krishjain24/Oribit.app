import React, { useState } from 'react';

export const WorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: '01',
      title: 'Describe the destination',
      desc: 'Set the goal in your own words. Add files, constraints, and context where it helps.',
      statusActive: 'READY',
      statusInactive: 'IN VIEW',
    },
    {
      num: '02',
      title: 'Review the plan',
      desc: 'See the approach before work begins, and steer the details that matter to you.',
      statusActive: 'ACTIVE',
      statusInactive: 'IN VIEW',
    },
    {
      num: '03',
      title: 'Follow work through',
      desc: 'Track edits, browser checks, and outcomes as your project comes together.',
      statusActive: 'VERIFIED',
      statusInactive: 'IN VIEW',
    },
  ];

  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
      <div className="shell workflow-inner">
        <div className="workflow-copy">
          <p className="eyebrow eyebrow-light">FROM INTENT TO OUTCOME</p>
          <h2 id="workflow-title">
            Think in outcomes.
            <br />
            <span>Build with clarity.</span>
          </h2>
          <p>Describe what you want to achieve. Orbit turns the goal into a visible plan, then keeps you close as the work takes shape.</p>
          <a className="button button-light" href="#for-builders">
            Explore the workflow <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="workflow-steps">
          <div className="workflow-line">
            <span style={{ height: activeStep === 1 ? '24%' : activeStep === 2 ? '62%' : '100%' }}></span>
          </div>
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isSelected = activeStep === stepNum;
            return (
              <article
                key={step.num}
                className={`workflow-step ${isSelected ? 'selected' : ''}`}
                data-step={stepNum}
                onClick={() => setActiveStep(stepNum)}
              >
                <span className="workflow-number">{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <span className="workflow-status">{isSelected ? step.statusActive : step.statusInactive}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
