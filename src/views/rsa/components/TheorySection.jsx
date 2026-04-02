import React from 'react';

// ─── Symmetric vs Asymmetric comparison data ─────────────────────────────────
const getComparison = (t) => [
  { aspect: 'Số lượng key', sym: '1 key (bí mật)', asym: '2 key (public + private)' },
  { aspect: 'Tốc độ', sym: '⚡ Nhanh', asym: '🐢 Chậm hơn' },
  { aspect: 'Phân phối key', sym: '❌ Khó (cần kênh bảo mật)', asym: '✅ Dễ (public key công khai)' },
  { aspect: 'Dùng cho', sym: 'Mã hóa dữ liệu lớn', asym: 'Trao đổi key, chữ ký số' },
  { aspect: 'Ví dụ', sym: 'AES-256, ChaCha20', asym: 'RSA-2048, ECDSA, Ed25519' },
  { aspect: 'Trong Blockchain', sym: 'Mã hóa payload tx', asym: 'Chữ ký số giao dịch' },
];

// ─── Real-world analogies ─────────────────────────────────────────────────────
const ANALOGIES = [
  {
    icon: '📬',
    title: 'Hộp thư có khóa',
    desc: 'Public Key là địa chỉ hộp thư — ai cũng biết và gửi thư vào được. Private Key là chìa khóa — chỉ bạn mở ra đọc.',
  },
  {
    icon: '🔏',
    title: 'Niêm phong phong bì',
    desc: 'Bất kỳ ai cũng có thể niêm phong (mã hóa bằng public key), nhưng chỉ người có con dấu gốc (private key) mới mở được.',
  },
  {
    icon: '✍️',
    title: 'Chữ ký tay',
    desc: 'Bạn ký bằng private key → bất kỳ ai có public key đều xác minh được chữ ký đó là của bạn, nhưng không ai giả mạo được.',
  },
];

