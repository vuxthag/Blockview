import React, { useState, useCallback, useEffect, useRef } from 'react';
import { LANG } from '../data/lang.js';
import { API } from '../utils/crypto.js';

// ── Cyberpunk Block Card ─────────────────────────────────────────────────────
function BlockCard({ block, index, isGenesis, onTamper, onRestore, t }) {
  const isValid = block.blockValid;
  const isTampered = block.tampered;

  const borderColor = isGenesis
    ? 'rgba(192,132,252,0.6)'
    : isValid ? 'rgba(56,189,248,0.5)' : 'rgba(251,113,133,0.7)';
  const glowColor = isGenesis
    ? 'rgba(192,132,252,0.18)'
    : isValid ? 'rgba(56,189,248,0.15)' : 'rgba(251,113,133,0.22)';

  return (
    <div className="anim-border" style={{
      '--glow-color': isGenesis ? 'var(--cyan)' : isValid ? 'var(--green)' : 'var(--red)',
      minWidth: 220, flexShrink: 0,
      background: 'var(--bg-glass)',
      border: `1px solid ${borderColor}`,
      borderRadius: 18,
      padding: 20,
      boxShadow: `0 0 24px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      backdropFilter: 'blur(12px)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 12px 32px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = `0 0 24px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`; }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: isGenesis
          ? 'linear-gradient(90deg, var(--cyan), var(--cyan2))'
          : isValid ? 'linear-gradient(90deg, var(--green), var(--blue))'
          : 'linear-gradient(90deg, var(--red), #f43f5e)',
      }} />
      {/* Shimmer overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
          color: isGenesis ? 'var(--cyan)' : isValid ? 'var(--green)' : 'var(--red)',
          padding: '4px 12px', borderRadius: 99,
          background: isGenesis ? 'rgba(192,132,252,0.1)' : isValid ? 'rgba(56,189,248,0.1)' : 'rgba(251,113,133,0.1)',
          border: `1px solid ${isGenesis ? 'rgba(192,132,252,0.3)' : isValid ? 'rgba(56,189,248,0.3)' : 'rgba(251,113,133,0.4)'}`,
          boxShadow: `0 0 10px ${isGenesis ? 'rgba(192,132,252,0.1)' : isValid ? 'rgba(56,189,248,0.1)' : 'rgba(251,113,133,0.15)'}`,
        }}>
          {isGenesis ? t.genesis : `${t.blockStr} #${block.index}`}
        </span>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: isGenesis ? 'var(--cyan)' : isValid ? 'var(--green)' : 'var(--red)',
          boxShadow: `0 0 10px ${isGenesis ? 'rgba(192,132,252,0.9)' : isValid ? 'rgba(56,189,248,0.9)' : 'rgba(251,113,133,0.9)'}`,
          animation: isTampered ? 'dotPulse 0.5s ease-in-out infinite alternate' : 'none',
        }} />
      </div>

      {/* Fields */}
      {[
        { label: t.timeStr, value: new Date(block.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), color: 'var(--text2)' },
        { label: t.dataStr, value: block.data.slice(0, 22) + (block.data.length > 22 ? '...' : ''), color: 'var(--text)' },
        { label: t.nonceStr, value: block.nonce.toLocaleString(), color: 'var(--amber)' },
        { label: t.hashStr, value: block.hash.slice(0, 10) + '...', color: isValid ? 'var(--green)' : 'var(--red)' },
        { label: t.prevHashStr, value: block.previousHash.slice(0, 10) + '...', color: 'var(--text3)' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 3 }}>{label}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color, padding: '5px 8px', background: 'var(--bg-input)', borderRadius: 6, wordBreak: 'break-all' }}>{value}</div>
        </div>
      ))}

      {/* Action Buttons */}
      {!isGenesis && (
        <div style={{ display: 'flex', gap: 6, marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
          {!isTampered ? (
            <button onClick={() => onTamper(block.index)} style={{
              flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, fontFamily: 'var(--sans)', letterSpacing: '0.5px',
              background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.4)',
              color: 'var(--red)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,113,133,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(251,113,133,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,113,133,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >{t.tamperBtn}</button>
          ) : (
            <button onClick={() => onRestore(block.index)} style={{
              flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, fontFamily: 'var(--sans)', letterSpacing: '0.5px',
              background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.4)',
              color: 'var(--green)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(56,189,248,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >{t.restoreBtn}</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Chain Connector Arrow ────────────────────────────────────────────────────
function ChainArrow({ valid }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', flexShrink: 0 }}>
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
        <line x1="0" y1="8" x2="24" y2="8" stroke={valid ? 'var(--green)' : 'var(--red)'} strokeWidth="2" strokeDasharray={valid ? '0' : '4 2'} />
        <polygon points="24,4 32,8 24,12" fill={valid ? 'var(--green)' : 'var(--red)'} />
      </svg>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function MiningView({ lang = "vi" }) {
  const t = LANG[lang].mining;
  const isVi = lang === "vi";

  const [activeSection, setActiveSection] = useState("explorer");
  const [chain, setChain] = useState(null);
  const [difficulty, setDifficulty] = useState(3);
  const [loading, setLoading] = useState(true);
  const [mineData, setMineData] = useState("");
  const [mining, setMining] = useState(false);
  const [mineResult, setMineResult] = useState(null);
  const [currentNonce, setCurrentNonce] = useState(0);
  const [currentHash, setCurrentHash] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [mineTarget, setMineTarget] = useState("");
  const [tamperIdx, setTamperIdx] = useState(null);
  const [tamperText, setTamperText] = useState("");
  const eventSourceRef = useRef(null);

  const loadChain = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/chain`);
      const d = await r.json();
      setChain(d);
      setDifficulty(d.difficulty);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => { loadChain(); }, [loadChain]);
  useEffect(() => () => { if (eventSourceRef.current) eventSourceRef.current.close(); }, []);

  const startMining = async () => {
    setMining(true); setMineResult(null);
    setCurrentNonce(0); setCurrentHash(""); setElapsed(0);
    setMineTarget("0".repeat(difficulty));
    try {
      const r = await fetch(`${API}/api/block/add`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mineData || `Block #${chain ? chain.length : 1}` })
      });
      const d = await r.json();
      if (!d.success) { setMining(false); return; }
      if (eventSourceRef.current) eventSourceRef.current.close();
      const es = new EventSource(`${API}/api/mine/stream?index=${d.block.index}`);
      eventSourceRef.current = es;
      es.onmessage = (e) => {
        const ev = JSON.parse(e.data);
        if (ev.error) { es.close(); setMining(false); return; }
        setCurrentNonce(ev.nonce); setCurrentHash(ev.hash); setElapsed(ev.elapsed || 0);
        if (ev.target) setMineTarget(ev.target);
        if (ev.done) {
          es.close(); eventSourceRef.current = null;
          setMining(false); setMineResult(ev);
          if (ev.chain) setChain(ev.chain);
        }
      };
      es.onerror = () => { es.close(); eventSourceRef.current = null; setMining(false); loadChain(); };
    } catch (e) { setMining(false); }
  };

  const stopMining = () => {
    if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
    setMining(false); loadChain();
  };

  const addBlock = async () => {
    const r = await fetch(`${API}/api/block/add`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: `Block #${chain ? chain.length : 1}` })
    });
    const d = await r.json();
    if (d.chain) setChain(d.chain);
  };

  const doTamper = async (index) => {
    const r = await fetch(`${API}/api/block/tamper`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, data: tamperText || "HACKED DATA!" })
    });
    const d = await r.json();
    if (d.chain) setChain(d.chain);
    setTamperIdx(null); setTamperText("");
  };

  const doRestore = async (index) => {
    const r = await fetch(`${API}/api/block/restore`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index })
    });
    const d = await r.json();
    if (d.chain) setChain(d.chain);
  };

  const changeDifficulty = async (newDiff) => {
    const r = await fetch(`${API}/api/difficulty`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty: newDiff })
    });
    const d = await r.json();
    setDifficulty(d.difficulty);
    await loadChain();
  };

  const resetChain = async () => {
    const r = await fetch(`${API}/api/reset`, { method: "POST", headers: { "Content-Type": "application/json" } });
    const d = await r.json();
    if (d.chain) setChain(d.chain);
  };

  const renderLiveHash = (hash, target) => {
    if (!hash) return null;
    const tLen = target ? target.length : 0;
    return (
      <span style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.5px', lineHeight: 2, wordBreak: 'break-all' }}>
        {[...hash].map((c, i) => {
          let color = 'var(--text3)';
          let glow = 'none';
          if (i < tLen) {
            color = c === '0' ? 'var(--green)' : 'var(--red)';
            glow = c === '0' ? '0 0 8px rgba(52,211,153,0.6)' : '0 0 8px rgba(248,113,113,0.6)';
          }
          return (
            <span key={i} style={{ color, textShadow: glow, fontWeight: i < tLen ? 700 : 400, transition: 'color 0.1s' }}>
              {c}
            </span>
          );
        })}
      </span>
    );
  };

  const hashRate = elapsed > 0 ? Math.round(currentNonce / (elapsed / 1000)) : 0;
  const tabs = [
    { id: "explorer", label: t.tabs.explorer },
    { id: "simulator", label: t.tabs.sim },
    { id: "difficulty", label: t.tabs.diff },
    { id: "education", label: t.tabs.edu },
  ];

  return (
    <div className="page">

      {/* ─── Tab Bar ─── */}
      <div style={{ position: 'sticky', top: 60, zIndex: 10, background: 'var(--nav-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', padding: '12px 24px' }}>
        <div className="tab-bar-scroll" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
              background: activeSection === tab.id ? 'rgba(34,211,238,0.1)' : 'none',
              border: activeSection === tab.id ? '1px solid rgba(34,211,238,0.3)' : '1px solid transparent',
              borderRadius: 10, padding: '8px 20px', fontFamily: 'var(--sans)',
              fontSize: 13, fontWeight: 600, color: activeSection === tab.id ? 'var(--cyan)' : 'var(--text2)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingTop: 40 }}>

        {/* ═══════ SIMULATOR TAB ═══════ */}
        {activeSection === "simulator" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>

            {/* Title */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
                {t.pow}
              </div>
              <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>{t.simTitle}</h2>
              <p style={{ color: 'var(--text2)', fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
                {t.simDesc}
              </p>
            </div>

            {/* Config Panel */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="grid-2" style={{ gap: 24, marginBottom: 20 }}>
                <div>
                  <div className="label">{t.blockData}</div>
                  <input className="inp" value={mineData} onChange={e => setMineData(e.target.value)}
                    placeholder={t.blockDataPlaceholder}
                    disabled={mining} />
                </div>
                <div>
                  <div className="label">{t.diffLabel} {difficulty}</div>
                  <div style={{ padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--amber)', fontWeight: 700, letterSpacing: 2 }}>
                      {"0".repeat(difficulty)}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {t.mustStart} {difficulty} {t.zeros}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {!mining ? (
                  <button className="btn btn-primary" onClick={startMining} style={{ boxShadow: '0 0 20px rgba(34,211,238,0.2)' }}>
                    {t.startMine}
                  </button>
                ) : (
                  <button className="btn" onClick={stopMining} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)', color: 'var(--red)' }}>
                    {t.stopMine}
                  </button>
                )}
                <button className="btn btn-ghost" onClick={resetChain} disabled={mining}>{t.resetChain}</button>
              </div>
            </div>

            {/* Live Mining Panel */}
            {(mining || mineResult) && (
              <div className="anim-border" style={{
                '--glow-color': mineResult ? 'var(--green)' : 'var(--cyan)',
                animation: 'fadeInUp 0.4s ease',
                background: 'var(--bg-card)',
                border: mineResult ? '1px solid rgba(56,189,248,0.4)' : '1px solid rgba(192,132,252,0.3)',
                borderRadius: 20, overflow: 'hidden', marginBottom: 24,
                boxShadow: mining ? '0 0 40px rgba(192,132,252,0.08)' : mineResult ? '0 0 40px rgba(56,189,248,0.1)' : 'none',
              }}>
                {/* Nonce Big Display */}
                <div style={{ textAlign: 'center', padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
                  {mining && (
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute', width: '1px', height: '60%',
                          left: `${25 + i * 25}%`, top: '20%',
                          background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.2), transparent)',
                          animation: `flow 1.5s ${i * 0.3}s infinite`,
                        }} />
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>{t.nonceLabel}</div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 'clamp(40px,8vw,72px)', fontWeight: 900, lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--cyan), var(--blue))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    filter: mining ? 'drop-shadow(0 0 20px rgba(34,211,238,0.4))' : 'none',
                    transition: 'filter 0.3s',
                  }}>
                    {currentNonce.toLocaleString()}
                  </div>
                  {mining && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', animation: `dotPulse 1.2s ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  )}
                  {mineResult && !mineResult.failed && (
                    <div style={{ marginTop: 12, fontSize: 14, color: 'var(--green)', fontWeight: 600 }}>
                      {t.foundHash} {currentNonce.toLocaleString()} {t.tries}
                    </div>
                  )}
                </div>

                {/* Live Hash Display */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="label">{t.currentHash}</div>
                  <div style={{
                    padding: '14px 18px', background: 'var(--bg-input)',
                    border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, minHeight: 64,
                  }}>
                    {renderLiveHash(currentHash, mineTarget)}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text3)' }}>
                    {t.targetLabel}{' '}
                    <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontWeight: 700 }}>{mineTarget}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '16px 24px', gap: 8 }}>
                  {[
                    { label: t.statTime, value: `${(elapsed / 1000).toFixed(1)}s`, color: 'var(--cyan)' },
                    { label: t.statRate, value: hashRate.toLocaleString(), color: 'var(--amber)' },
                    { label: t.statTries, value: currentNonce.toLocaleString(), color: 'var(--blue)' },
                    { label: t.statDiff, value: difficulty, color: 'var(--purple)' },
                  ].map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '12px', background: 'var(--bg2)', borderRadius: 10 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="anim-border" style={{ '--glow-color': 'var(--cyan)', padding: '16px 20px', background: 'rgba(192,132,252,0.03)', border: '1px solid rgba(192,132,252,0.12)', borderRadius: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                {t.howItWorks}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>{t.miningTip}</p>
            </div>
          </div>
        )}

        {/* ═══════ EXPLORER TAB ═══════ */}
        {activeSection === "explorer" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>{t.chainState}</div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 10 }}>{t.expTitle}</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>{t.expDesc}</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={addBlock}>{t.addBlockBtn}</button>
                <button className="btn btn-ghost btn-sm" onClick={resetChain}>{t.resetBtn}</button>
                {chain && (
                  <div style={{
                    marginLeft: 'auto', padding: '6px 14px',
                    background: chain.valid ? 'rgba(56,189,248,0.1)' : 'rgba(251,113,133,0.1)',
                    border: `1px solid ${chain.valid ? 'rgba(56,189,248,0.4)' : 'rgba(251,113,133,0.4)'}`,
                    borderRadius: 99, fontSize: 12, fontWeight: 700, letterSpacing: '0.5px',
                    color: chain.valid ? 'var(--green)' : 'var(--red)',
                    boxShadow: `0 0 12px ${chain.valid ? 'rgba(56,189,248,0.15)' : 'rgba(251,113,133,0.15)'}`,
                  }}>
                    <span style={{ marginRight: 6, display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: chain.valid ? 'var(--green)' : 'var(--red)', verticalAlign: 'middle', boxShadow: chain.valid ? '0 0 8px rgba(56,189,248,0.8)' : '0 0 8px rgba(251,113,133,0.8)' }} />
                    {chain.valid ? t.chainValid : t.chainInvalid}
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Chain */}
            <div style={{ overflowX: 'auto', paddingBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'max-content', paddingBottom: 4 }}>
                {chain && chain.chain.map((block, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <ChainArrow valid={block.blockValid} />}
                    <BlockCard
                      block={block} index={i}
                      isGenesis={i === 0}
                      onTamper={(idx) => { setTamperIdx(idx); setTamperText(""); }}
                      onRestore={doRestore}
                      t={t}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Tamper Panel */}
            {tamperIdx !== null && (
              <div className="anim-border" style={{
                '--glow-color': 'var(--red)',
                animation: 'fadeInUp 0.3s ease', marginTop: 20, padding: '20px 24px',
                background: 'rgba(251,113,133,0.04)', border: '1px solid rgba(251,113,133,0.3)', borderRadius: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)', marginBottom: 8 }}>
                  {t.tamperBlock} #{tamperIdx}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.7 }}>{t.tamperDesc}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input className="inp" style={{ flex: 1 }} value={tamperText}
                    onChange={e => setTamperText(e.target.value)} placeholder={t.fakeDataPlaceholder} />
                  <button className="btn btn-sm" onClick={() => doTamper(tamperIdx)} style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.4)', color: 'var(--red)' }}>{t.tamperBtn}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTamperIdx(null)}>{t.cancelBtn}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ DIFFICULTY TAB ═══════ */}
        {activeSection === "difficulty" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 8 }}>{t.networkSetting}</div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 10 }}>{t.diffTitle}</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14 }}>{t.diffDesc}</p>
            </div>

            <div className="card" style={{ marginBottom: 28 }}>
              <div className="label">{t.chooseDiff}</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(d => (
                  <button key={d} onClick={() => changeDifficulty(d)} style={{
                    width: 48, height: 48, borderRadius: 12, fontSize: 18, fontWeight: 800,
                    fontFamily: 'var(--mono)', cursor: 'pointer', transition: 'all 0.2s',
                    background: d === difficulty ? 'linear-gradient(135deg, var(--cyan), var(--blue))' : 'rgba(255,255,255,0.04)',
                    border: d === difficulty ? 'none' : '1px solid var(--border)',
                    color: d === difficulty ? '#030712' : 'var(--text2)',
                    boxShadow: d === difficulty ? '0 0 18px rgba(34,211,238,0.3)' : 'none',
                  }}>
                    {d}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>
                {t.currentDiff} <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{difficulty}</span>
                {' — '}
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--green)' }}>{"0".repeat(difficulty)}</span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{"x".repeat(Math.min(12, 64 - difficulty))}</span>
              </p>
            </div>

            <div className="label" style={{ marginBottom: 14 }}>{t.compareTarget}</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[1, 2, 3, 4, 5].map(d => (
                <div key={d} onClick={() => changeDifficulty(d)} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center', gap: 20, padding: '14px 20px',
                  background: d === difficulty ? 'rgba(34,211,238,0.05)' : 'var(--bg1)',
                  border: `1px solid ${d === difficulty ? 'rgba(34,211,238,0.35)' : 'var(--border)'}`,
                  borderRadius: 14, transition: 'all 0.25s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { if (d !== difficulty) e.currentTarget.style.borderColor = 'var(--border2)'; }}
                  onMouseLeave={e => { if (d !== difficulty) e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800,
                    background: d === difficulty ? 'linear-gradient(135deg, var(--cyan), var(--blue))' : 'var(--bg2)',
                    color: d === difficulty ? '#030712' : 'var(--text2)',
                  }}>{d}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>{"0".repeat(d)}</span>
                    <span style={{ color: 'var(--text3)' }}>{"x".repeat(Math.min(20, 64 - d))}</span>
                    <span style={{ color: 'var(--text3)', fontSize: 11 }}>...</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--amber)', fontWeight: 700 }}>
                      ~{Math.pow(16, d).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>{t.attempts}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="anim-border" style={{ '--glow-color': 'var(--purple)', marginTop: 28, padding: '20px 24px', background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 10 }}>{t.rule}</div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
                {t.rulePre1} <strong style={{ color: 'var(--amber)' }}>{t.ruleBold1}</strong>{t.rulePre2} <strong style={{ color: 'var(--red)' }}>{t.ruleBold2}</strong> {t.rulePost}
              </p>
            </div>
          </div>
        )}

        {/* ═══════ EDUCATION TAB ═══════ */}
        {activeSection === "education" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 8 }}>{t.kb}</div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, letterSpacing: '-0.5px' }}>{t.theoryTitle}</h2>
            </div>
            <div style={{ display: 'grid', gap: 20 }}>
              {[
                {
                  color: 'var(--cyan)', label: `${t.concept} 01`,
                  title: t.concept1Title,
                  body: (<><p>{t.concept1P1}</p><div style={{ marginTop: 14, background: 'var(--bg-input)', border: '1px solid var(--border)', borderLeft: '3px solid var(--cyan)', borderRadius: 10, padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.9 }}>SHA256(index + timestamp + data + prevHash + <span style={{ color: 'var(--amber)' }}>nonce</span>)<br /><span style={{ color: 'var(--green)' }}>→ "000abc91f..." ✓ {t.concept1Valid}</span></div></>),
                },
                {
                  color: 'var(--amber)', label: `${t.concept} 02`,
                  title: t.concept2Title,
                  body: (<><p>{t.concept2P1}</p><p style={{ color: 'var(--text2)', marginTop: 10 }}>{t.concept2P2}</p></>),
                },
                {
                  color: 'var(--purple)', label: `${t.concept} 03`,
                  title: t.concept3Title,
                  body: (<div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
                      {[1, 2, 3, 4, 5].map(d => (
                        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--mono)', fontSize: 13, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 8 }}>
                          <span style={{ color: 'var(--purple)', minWidth: 60 }}>Diff = {d}</span>
                          <span style={{ color: 'var(--green)', fontWeight: 700 }}>{"0".repeat(d)}</span>
                          <span style={{ color: 'var(--text3)' }}>{"x".repeat(10)}</span>
                          <span style={{ marginLeft: 'auto', color: 'var(--amber)', fontSize: 12 }}>~{Math.pow(16, d).toLocaleString()} {t.attempts}</span>
                        </div>
                      ))}
                    </div>)
                },
                {
                  color: 'var(--green)', label: `${t.concept} 04`,
                  title: t.concept4Title,
                  body: (<><p>{t.concept4P1}</p><p style={{ color: 'var(--text2)', marginTop: 10 }}>{t.concept4P2}</p></>),
                },
                {
                  color: 'var(--red)', label: `${t.concept} 05`,
                  title: t.concept5Title,
                  body: (<><p>{t.concept5P1}</p><p style={{ color: 'var(--text2)', marginTop: 10 }}>{t.concept5P2}</p></>),
                },
              ].map((item, i) => (
                <div key={i} className="card" style={{ animation: `fadeInUp 0.4s ${i * 0.07}s both`, borderLeft: `3px solid ${item.color}`, padding: '24px 28px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: item.color, marginBottom: 8 }}>{item.label}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>{item.title}</h3>
                  <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}