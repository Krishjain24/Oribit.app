import React, { useState, useEffect } from 'react';

export interface VisualInspectTarget {
  id: string;
  title: string;
  subtitle: string;
  category: 'workspace' | 'browser' | 'constellation' | 'code' | 'architecture';
  summary: string;
  details?: {
    files?: string[];
    checks?: string[];
    metrics?: { label: string; value: string }[];
  };
}

interface VisualInspectModalProps {
  target: VisualInspectTarget | null;
  onClose: () => void;
  onOpenWaitlist?: () => void;
}

export const VisualInspectModal: React.FC<VisualInspectModalProps> = ({
  target,
  onClose,
  onOpenWaitlist,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'telemetry'>('preview');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (target) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, onClose]);

  if (!target) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspect-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 17, 21, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 'min(960px, 96vw)',
          maxHeight: '92vh',
          background: 'var(--paper)',
          border: '1px solid var(--line-solid)',
          borderRadius: '16px',
          boxShadow: '0 32px 80px rgba(15, 17, 21, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--line-solid)',
            background: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'var(--terracotta)',
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {target.category}
            </span>
            <div>
              <h2
                id="inspect-modal-title"
                style={{
                  font: '600 18px var(--font-display)',
                  margin: 0,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                {target.title}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                {target.subtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--panel)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                color: 'var(--ink)',
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontWeight: 700 }}
                title="Zoom Out"
              >
                −
              </button>
              <span style={{ minWidth: '40px', textAlign: 'center' }}>{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontWeight: 700 }}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '10px', color: 'var(--muted)' }}
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--line-solid)',
                background: 'var(--white)',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--ink)',
                transition: 'all 0.15s ease',
              }}
              aria-label="Close inspection window"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 24px',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--line-solid)',
          }}
        >
          {[
            { id: 'preview', label: 'Architecture View' },
            { id: 'code', label: 'Synthesized Code Spec' },
            { id: 'telemetry', label: 'Verification Telemetry' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'preview' | 'code' | 'telemetry')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: activeTab === tab.id ? '1px solid var(--line-solid)' : '1px solid transparent',
                background: activeTab === tab.id ? 'var(--white)' : 'transparent',
                color: activeTab === tab.id ? 'var(--violet)' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {activeTab === 'preview' && (
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* High-res blueprint card */}
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line-solid)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(15, 17, 21, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--juniper)' }}></span>
                    <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>Live Agent Orchestration Canvas</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>AST Tree-sitter Verified</span>
                </div>

                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)', margin: '0 0 16px' }}>
                  {target.summary}
                </p>

                {/* Hotspot Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'var(--paper)', border: '1px solid var(--line-solid)', padding: '14px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--violet)', fontWeight: 700, letterSpacing: '0.06em' }}>01 / INTENT DISPATCH</span>
                    <p style={{ fontSize: '12px', color: 'var(--ink)', margin: '6px 0 0' }}>Natural language prompts decomposed into typed deterministic DAG milestones.</p>
                  </div>
                  <div style={{ background: 'var(--paper)', border: '1px solid var(--line-solid)', padding: '14px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--violet)', fontWeight: 700, letterSpacing: '0.06em' }}>02 / SURGICAL REWRITE</span>
                    <p style={{ fontSize: '12px', color: 'var(--ink)', margin: '6px 0 0' }}>Ast-guided multi-file modifications with atomic rollback safety.</p>
                  </div>
                  <div style={{ background: 'var(--paper)', border: '1px solid var(--line-solid)', padding: '14px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--terracotta)', fontWeight: 700, letterSpacing: '0.06em' }}>03 / HEADLESS AUDIT</span>
                    <p style={{ fontSize: '12px', color: 'var(--ink)', margin: '6px 0 0' }}>Automated Playwright browser inspection validates DOM layout, responsive styles, and click states.</p>
                  </div>
                </div>
              </div>

              {/* Metrics strip */}
              {target.details?.metrics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {target.details.metrics.map((m, i) => (
                    <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--line-solid)', borderRadius: '8px', padding: '12px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{m.label}</span>
                      <strong style={{ display: 'block', fontSize: '20px', color: 'var(--ink)', marginTop: '4px', font: '600 20px var(--font-display)' }}>{m.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div
              style={{
                background: '#16191B',
                border: '1px solid #2E3438',
                borderRadius: '10px',
                padding: '16px 20px',
                color: '#ECF0F1',
                fontFamily: `'Cascadia Code', Consolas, Monaco, monospace`,
                fontSize: '12px',
                lineHeight: 1.7,
                overflowX: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #2E3438', marginBottom: '12px', color: '#8F959E', fontSize: '11px' }}>
                <span>orbit-agent / synthesizer / active_diff.patch</span>
                <span style={{ color: 'var(--juniper)' }}>● Verified via Tree-sitter</span>
              </div>
              <pre style={{ margin: 0 }}>
{`--- a/src/components/ProductGallery.tsx
+++ b/src/components/ProductGallery.tsx
@@ -14,8 +14,14 @@
 export const ProductGallery: React.FC<Props> = ({ images }) => {
   const [activeIdx, setActiveIdx] = useState(0);
-  return <div className="simple-carousel">{images.map(img => <img src={img} />)}</div>;
+  return (
+    <div className="architectural-gallery" data-orbit-verified="true">
+      <div className="gallery-stage" style={{ transform: 'perspective(1200px)' }}>
+        <img src={images[activeIdx]} alt="Active preview" className="hover-expand" />
+      </div>
+      <Thumbnails items={images} active={activeIdx} onSelect={setActiveIdx} />
+    </div>
+  );
 };`}
              </pre>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { step: '01 / Schema verification', status: 'PASS', time: '14ms', desc: 'SQLite orbit.db tables and indexes validated' },
                { step: '02 / TypeScript type-check', status: 'PASS', time: '180ms', desc: 'Zero missing imports or undefined props' },
                { step: '03 / Playwright DOM audit', status: 'PASS', time: '340ms', desc: 'Viewport responsive checks passed at 375px, 768px, 1280px' },
                { step: '04 / Contrast & Accessibility', status: 'PASS', time: '45ms', desc: 'WCAG AA 4.5:1 ratio confirmed on all interactive buttons' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--white)',
                    border: '1px solid var(--line-solid)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--juniper)', color: '#fff', fontSize: '10px', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
                      ✓
                    </span>
                    <div>
                      <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{item.step}</strong>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>{item.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--muted)' }}>{item.time}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: 'var(--juniper-soft)', color: 'var(--juniper)', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--line-solid)',
            background: 'var(--white)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--muted)' }}>
            <span>Tip: Hover over any card or button across the application to expand details.</span>
          </div>
          {onOpenWaitlist && (
            <button
              type="button"
              className="button button-lime"
              onClick={() => {
                onClose();
                onOpenWaitlist();
              }}
              style={{ padding: '8px 18px', minHeight: '38px', fontSize: '12px' }}
            >
              Test in Early Access ↗
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
