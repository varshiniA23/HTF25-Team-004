import React, { useState } from 'react';
import axios from 'axios';

function AnalysisForm() {
  const [form, setForm] = useState({ title: '', text: '', url: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/analyze', form);
      setTimeout(() => {
        setResult(res.data);
        setLoading(false);
      }, 1100); // Anim slider
    } catch (err) {
      setLoading(false);
      alert('Error connecting to backend: ' + (err.response?.data?.error || err.message));
    }
  };

  const verdictColor = verdict => {
    if (!verdict) return '#555';
    if (verdict.toLowerCase() === 'fake') return '#ff5252';
    if (verdict.toLowerCase() === 'real') return '#17dc8a';
    return '#f8ba18';
  };

  // DARK/LIGHT styles
  const bg = dark
    ? 'linear-gradient(120deg, #181d25 0%, #222431 100%)'
    : 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)';
  const cardBg = dark ? '#23283b' : '#ffffffcc';
  const inputBg = dark ? '#22252f' : '#f1f8fd';
  const labelColor = dark ? '#e6e6fa' : '#374151';
  const borderCol = dark ? '#8a9af1' : '#b9d5fa';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        transition: 'background 0.5s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* DARK MODE TOGGLE */}
      <div
        style={{
          position: 'fixed',
          top: 22,
          right: 32,
          zIndex: 99,
          userSelect: 'none',
        }}>
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDark(x => !x)}
          style={{
            padding: '8px 21px',
            borderRadius: 18,
            background: dark ? '#23283b' : '#f3f7fa',
            border: '1.5px solid #afb9cc',
            color: dark ? '#f5f6fa' : '#261d3a',
            fontWeight: 'bold',
            letterSpacing: 0.3,
            boxShadow: dark 
              ? '0 1px 8px rgba(0,0,0,0.45)'
              : '0 1px 8px rgba(80,80,130,0.22)',
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          {dark ? '☀️ Light' : '🌛 Dark'}
        </button>
      </div>
      {/* CARD */}
      <div
        style={{
          maxWidth: 470,
          width: '100%',
          background: cardBg,
          borderRadius: 24,
          boxShadow: dark ?
            '0 10px 40px rgba(46,45,77,0.29)' :
            '0 10px 40px rgba(46,45,77,0.14)',
          padding: '38px 32px 42px',
          margin: '30px 18px',
          transition: 'background 0.45s'
        }}>
        <h2
          style={{
            textAlign: 'center',
            fontWeight: 900,
            letterSpacing: 0.7,
            color: dark ? '#e3e7ff' : '#22314b',
            marginBottom: '36px',
            fontSize: 29
          }}>
          Fake News Detection
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 23 }}>
            <label
              style={{
                fontWeight: 600,
                color: labelColor,
                fontSize: 16
              }}>
              Article Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={128}
              placeholder="Headline of the news"
              style={{
                width: '100%',
                padding: 14,
                marginTop: 7,
                borderRadius: 9,
                border: `1.5px solid ${borderCol}`,
                fontSize: 16,
                background: inputBg,
                color: dark ? '#eee' : '#222',
                outline: 'none',
                transition: 'box-shadow 0.18s, background 0.28s',
                boxShadow: '0 0 0 0 #aad4fa',
              }}
              onFocus={e =>
                (e.target.style.boxShadow = '0 0 0 3px #a7c7f9')}
              onBlur={e =>
                (e.target.style.boxShadow = '0 0 0 0 #aad4fa')}
            />
          </div>
          <div style={{ marginBottom: 23 }}>
            <label
              style={{
                fontWeight: 600,
                color: labelColor,
                fontSize: 16
              }}>
              Article Text *
            </label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              required
              rows={7}
              placeholder="Paste the article here..."
              style={{
                width: '100%',
                padding: 14,
                marginTop: 7,
                borderRadius: 9,
                border: `1.5px solid ${borderCol}`,
                fontSize: 15.5,
                background: inputBg,
                color: dark ? '#eee' : '#222',
                outline: 'none',
                resize: 'vertical',
                minHeight: 110,
                maxHeight: 300,
                transition: 'box-shadow 0.18s, background 0.28s',
                boxShadow: '0 0 0 0 #aad4fa'
              }}
              onFocus={e =>
                (e.target.style.boxShadow = '0 0 0 3px #a7c7f9')}
              onBlur={e =>
                (e.target.style.boxShadow = '0 0 0 0 #aad4fa')}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                fontWeight: 600,
                color: labelColor,
                fontSize: 16
              }}>
              Source URL (optional)
            </label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              maxLength={255}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: 14,
                marginTop: 7,
                borderRadius: 9,
                border: `1.5px solid ${borderCol}`,
                fontSize: 15,
                background: inputBg,
                color: dark ? '#eee' : '#222',
                outline: 'none',
                transition: 'box-shadow 0.18s, background 0.28s',
                boxShadow: '0 0 0 0 #aad4fa'
              }}
              onFocus={e =>
                (e.target.style.boxShadow = '0 0 0 3px #a7c7f9')}
              onBlur={e =>
                (e.target.style.boxShadow = '0 0 0 0 #aad4fa')}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !form.title || !form.text}
            style={{
              width: '100%',
              padding: '15px 0',
              fontWeight: 'bold',
              fontSize: 18,
              color: '#fff',
              background: loading
                ? (dark ? 'linear-gradient(90deg,#111,#373b44)' : 'linear-gradient(90deg,#b6c0ee 10%,#84fab0 100%)')
                : (dark ? 'linear-gradient(90deg,#373b44 10%,#4286f4 100%)' : 'linear-gradient(90deg,#355c7d,#6c5b7b,#c06c84)'),
              border: 'none',
              borderRadius: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(60,50,70,0.12)',
              letterSpacing: 0.7,
              marginTop: 8,
              marginBottom: loading ? 14 : 0,
              transition: 'transform 0.14s, background 0.25s'
            }}
            onMouseOver={e =>
              (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={e =>
              (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? (
              <span>
                <span style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: 22, height: 22, marginRight: 10,
                  border: '3.5px solid #fff',
                  borderTop: '3.5px solid #8449be',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Analyzing…
              </span>
            ) : 'Analyze'}
          </button>
        </form>
        {/* Result Card */}
        {result && (
          <div
            style={{
              marginTop: 36,
              borderRadius: 15,
              padding: '29px 18px 21px',
              background: dark ? '#1a202c' : '#fff',
              boxShadow: dark
                ? '0 2px 12px rgba(20,20,54,0.13)'
                : '0 2px 12px rgba(54,54,74,0.13)',
              textAlign: 'center',
              border: `2.5px solid ${verdictColor(result.verdict)}`,
              animation: 'fadeIn 0.85s',
              color: dark ? '#fff' : verdictColor(result.verdict)
            }}
          >
            <div
              style={{
                fontSize: 36,
                marginBottom: 7,
                minHeight: 44,
                fontWeight: 'bold'
              }}>
              {result.verdict.toLowerCase() === 'fake' && <span style={{ color: '#ff5349' }}>❌</span>}
              {result.verdict.toLowerCase() === 'real' && <span style={{ color: '#13ce66' }}>✅</span>}
              {(result.verdict.toLowerCase() === 'uncertain' || result.verdict.toLowerCase() === 'unknown') && <span style={{ color: '#f6a821' }}>⚠️</span>}
            </div>
            <div
              style={{
                fontSize: 27,
                fontWeight: 900,
                color: verdictColor(result.verdict),
                marginBottom: 8,
                letterSpacing: 1.6,
                textTransform: 'uppercase'
              }}>
              {result.verdict}
            </div>
            {result.confidence && (
              <div style={{
                fontSize: 15.5,
                color: dark ? verdictColor(result.verdict) : '#212121',
                marginBottom: 8
              }}>
                Confidence:&nbsp;
                <span style={{
                  fontWeight: 800,
                  color: verdictColor(result.verdict)
                }}>{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
            <div
              style={{
                margin: '18px 0 2px',
                fontSize: 15.2,
                color: dark ? '#e0e0e0' : '#323a52',
                opacity: 0.77,
                fontWeight: 400
              }}>
              {result.verdict.toLowerCase() === 'fake'
                ? 'Warning: Article shows fake-news characteristics.'
                : result.verdict.toLowerCase() === 'real'
                ? 'This article appears authentic.'
                : 'Not enough evidence to decide.'}
            </div>
          </div>
        )}
      </div>
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
}

export default AnalysisForm;
