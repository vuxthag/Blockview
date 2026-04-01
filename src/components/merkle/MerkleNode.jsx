import React, { useState } from 'react';
import { LANG } from '../../data/lang.js';

/**
 * MerkleNode
 *
 * Props:
 *   hash        – full SHA-256 string
 *   type        – 'root' | 'intermediate' | 'leaf'
 *   isRoot      – boolean
 *   label       – optional human label (e.g. "Transaction A")
 *   leftChild   – hash of left child (for panel)
 *   rightChild  – hash of right child (for panel)
 *   isHighlighted – boolean – glow path-to-root effect
 *   nodeId      – string key used by parent to set highlight paths
 *   onHover     – (nodeId | null) => void
 *   lang        – 'vi' | 'en'
 */
export default function MerkleNode({
  hash = '',
  type = 'leaf',
  isRoot = false,
  label,
  leftChild,
  rightChild,
  isHighlighted = false,
  onHover,
  nodeId,
  lang = 'vi',
}) {
  const t = LANG[lang].merkle;
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const shortHash = hash.length > 16
    ? `${hash.slice(0, 6)}…${hash.slice(-6)}`
    : hash;

  const copy = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text || hash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // ── Per-type visual tokens ──────────────────────────────────────
  const tokens = {
    root: {
      border: isHighlighted
        ? '2px solid rgba(168,85,247,1)'
        : '2px solid rgba(168,85,247,0.7)',
      bg: isHighlighted
        ? 'rgba(88,28,135,0.45)'
        : 'rgba(88,28,135,0.25)',
      color: '#d8b4fe',
      labelColor: '#a855f7',
      glow: '0 0 24px rgba(168,85,247,0.55), 0 0 6px rgba(168,85,247,0.4)',
    },
    intermediate: {
      border: isHighlighted
        ? '2px solid rgba(59,130,246,0.9)'
        : '1.5px solid rgba(59,130,246,0.5)',
      bg: isHighlighted
        ? 'rgba(30,58,138,0.45)'
        : 'rgba(30,58,138,0.2)',
      color: '#93c5fd',
      labelColor: '#60a5fa',
      glow: '0 0 20px rgba(59,130,246,0.5)',
    },
    leaf: {
      border: isHighlighted
        ? '2px solid rgba(34,211,238,0.8)'
        : '1.5px solid rgba(34,211,238,0.4)',
      bg: isHighlighted
        ? 'rgba(6,78,59,0.35)'
        : 'rgba(6,78,59,0.15)',
      color: '#67e8f9',
      labelColor: '#22d3ee',
      glow: '0 0 18px rgba(34,211,238,0.5)',
    },
  };

  const s = tokens[type] || tokens.leaf;
  const active = hovered || isHighlighted;

  // ── Node type label ─────────────────────────────────────────────
  const getNodeTypeLabel = () => {
    if (isRoot) return t.nodeTypeRoot;
    if (type === 'intermediate') return t.nodeTypeInternal;
    return t.nodeTypeLeaf;
  };

  // ── Explanation text for the floating panel ─────────────────────
  const getExplanation = () => {
    if (isRoot) return t.explRoot;
    if (type === 'intermediate') return t.explIntermediate;
    const displayLabel = label || hash.slice(0, 12) + '…';
    return t.explLeaf.replace('{{label}}', displayLabel);
  };

  // ── Floating detail panel ───────────────────────────────────────
  const DetailPanel = () => (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        background: 'rgba(2,6,23,0.97)',
        border: '1px solid rgba(139,92,246,0.4)',
        borderRadius: 14,
        padding: '16px 18px',
        zIndex: 200,
        boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.1)',
        backdropFilter: 'blur(20px)',
        animation: 'fadeInUp 0.2s ease',
      }}
    >
      {/* Close */}
      <button
        onClick={e => { e.stopPropagation(); setPanelOpen(false); }}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'none', border: 'none', color: '#475569',
          cursor: 'pointer', fontSize: 14, padding: 4, lineHeight: 1,
          borderRadius: 6, transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
        onMouseLeave={e => e.currentTarget.style.color = '#475569'}
      >
        ✕
      </button>

      {/* Type badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 10px', borderRadius: 99,
        background: `${s.labelColor}18`,
        border: `1px solid ${s.labelColor}44`,
        marginBottom: 12,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.labelColor }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: s.labelColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {getNodeTypeLabel()}
        </span>
      </div>

      {/* Label */}
      {label && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t.panelTransaction}
          </div>
          <div style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 600 }}>{label}</div>
        </div>
      )}

      {/* Full hash */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t.panelShaHash}
          </span>
          <button
            onClick={e => copy(e, hash)}
            style={{
              fontSize: 10, color: copied ? '#22d3ee' : '#64748b',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color 0.2s',
            }}
          >
            {copied ? t.panelCopied : t.panelCopy}
          </button>
        </div>
        <div style={{
          fontFamily: 'monospace', fontSize: 9.5, color: s.color,
          wordBreak: 'break-all', lineHeight: 1.7,
          background: 'rgba(15,23,42,0.8)', borderRadius: 8,
          padding: '8px 10px',
          border: `1px solid ${s.labelColor}22`,
        }}>
          {hash}
        </div>
      </div>

      {/* Children hashes */}
      {(leftChild || rightChild) && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {t.panelChildHashes}
          </div>
          {leftChild && (
            <div style={{ marginBottom: 5 }}>
              <span style={{ fontSize: 9, color: '#3b82f6', fontWeight: 600 }}>{t.panelLeft}{'  '}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#64748b' }}>{leftChild.slice(0, 20)}…</span>
            </div>
          )}
          {rightChild && (
            <div>
              <span style={{ fontSize: 9, color: '#22d3ee', fontWeight: 600 }}>{t.panelRight}{' '}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#64748b' }}>{rightChild.slice(0, 20)}…</span>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      <div style={{
        background: 'rgba(139,92,246,0.06)', borderRadius: 8,
        padding: '10px 12px',
        border: '1px solid rgba(139,92,246,0.15)',
      }}>
        <div style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t.panelHowComputed}
        </div>
        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
          {getExplanation()}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Node box */}
      <div
        onClick={() => setPanelOpen(p => !p)}
        onMouseEnter={() => { setHovered(true); onHover && onHover(nodeId); }}
        onMouseLeave={() => { setHovered(false); onHover && onHover(null); }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: isRoot ? 160 : 120,
          height: 50,
          padding: '8px 12px',
          borderRadius: 12,
          border: s.border,
          background: s.bg,
          boxShadow: active ? s.glow : 'none',
          transition: 'all 0.25s ease',
          transform: hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          userSelect: 'none',
        }}
      >
        {/* Root label */}
        {isRoot && (
          <span style={{
            fontSize: 7,
            letterSpacing: '0.18em',
            color: s.labelColor,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            marginBottom: 2,
            fontWeight: 700,
            lineHeight: 1,
          }}>
            {t.merkleRootLabel}
          </span>
        )}

        {/* Hash */}
        <span style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: s.color,
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}>
          {shortHash}
        </span>

        {/* Click indicator dot */}
        {hovered && !panelOpen && (
          <div style={{
            position: 'absolute', bottom: -4, left: '50%',
            transform: 'translateX(-50%)',
            width: 4, height: 4, borderRadius: '50%',
            background: s.labelColor,
            boxShadow: `0 0 6px ${s.labelColor}`,
            animation: 'dotPulse 1s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Floating panel */}
      {panelOpen && <DetailPanel />}
    </div>
  );
}
