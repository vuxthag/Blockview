import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LANG } from '../../data/lang.js';
import MerkleNode from './MerkleNode';

/**
 * MerkleTree
 *
 * Renders the tree level by level (levels[0] = root).
 * SVG overlay draws bezier connector paths between parent/child nodes.
 * On node hover, full path-to-root is highlighted (nodes + lines).
 */
export default function MerkleTree({ levels, lang = 'vi' }) {
  const t = LANG[lang].merkle;
  const nodeRefs = useRef({});
  const containerRef = useRef(null);
  const [connectors, setConnectors] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);   // e.g. "2-1"
  const [highlightedIds, setHighlightedIds] = useState(new Set());

  if (!levels || levels.length === 0) return null;

  const numLevels = levels.length;

  const getLevelLabel = (li) => {
    if (li === 0) return t.levelRoot;
    if (li === numLevels - 1) return t.levelLeaf;
    return t.levelN.replace('{{n}}', numLevels - 1 - li);
  };

  const getNodeType = (li) => {
    if (li === 0) return 'root';
    if (li === numLevels - 1) return 'leaf';
    return 'intermediate';
  };

  // Build ancestor path-ids for a given node key "li-ni"
  const getAncestorIds = useCallback((key) => {
    const ids = new Set([key]);
    let [li, ni] = key.split('-').map(Number);
    while (li > 0) {
      const parentNi = Math.floor(ni / 2);
      li -= 1;
      ni = parentNi;
      ids.add(`${li}-${ni}`);
    }
    return ids;
  }, []);

  const handleHover = useCallback((nodeId) => {
    setHoveredId(nodeId);
    setHighlightedIds(nodeId ? getAncestorIds(nodeId) : new Set());
  }, [getAncestorIds]);

  // SVG connector measurement
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const paths = [];

      for (let li = 0; li < numLevels - 1; li++) {
        const parentLevel = levels[li];
        const childLevel = levels[li + 1];

        parentLevel.forEach((_, pi) => {
          const pKey = `${li}-${pi}`;
          const parentEl = nodeRefs.current[pKey];
          if (!parentEl) return;
          const pRect = parentEl.getBoundingClientRect();
          const pX = pRect.left + pRect.width / 2 - cRect.left;
          const pY = pRect.bottom - cRect.top + 2;

          [2 * pi, 2 * pi + 1].forEach((ci) => {
            if (ci >= childLevel.length) return;
            const cKey = `${li + 1}-${ci}`;
            const childEl = nodeRefs.current[cKey];
            if (!childEl) return;
            const cRect2 = childEl.getBoundingClientRect();
            const cX = cRect2.left + cRect2.width / 2 - cRect.left;
            const cY = cRect2.top - cRect.top - 2;
            const midY = (pY + cY) / 2;
            const d = `M ${pX} ${pY} C ${pX} ${midY + 12}, ${cX} ${midY - 12}, ${cX} ${cY}`;
            paths.push({ d, parentKey: pKey, childKey: cKey });
          });
        });
      }
      setConnectors(paths);
    };

    const t = setTimeout(measure, 80);
    return () => clearTimeout(t);
  }, [levels, numLevels]);

  // Decide connector highlight: path is highlighted if both endpoints are in the ancestor chain
  const isPathHighlighted = (parentKey, childKey) => {
    if (!hoveredId) return false;
    return highlightedIds.has(parentKey) && highlightedIds.has(childKey);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 64,            // ← 64px vertical gap between levels (spec: 60–80px)
        width: '100%',
        paddingBlock: 40,
        userSelect: 'none',
      }}
    >
      {/* SVG connector overlay */}
      <svg
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: 1,
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <defs>
          {/* Glow filter for highlighted paths */}
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Default (dim) lines rendered first */}
        {connectors.map((c, i) => (
          <path
            key={`dim-${i}`}
            d={c.d}
            stroke={isPathHighlighted(c.parentKey, c.childKey) ? 'transparent' : 'rgba(71,85,105,0.35)'}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Highlighted lines rendered on top */}
        {hoveredId && connectors
          .filter(c => isPathHighlighted(c.parentKey, c.childKey))
          .map((c, i) => (
            <path
              key={`hi-${i}`}
              d={c.d}
              stroke="#8b5cf6"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              filter="url(#lineGlow)"
              style={{ animation: 'pathPulse 1.6s ease-in-out infinite' }}
            />
          ))
        }
      </svg>

      {/* Level rows */}
      {levels.map((levelArray, li) => (
        <div
          key={li}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            position: 'relative',
            zIndex: 2,
            width: '100%',
          }}
        >
          {/* Level label */}
          <span style={{
            fontSize: 9,
            letterSpacing: '0.22em',
            color: '#334155',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}>
            {getLevelLabel(li)}
          </span>

          {/* Node row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,             // 20px horizontal gap between nodes
            flexWrap: 'nowrap',
          }}>
            {levelArray.map((hash, ni) => {
              const nodeKey = `${li}-${ni}`;
              const leftChild = levels[li + 1]?.[2 * ni] ?? null;
              const rightChild = levels[li + 1]?.[2 * ni + 1] ?? null;
              return (
                <div
                  key={ni}
                  ref={el => { nodeRefs.current[nodeKey] = el; }}
                  style={{ flexShrink: 0 }}
                >
                  <MerkleNode
                    hash={hash}
                    type={getNodeType(li)}
                    isRoot={li === 0}
                    leftChild={leftChild}
                    rightChild={rightChild}
                    nodeId={nodeKey}
                    isHighlighted={highlightedIds.has(nodeKey)}
                    onHover={handleHover}
                    lang={lang}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
