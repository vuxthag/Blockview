import React, { useState, useEffect } from 'react';
import { LANG } from '../../data/lang.js';

/**
 * ZoomableCanvas
 *
 * Zoom is controlled ONLY via buttons (+/−/Reset).
 * Mouse-wheel zoom and drag-to-pan are intentionally removed.
 *
 * Zoom levels: 0.75 → 1.0 → 1.25 → 1.5
 */

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5];
const DEFAULT_STEP = 1; // index into ZOOM_STEPS → 1.0x

export default function ZoomableCanvas({ children, hasContent, lang = 'vi' }) {
  const t = LANG[lang].merkle;
  const [stepIdx, setStepIdx] = useState(DEFAULT_STEP);
  const scale = ZOOM_STEPS[stepIdx];

  // Reset when new tree is built
  useEffect(() => {
    if (hasContent) setStepIdx(DEFAULT_STEP);
  }, [hasContent]);

  const zoomIn  = () => setStepIdx(i => Math.min(ZOOM_STEPS.length - 1, i + 1));
  const zoomOut = () => setStepIdx(i => Math.max(0, i - 1));
  const reset   = () => setStepIdx(DEFAULT_STEP);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'auto',     // scrollbars appear if content is larger than canvas
      cursor: 'default',
      userSelect: 'none',
    }}>
      {/* ── Transform wrapper ──────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        minWidth: '100%',
        minHeight: '100%',
        padding: '32px 64px 48px',
      }}>
        <div
          className="zoom-content"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          {children}
        </div>
      </div>

      {/* ── Controls ───────────────────────────────────────── */}
      {hasContent && (
        <>
          {/* Scale badge */}
          <div style={badgeStyle}>
            {Math.round(scale * 100)}%
          </div>

          {/* Button cluster */}
          <div style={clusterStyle}>
            <CtrlBtn
              onClick={zoomIn}
              disabled={stepIdx === ZOOM_STEPS.length - 1}
              title={t.zoomIn}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </CtrlBtn>

            <CtrlBtn
              onClick={zoomOut}
              disabled={stepIdx === 0}
              title={t.zoomOut}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </CtrlBtn>

            <div style={{ height: 1, background: 'rgba(148,163,184,0.15)', margin: '3px 0' }} />

            <CtrlBtn onClick={reset} title={t.resetView}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </CtrlBtn>
          </div>

          {/* Step indicator */}
          <div style={stepStyle}>
            {ZOOM_STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStepIdx(i)}
                title={`${Math.round(s * 100)}%`}
                style={{
                  width: i === stepIdx ? 20 : 8,
                  height: 4, borderRadius: 99,
                  background: i === stepIdx ? '#8b5cf6' : 'rgba(148,163,184,0.2)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  padding: 0, flexShrink: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Control button ─────────────────────────────────────────────────────────
function CtrlBtn({ children, onClick, title, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov && !disabled ? 'rgba(139,92,246,0.2)' : 'rgba(2,6,23,0.8)',
        border: `1px solid ${hov && !disabled ? 'rgba(139,92,246,0.5)' : 'rgba(148,163,184,0.12)'}`,
        borderRadius: 8,
        color: disabled ? '#1e293b' : hov ? '#c084fc' : '#64748b',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        backdropFilter: 'blur(8px)',
        padding: 0, flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

// ── Static style objects ───────────────────────────────────────────────────
const badgeStyle = {
  position: 'absolute', top: 12, left: 12, zIndex: 10,
  background: 'rgba(2,6,23,0.75)',
  border: '1px solid rgba(148,163,184,0.1)',
  borderRadius: 8, padding: '4px 10px',
  fontSize: 11, color: '#475569',
  fontFamily: 'monospace', letterSpacing: '0.06em',
  pointerEvents: 'none', userSelect: 'none',
  backdropFilter: 'blur(8px)',
};

const clusterStyle = {
  position: 'absolute', top: 12, right: 12, zIndex: 10,
  display: 'flex', flexDirection: 'column', gap: 4,
};

const stepStyle = {
  position: 'absolute', bottom: 14, left: '50%',
  transform: 'translateX(-50%)', zIndex: 10,
  display: 'flex', gap: 4, alignItems: 'center',
  background: 'rgba(2,6,23,0.6)',
  border: '1px solid rgba(148,163,184,0.08)',
  borderRadius: 99, padding: '6px 10px',
  backdropFilter: 'blur(6px)',
};