// ─── Animated Flow Diagram ────────────────────────────────────────────────────
function EncryptionFlow({ t }) {
  return (
    <div className="rsa-flow-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Sender */}
        <div className="rsa-flow-actor">
          <div className="rsa-flow-actor-icon">👩</div>
          <div className="rsa-flow-actor-label">{t.sender.split(' ')[0]}<br /><span style={{ color: 'var(--text3)', fontSize: 11 }}>{t.sender.substring(t.sender.indexOf(' '))}</span></div>
        </div>

        <div className="rsa-flow-step-group">
          <div className="rsa-flow-node rsa-node-plain">
            <span className="rsa-node-icon">📄</span>
            <span>{t.plaintext}</span>
          </div>
          <div className="rsa-flow-arrow">
            <svg width="48" height="24" viewBox="0 0 48 24">
              <defs>
                <marker id="arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="var(--cyan)" />
                </marker>
              </defs>
              <line x1="2" y1="12" x2="42" y2="12" stroke="var(--cyan)" strokeWidth="2"
                strokeDasharray="6 3" markerEnd="url(#arr1)"
                style={{ animation: 'rsa-dash 1.2s linear infinite' }} />
            </svg>
          </div>
          <div className="rsa-flow-node rsa-node-encrypt">
            <span className="rsa-node-icon">🔑</span>
            <span>{t.encrypt}</span>
            <span style={{ fontSize: 10, color: 'var(--amber)', marginTop: 2 }}>{t.pubKey}</span>
          </div>
          <div className="rsa-flow-arrow">
            <svg width="48" height="24" viewBox="0 0 48 24">
              <defs>
                <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="var(--cyan)" />
                </marker>
              </defs>
              <line x1="2" y1="12" x2="42" y2="12" stroke="var(--cyan)" strokeWidth="2"
                strokeDasharray="6 3" markerEnd="url(#arr2)"
                style={{ animation: 'rsa-dash 1.2s linear infinite 0.4s' }} />
            </svg>
          </div>
          <div className="rsa-flow-node rsa-node-cipher">
            <span className="rsa-node-icon">🔐</span>
            <span>{t.ciphertext}</span>
          </div>
        </div>

        {/* Internet */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
          <div style={{ fontSize: 28 }}>🌐</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>Internet</div>
        </div>

        <div className="rsa-flow-step-group">
          <div className="rsa-flow-node rsa-node-cipher">
            <span className="rsa-node-icon">🔐</span>
            <span>{t.ciphertext}</span>
          </div>
          <div className="rsa-flow-arrow">
            <svg width="48" height="24" viewBox="0 0 48 24">
              <defs>
                <marker id="arr3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="var(--purple)" />
                </marker>
              </defs>
              <line x1="2" y1="12" x2="42" y2="12" stroke="var(--purple)" strokeWidth="2"
                strokeDasharray="6 3" markerEnd="url(#arr3)"
                style={{ animation: 'rsa-dash 1.2s linear infinite 0.8s' }} />
            </svg>
          </div>
          <div className="rsa-flow-node rsa-node-decrypt">
            <span className="rsa-node-icon">🗝️</span>
            <span>{t.decrypt}</span>
            <span style={{ fontSize: 10, color: 'var(--purple)', marginTop: 2 }}>{t.privKey}</span>
          </div>
          <div className="rsa-flow-arrow">
            <svg width="48" height="24" viewBox="0 0 48 24">
              <defs>
                <marker id="arr4" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="var(--purple)" />
                </marker>
              </defs>
              <line x1="2" y1="12" x2="42" y2="12" stroke="var(--purple)" strokeWidth="2"
                strokeDasharray="6 3" markerEnd="url(#arr4)"
                style={{ animation: 'rsa-dash 1.2s linear infinite 1.2s' }} />
            </svg>
          </div>
          <div className="rsa-flow-node rsa-node-plain">
            <span className="rsa-node-icon">📄</span>
            <span>{t.plaintext}</span>
          </div>
        </div>

        {/* Receiver */}
        <div className="rsa-flow-actor">
          <div className="rsa-flow-actor-icon">👨</div>
          <div className="rsa-flow-actor-label">{t.receiver.split(' ')[0]}<br /><span style={{ color: 'var(--text3)', fontSize: 11 }}>{t.receiver.substring(t.receiver.indexOf(' '))}</span></div>
        </div>
      </div>

      {/* Key legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        <div className="rsa-key-badge rsa-key-public">🔑 {t.legendPub}</div>
        <div className="rsa-key-badge rsa-key-private">🗝️ {t.legendPriv}</div>
      </div>
    </div>
  );
}

// ─── Main TheorySection component ────────────────────────────────────────────
export default function TheorySection({ lang = 'vi' }) {
  // Use lazy loading or passed prop? Better yet, import it directly.
  return <TheorySectionContent lang={lang} />;
}

import { LANG } from '../../../data/lang.js';

function TheorySectionContent({ lang }) {
  const t = LANG[lang]?.rsa || LANG['vi'].rsa;
  const COMPARISON = getComparison(t);

  return (
    <div className="rsa-section-content" style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="badge badge-cyan" style={{ marginBottom: 12 }}>📚 {t.theoryTitle.split(' ')[0]}</div>
        <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, margin: '0 0 12px' }}>
          {t.theoryTitle}
        </h2>
        <p style={{ color: 'var(--text2)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          {t.theoryDesc}
        </p>
      </div>

      {/* Key pair explanation */}
      <div className="grid-2" style={{ marginBottom: 32, gap: 16 }}>
        <div className="card" style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'linear-gradient(145deg, rgba(251,191,36,0.05), var(--bg1))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 36 }}>🔑</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--amber)' }}>{t.pubKey}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.pubKeySub}</div>
            </div>
          </div>
          <ul style={{ color: 'var(--text2)', lineHeight: 2, fontSize: 14, paddingLeft: 20, margin: 0 }}>
            <li>{t.pubKey1}</li>
            <li>{t.pubKey2}</li>
            <li>{t.pubKey3}</li>
            <li>{t.pubKey4}</li>
          </ul>
        </div>

        <div className="card" style={{ borderColor: 'rgba(167,139,250,0.3)', background: 'linear-gradient(145deg, rgba(167,139,250,0.05), var(--bg1))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 36 }}>🗝️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--purple)' }}>{t.privKey}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.privKeySub}</div>
            </div>
          </div>
          <ul style={{ color: 'var(--text2)', lineHeight: 2, fontSize: 14, paddingLeft: 20, margin: 0 }}>
            <li>{t.privKey1}</li>
            <li>{t.privKey2}</li>
            <li>{t.privKey3}</li>
            <li>{t.privKey4}</li>
          </ul>
        </div>
      </div>

      {/* Encryption Flow */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>🔄 {t.flowTitle}</h3>
        </div>
        <EncryptionFlow t={t} />
      </div>

      {/* Real-world analogies */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text2)' }}>
          💡 {t.analogiesTitle}
        </h3>
        <div className="grid-3" style={{ gap: 16 }}>
          {t.analogies.map((a, i) => (
            <div key={i} className="card card-sm" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{['📬','🔏','✍️'][i]}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--cyan)' }}>{a.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Symmetric vs Asymmetric comparison */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
          ⚖️ {t.compareTitle}
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="rsa-compare-table">
            <thead>
              <tr>
                {t.compareHeaders.map((th, i) => <th key={i}>{i === 1 ? '🔒 ' : i === 2 ? '🔀 ' : ''}{th}</th>)}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i}>
                  <td>{row.aspect}</td>
                  <td style={{ color: 'var(--green)' }}>{row.sym}</td>
                  <td style={{ color: 'var(--cyan)' }}>{row.asym}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card card-sm" style={{
          marginTop: 16, background: 'rgba(192,132,252,0.05)',
          borderColor: 'rgba(192,132,252,0.2)', fontSize: 13
        }}>
          💡 <strong>{t.compareTip}</strong>
        </div>
      </div>
    </div>
  );
}
