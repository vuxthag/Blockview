import React from 'react';
import { LANG } from '../../data/lang.js';

export default function MerkleTheory({ lang = 'vi' }) {
  const t = LANG[lang].merkle;

  const nodeItems = [
    { icon: '🍃', color: '#22d3ee', label: t.leafNode,   text: t.leafNodeDesc },
    { icon: '🔗', color: '#3b82f6', label: t.parentNode, text: t.parentNodeDesc },
    { icon: '👑', color: '#a855f7', label: t.merkleRoot, text: t.merkleRootDesc },
  ];

  const legendItems = [
    { color: '#8b5cf6', label: t.legendRoot },
    { color: '#3b82f6', label: t.legendInternal },
    { color: '#22d3ee', label: t.legendLeaf },
  ];

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(135deg, rgba(139,92,246,0.09) 0%, rgba(59,130,246,0.07) 50%, rgba(15,23,42,0.6) 100%)',
      border: '1px solid rgba(139,92,246,0.25)',
      borderRadius: 20,
      padding: '28px 32px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 0 0 1px rgba(139,92,246,0.08), 0 8px 48px rgba(0,0,0,0.35), 0 0 60px rgba(139,92,246,0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', top: -60, left: -60,
        width: 180, height: 180,
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, right: -40,
        width: 140, height: 140,
        background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
        }}>🌳</div>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px' }}>
            {t.theoryTitle}
          </h3>
          <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {t.theorySubtitle}
          </p>
        </div>
      </div>

      {/* Content: Text + Diagram side by side */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Left: Description */}
        <div style={{ flex: '1 1 300px', minWidth: 260 }}>
          <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8 }}>
            {/* Highlight "Merkle Tree" / "Cây Merkle" with purple color */}
            {(() => {
              const desc = t.theoryDescPlain;
              const highlight = lang === 'vi' ? 'Cây Merkle' : 'Merkle Tree';
              const parts = desc.split(highlight);
              return parts.map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < parts.length - 1 && (
                    <span style={{ color: '#c084fc', fontWeight: 600 }}>{highlight}</span>
                  )}
                </React.Fragment>
              ));
            })()}
          </p>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {nodeItems.map((item, i) => (
              <li key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                background: 'rgba(15,23,42,0.45)',
                borderRadius: 10, padding: '10px 14px',
                border: `1px solid ${item.color}22`,
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.label}
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Static mini tree diagram */}
        <div style={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          padding: '16px 20px',
          background: 'rgba(2,6,23,0.55)',
          borderRadius: 16,
          border: '1px solid rgba(51,65,85,0.6)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          {/* Row 1: Root */}
          <MiniNode label={t.merkleRoot} color="#8b5cf6" />
          <MiniLines count={2} />

          {/* Row 2: Intermediate */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MiniNode label="Hash(A+B)" color="#3b82f6" small />
              <MiniLines count={2} />
              <div style={{ display: 'flex', gap: 8 }}>
                <MiniNode label="Tx A" color="#22d3ee" tiny />
                <MiniNode label="Tx B" color="#22d3ee" tiny />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MiniNode label="Hash(C+D)" color="#3b82f6" small />
              <MiniLines count={2} />
              <div style={{ display: 'flex', gap: 8 }}>
                <MiniNode label="Tx C" color="#22d3ee" tiny />
                <MiniNode label="Tx D" color="#22d3ee" tiny />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {legendItems.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                <span style={{ fontSize: 10, color: '#64748b' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniNode({ label, color, small, tiny }) {
  const size = tiny
    ? { px: '5px 10px', fs: 9, br: 6 }
    : small
      ? { px: '6px 12px', fs: 10, br: 7 }
      : { px: '8px 16px', fs: 11, br: 9 };
  return (
    <div style={{
      padding: size.px,
      borderRadius: size.br,
      border: `1px solid ${color}66`,
      background: `${color}20`,
      color: color,
      fontSize: size.fs,
      fontFamily: 'monospace',
      whiteSpace: 'nowrap',
      fontWeight: 700,
      letterSpacing: '0.04em',
      boxShadow: `0 0 10px ${color}18`,
    }}>
      {label}
    </div>
  );
}

function MiniLines({ count = 1 }) {
  return (
    <div style={{ display: 'flex', gap: count === 2 ? 28 : 0, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 1, height: 16,
          background: 'linear-gradient(to bottom, rgba(100,116,139,0.6), rgba(100,116,139,0.2))',
          flexShrink: 0,
        }} />
      ))}
    </div>
  );
}
