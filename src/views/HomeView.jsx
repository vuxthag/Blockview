import React, { useState, useEffect, useRef } from 'react';
import { LANG } from '../data/lang.js';
import { API, apiHash, sha256browser } from '../utils/crypto.js';
import BlockchainCanvas from '../components/BlockchainCanvas.jsx';

function DigitalClock({ t }) {
  const [uptime, setUptime] = useState("00:00:00");
  const [genesisTime, setGenesisTime] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/chain`)
      .then(r => r.json())
      .then(d => {
        if (d && d.chain && d.chain.length > 0) {
          setGenesisTime(d.chain[0].timestamp);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!genesisTime) return;
    const updateClock = () => {
      const diff = Math.max(0, Math.floor((Date.now() - genesisTime) / 1000));
      const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [genesisTime]);

  if (error || !genesisTime) return null;

  return (
    <div style={{
      fontFamily: 'var(--mono)',
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.7)',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '4px 14px',
      borderRadius: '99px',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      letterSpacing: '1px',
      fontWeight: 600,
    }}>
      <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 2 }}>{t.uptime}</span>
      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)', animation: 'blink 1s infinite' }} />
      {uptime}
    </div>
  );
}

const FEATURES = [
  { icon: "🔐", title: "Fixed-Length Output", desc: "SHA-256 luôn tạo ra đúng 256 bits (64 ký tự hex), bất kể kích thước đầu vào — từ 1 byte đến 1 terabyte.", color: "var(--cyan)" },
  { icon: "⛔", title: "One-Way Function", desc: "Không thể tái tạo dữ liệu gốc từ hash output. Đây là nền tảng của bảo mật số hiện đại.", color: "var(--blue)" },
  { icon: "🌊", title: "Avalanche Effect", desc: "Thay đổi 1 ký tự khiến ~50% output bits thay đổi hoàn toàn ngẫu nhiên — không thể đoán trước.", color: "var(--purple)" },
  { icon: "🧬", title: "Collision Resistant", desc: "Xác suất tìm hai đầu vào khác nhau có cùng hash output gần bằng 0 — an toàn tuyệt đối.", color: "var(--green)" }
];

export default function HomeView({ setTab, lang = "vi" }) {
  const t = LANG[lang].home;
  const features = LANG[lang].features;
  const [demoInput, setDemoInput] = useState("Hello, SVNCKH!");
  const [demoHash, setDemoHash] = useState("");
  const [computing, setComputing] = useState(false);
  const [typedHash, setTypedHash] = useState("");
  const typedRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    setComputing(true);
    const run = async () => {
      const h = await apiHash(demoInput) || await sha256browser(demoInput);
      if (!cancelled) { setDemoHash(h); setComputing(false); }
    };
    const t = setTimeout(run, 180);
    return () => { cancelled = true; clearTimeout(t); };
  }, [demoInput]);

  // Typewriter effect for hash display on Home
  useEffect(() => {
    if (!demoHash) return;
    typedRef.current = "";
    setTypedHash("");
    let i = 0;
    const tick = setInterval(() => {
      typedRef.current = demoHash.slice(0, i + 1);
      setTypedHash(typedRef.current);
      i++;
      if (i >= demoHash.length) clearInterval(tick);
    }, 18);
    return () => clearInterval(tick);
  }, [demoHash]);

  return (
    <div className="page">
      {/* ── Animated Hero ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(180deg, var(--bg1) 0%, var(--bg) 100%)",
        borderBottom: "1px solid var(--border)",
        minHeight: 520,
      }}>
        {/* Blockchain canvas layer */}
        <BlockchainCanvas />

        {/* Radial glow overlays */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(34,211,238,0.13) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, var(--bg), transparent)", pointerEvents: "none", zIndex: 1 }} />

        <div className="section" style={{ paddingTop: 90, paddingBottom: 70, textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ animation: "fadeIn 0.7s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
              <span className="badge badge-cyan" style={{ fontSize: 12, padding: "5px 14px" }}>{t.badge}</span>
              <DigitalClock t={t} />
            </div>

            <h1 style={{ fontFamily: "var(--sans)", fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", marginBottom: 18 }}>
              <span style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 24px rgba(34,211,238,0.35))" }}>{t.title1}</span>
              <br />
              <span style={{ fontSize: "0.65em", letterSpacing: "-1px", background: "linear-gradient(135deg, #22d3ee, #3b82f6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{t.title2}</span>
            </h1>

            <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "var(--text2)", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.9 }}>
              {t.desc}
            </p>

            {/* Animated hash pill */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div className="anim-border" style={{
                '--glow-color': 'var(--cyan)',
                background: "var(--bg-card)", border: "1px solid rgba(192,132,252,0.25)",
                borderRadius: 12, padding: "10px 18px",
                fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)",
                letterSpacing: "1px", backdropFilter: "blur(8px)",
                boxShadow: "0 0 24px rgba(192,132,252,0.1)",
                maxWidth: 520, wordBreak: "break-all", textAlign: "left",
              }}>
                <span style={{ color: "var(--text3)", marginRight: 8 }}>SHA256(input) →</span>
                {typedHash}
                <span style={{ animation: "blink 1s infinite", color: "var(--cyan)" }}>|</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => setTab("demo")} style={{ fontSize: 15, padding: "13px 30px", boxShadow: "0 0 32px rgba(34,211,238,0.3)" }}>
                {t.tryDemo}
              </button>
              <button className="btn btn-secondary" onClick={() => setTab("about")} style={{ fontSize: 15, padding: "13px 24px" }}>
                {t.aboutProject}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--border)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { val: "256", unit: "bits", label: t.stats.fixed },
            { val: "64", unit: "hex chars", label: t.stats.each },
            { val: "2²⁵⁶", unit: "combinations", label: t.stats.irreversible },
            { val: "~50%", unit: "bits changed", label: t.stats.avalanche },
          ].map((s, i) => (
            <div key={i} style={{ padding: "8px 32px", borderRight: i < 3 ? "1px solid var(--border)" : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color: "var(--cyan)" }}>
                {s.val} <span style={{ fontSize: 12, color: "var(--blue)" }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live mini demo ── */}
      <div className="section section-sm" style={{ paddingBottom: 0 }}>
        <div className="card anim-border" style={{ '--glow-color': 'var(--cyan)', background: "var(--bg-glass)", border: "1px solid rgba(192,132,252,0.2)", animation: "fadeInUp 0.6s 0.1s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)", boxShadow: "var(--glow-cyan)", animation: "dotPulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>{t.liveLabel}</span>
          </div>
          <div className="live-demo-grid">
            <div>
              <div className="label">{t.inputLabel}</div>
              <input className="inp" value={demoInput} onChange={e => setDemoInput(e.target.value)} placeholder={t.inputPlaceholder} />
            </div>
            <div className="live-demo-arrow">→</div>
            <div>
              <div className="label">{t.outputLabel} <span style={{ color: "var(--cyan)", textTransform: "none" }}>({t.alwaysChars})</span></div>
              <div style={{ minHeight: 46, padding: "12px 16px", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 12 }}>
                {computing ? (
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>{t.computingStr}</span>
                ) : (
                  <span className="hash-display" style={{ fontSize: 11, lineHeight: 1.9 }}>
                    {demoHash.slice(0, 32)}<br />{demoHash.slice(32)}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: "var(--text3)" }}>
                {t.lenLabel} <span style={{ color: "var(--green)", fontFamily: "var(--mono)" }}>{demoHash.length}</span> {t.hexChars} = <span style={{ color: "var(--cyan)", fontFamily: "var(--mono)" }}>256 bits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Properties ── */}
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10 }}>{t.propTitle}</h2>
          <p style={{ color: "var(--text2)", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>{t.propDesc}</p>
        </div>
        <div className="grid-2" style={{ gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="card anim-border" style={{ '--glow-color': f.color, animation: `fadeInUp 0.5s ${i * 0.08}s both`, cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 28, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", flexShrink: 0 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cyan)" }}>{f.title}</div>
              </div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}  
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <button className="btn btn-primary" onClick={() => setTab("demo")} style={{ fontSize: 15, padding: "14px 34px", boxShadow: "0 0 32px rgba(34,211,238,0.25)" }}>
            {t.openDemo}
          </button>
        </div>
      </div>
    </div>
  );
}