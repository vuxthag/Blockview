import React from 'react';
import { LANG } from '../../data/lang.js';
import MerkleTree from './MerkleTree';
import ZoomableCanvas from './ZoomableCanvas';

export default function MerkleVisualization({ treeData, loading, lang = 'vi' }) {
  const t = LANG[lang].merkle;
  const hasContent = !loading && !!treeData?.levels;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(2,6,23,0.55)',
      backdropFilter: 'blur(16px)',
      borderRadius: 20,
      border: '1px solid rgba(51,65,85,0.7)',
      overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(30,41,59,0.8)',
        flexShrink: 0,
        gap: 12,
      }}>
        <div>
          <h2 style={{
            margin: 0, fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(90deg,#c084fc,#60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {t.title}
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: '#334155', marginTop: 2 }}>
            {t.subtitle}
          </p>
        </div>

        {hasContent && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10, color: '#22d3ee',
            background: 'rgba(6,182,212,0.08)',
            padding: '4px 10px', borderRadius: 99,
            border: '1px solid rgba(34,211,238,0.2)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22d3ee', display: 'inline-block',
              animation: 'pulse 2s infinite',
            }} />
            {t.synced}
          </div>
        )}
      </div>

      {/* ── Canvas ── */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(rgba(148,163,184,0.025) 1px, transparent 1px), linear-gradient(90deg,rgba(148,163,184,0.025) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}>
        {loading ? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <div style={{
              width: 44, height: 44,
              border: '3px solid rgba(51,65,85,0.8)',
              borderTopColor: '#a855f7',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: '#a855f7', margin: 0 }}>
              {t.computing}
            </p>
          </div>
        ) : hasContent ? (
          <ZoomableCanvas hasContent lang={lang}>
            <MerkleTree levels={treeData.levels} lang={lang} />
          </ZoomableCanvas>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            {/* Idle illustration */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ opacity: 0.35 }}>
              <rect x="20" y="2" width="16" height="10" rx="4" stroke="#8b5cf6" strokeWidth="1.5"/>
              <rect x="4" y="22" width="16" height="10" rx="4" stroke="#3b82f6" strokeWidth="1.5"/>
              <rect x="36" y="22" width="16" height="10" rx="4" stroke="#3b82f6" strokeWidth="1.5"/>
              <rect x="2" y="42" width="12" height="10" rx="3" stroke="#22d3ee" strokeWidth="1.5"/>
              <rect x="16" y="42" width="12" height="10" rx="3" stroke="#22d3ee" strokeWidth="1.5"/>
              <rect x="30" y="42" width="12" height="10" rx="3" stroke="#22d3ee" strokeWidth="1.5"/>
              <rect x="44" y="42" width="12" height="10" rx="3" stroke="#22d3ee" strokeWidth="1.5"/>
              <line x1="28" y1="12" x2="12" y2="22" stroke="#64748b" strokeWidth="1"/>
              <line x1="28" y1="12" x2="44" y2="22" stroke="#64748b" strokeWidth="1"/>
              <line x1="12" y1="32" x2="8"  y2="42" stroke="#64748b" strokeWidth="1"/>
              <line x1="12" y1="32" x2="22" y2="42" stroke="#64748b" strokeWidth="1"/>
              <line x1="44" y1="32" x2="36" y2="42" stroke="#64748b" strokeWidth="1"/>
              <line x1="44" y1="32" x2="50" y2="42" stroke="#64748b" strokeWidth="1"/>
            </svg>
            <p style={{ fontSize: 12, color: '#334155', margin: 0, textAlign: 'center', maxWidth: 220, lineHeight: 1.6 }}>
              {t.emptyState}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
