import React from 'react';
import { LANG } from '../data/lang.js';
import { TEAM_DATA, SUPERVISOR_DATA } from '../data/team.js';

export default function AboutTeamView({ lang = "vi" }) {
  const t = LANG[lang].team;
  const isVi = lang === "vi";

  // Combine all members to show them on the same level
  // Mapping SUPERVISOR_DATA to match TEAM_DATA model
  const combinedMembers = [
    {
      name: SUPERVISOR_DATA.name,
      roleVi: SUPERVISOR_DATA.titleVi,
      roleEn: SUPERVISOR_DATA.titleEn,
      avatar: SUPERVISOR_DATA.avatar,
      descVi: SUPERVISOR_DATA.descVi,
      descEn: SUPERVISOR_DATA.descEn,
      color: "var(--purple)"
    },
    ...TEAM_DATA
  ];

  return (
    <div className="page">
      <style>{`
        .carousel-container {
          overflow-x: hidden;
          padding: 20px 0;
          position: relative;
          width: 100%;
        }
        .carousel-track {
          display: flex;
          gap: 20px;
          animation: scroll 25s linear infinite;
          width: max-content;
        }
        .carousel-container:hover .carousel-track {
          animation-play-state: paused;
        }
        .carousel-card {
          width: 320px;
          flex-shrink: 0;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); }
        }
      `}</style>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div style={{ marginBottom: 40, animation: "fadeInUp 0.5s ease" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32, animation: "fadeInUp 0.5s ease" }}>
            {/* HUB Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 12, flex: "1 1 300px" }}>
              <img src="/images/logo_hub.png?v=2" alt="HUB" style={{ height: 60, borderRadius: 6, objectFit: "contain" }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--cyan)", marginBottom: 4 }}>{t.uni}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>Ho Chi Minh University of Banking (HUB) · Est. 1976</div>
              </div>
            </div>

            {/* Faculty Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: 12, flex: "1 1 300px" }}>
              <div style={{ width: 60, height: 60, borderRadius: 6, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                <img src="/images/logo_khoa.png?v=2" alt="Faculty Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'block') }} />
                {/* Fallback text if image not found */}
                <div style={{ display: "none", fontSize: 10, textAlign: "center", color: "var(--text3)", padding: 4 }}>Logo<br />Khoa</div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--purple)", marginBottom: 4 }}>{t.faculty}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{t.uniShort}</div>
              </div>
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 12, animation: "fadeInUp 0.5s 0.1s both" }}>{t.title}</h1>
          <p style={{ fontSize: 16, color: "var(--text2)", maxWidth: 600, lineHeight: 1.8, animation: "fadeInUp 0.5s 0.1s both" }}>{t.desc}</p>
        </div>

        {/* Team members Carousel */}
        <div className="carousel-container" style={{ animation: "fadeInUp 0.5s 0.2s both" }}>
          <div className="carousel-track">
            {[...combinedMembers, ...combinedMembers].map((m, i) => (
              <div key={i} className="card carousel-card anim-border" style={{ '--glow-color': m.color, transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <img src={m.avatar} alt={m.name} style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover", border: `2px solid ${m.color}66`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>{isVi ? m.roleVi : m.roleEn}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{isVi ? m.descVi : m.descEn}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Competition Context */}

        <div style={{ display: "flex", justifyContent: "center", animation: "fadeInUp 0.6s 0.5s both" }}>
          <div style={{ background: "linear-gradient(to right, rgba(34, 211, 238, 0.05), rgba(59, 130, 246, 0.05))", border: "1px solid rgba(34, 211, 238, 0.2)", borderRadius: 16, padding: "32px 48px", maxWidth: 800, textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>{t.competition}</h3>
            <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.8 }}>
              {t.compDesc}
            </p>
          </div>
        </div>

        {/* ── Thông tin liên lạc ── */}
        <div style={{ marginTop: 32, animation: 'fadeInUp 0.6s 0.6s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(56,189,248,0.35), transparent)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#38bdf8', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {LANG[lang].footerContactTitle}
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.35))' }} />
          </div>
          <a href="mailto:vtkteam2005@gmail.com" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12,
            padding: '5px 12px', borderRadius: 7,
            border: '1px solid rgba(56,189,248,0.18)', background: 'rgba(56,189,248,0.05)',
            fontSize: 11.5, color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.18)'; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            vtkteam2005@gmail.com
          </a>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {[
              { name: 'TS. Nguyễn Hoài Đức', role: LANG[lang].footerSupervisorRole, email: 'nguyenhoaduc@hub.edu.vn', phone: '000 111 2224' },
              { name: 'Lâm Tuấn Vũ', role: LANG[lang].footerTeamLeadRole, email: 'vtkteam2005@gmail.com', phone: '0867900730' },
            ].map(c => (
              <div key={c.name} style={{
                display: 'grid', gridTemplateColumns: '1fr 1px 1fr', alignItems: 'center',
                padding: '10px 14px', borderRadius: 8,
                border: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.02)',
              }}>
                <div style={{ paddingRight: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0', marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>{c.role}</div>
                </div>
                <div style={{ background: 'rgba(99,179,237,0.2)', alignSelf: 'stretch', margin: '4px 0' }} />
                <div style={{ paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#7dd3fc', textDecoration: 'none' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    {c.email}
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.47 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2z" /></svg>
                    {c.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}