import React from 'react';

export const PlatformSection: React.FC = () => {
  return (
    <section className="platform-section shell section-space" id="platform" aria-labelledby="platform-title">
      <div className="section-heading">
        <p className="eyebrow">YOUR WORK, IN MOTION</p>
        <h2 id="platform-title">
          A bigger view of
          <br />
          the work ahead.
        </h2>
        <p className="section-intro">
          Move from individual prompts to a whole project in motion. Orbit gives agents the context and tools to carry work across the finish line.
        </p>
      </div>

      <div className="platform-grid">
        <article className="feature-card feature-card-dark">
          <div className="feature-topline">
            <span className="feature-icon icon-orchestrate">✳</span>
            <span>01 / ORCHESTRATE</span>
          </div>
          <div className="constellation" aria-hidden="true">
            <span className="constellation-line line-a"></span>
            <span className="constellation-line line-b"></span>
            <span className="constellation-line line-c"></span>
            <span className="constellation-node node-core">✳</span>
            <span className="constellation-node node-one">⌘</span>
            <span className="constellation-node node-two">▤</span>
            <span className="constellation-node node-three">✓</span>
          </div>
          <h3>
            Keep every agent
            <br />
            on the same page.
          </h3>
          <p>Give a clear brief, then follow each agent’s plan and progress from one focused workspace.</p>
          <a href="#workflow" className="card-link">
            See orchestration <span aria-hidden="true">↗</span>
          </a>
        </article>

        <article className="feature-card feature-card-lilac">
          <div className="feature-topline">
            <span className="feature-icon icon-editor">⌘</span>
            <span>02 / CREATE</span>
          </div>
          <div className="code-art" aria-hidden="true">
            <div className="code-bar">
              <span></span>
              <span></span>
              <span></span>
              <b>ProductGallery.tsx</b>
            </div>
            <div className="code-lines">
              <span>
                <i>01</i>
                <b className="code-purple">const</b> gallery = <b className="code-blue">&lt;Gallery</b>
              </span>
              <span>
                <i>02</i>&nbsp;&nbsp; images=&#123;product.images&#125;
              </span>
              <span>
                <i>03</i>&nbsp;&nbsp; layout=<b className="code-pink">"immersive"</b>
              </span>
              <span>
                <i>04</i>
                <b className="code-blue">/&gt;</b>
              </span>
              <span>
                <i>05</i>
              </span>
            </div>
            <span className="code-cursor"></span>
          </div>
          <h3>
            Stay close to
            <br />
            the implementation.
          </h3>
          <p>Work in a familiar editor while agents navigate your codebase and make focused changes.</p>
          <a href="#workflow" className="card-link">
            Explore the workspace <span aria-hidden="true">↗</span>
          </a>
        </article>

        <article className="feature-card feature-card-mint">
          <div className="feature-topline">
            <span className="feature-icon icon-browser">◉</span>
            <span>03 / VERIFY</span>
          </div>
          <div className="browser-art" aria-hidden="true">
            <div className="browser-bar">
              <span>◉</span>
              <b>localhost:3000</b>
              <span>↗</span>
            </div>
            <div className="browser-page">
              <div className="browser-nav">
                <i></i>
                <span>STUDIO</span>
                <span>SHOP</span>
                <span>ABOUT</span>
                <i></i>
              </div>
              <div className="browser-hero">
                <div>
                  <b>
                    Objects
                    <br />
                    for living.
                  </b>
                  <i></i>
                  <i></i>
                </div>
                <div className="browser-shape"></div>
              </div>
            </div>
          </div>
          <h3>
            See the result
            <br />
            before it ships.
          </h3>
          <p>Pair code changes with browser checks and visual review, so you can move forward with confidence.</p>
          <a href="#workflow" className="card-link">
            See browser review <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </section>
  );
};
