'use client';
import React, { useState, useEffect } from 'react';
import GlitchText from '@/components/GlitchText';

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: number;
  description: string;
  type: string;
  order_index: number;
}

const empty = {
  title: '', company: '', location: '', start_date: '',
  end_date: '', is_current: false, description: '', type: 'work', order_index: 0,
};

export default function CockpitPage() {
  // ===== ALL HOOKS AT TOP — no exceptions =====
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [busted, setBusted] = useState(false);
  const [incidentId] = useState(() => Math.random().toString(16).slice(2, 10).toUpperCase());
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Alarm sound — gated by busted state, but hook is always called
  useEffect(() => {
    if (!busted) return;
    const ctx = new AudioContext();
    const playBeep = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    };
    playBeep(ctx.currentTime, 880);
    playBeep(ctx.currentTime + 0.35, 880);
    playBeep(ctx.currentTime + 0.70, 660);
    return () => { ctx.close(); };
  }, [busted]);

  useEffect(() => {
    if (authed) loadExperiences();
  }, [authed]);

  // ===== FUNCTIONS =====
  const login = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setError('');
      loadExperiences();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setBusted(true);
      } else {
        setError(`ACCESS DENIED — ${2 - newAttempts} attempt remaining before lockout.`);
      }
    }
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
  };

  const loadExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (e) {
      setExperiences([]);
    }
  };

  const save = async () => {
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/experiences/${editId}` : '/api/experiences';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setMsg(editId ? '✅ Updated!' : '✅ Added!');
    setForm(empty);
    setEditId(null);
    loadExperiences();
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
    loadExperiences();
  };

  const edit = (exp: Experience) => {
    setEditId(exp.id);
    setForm({ ...exp, is_current: exp.is_current === 1, end_date: exp.end_date || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== EARLY RETURNS AFTER ALL HOOKS =====

  // Busted screen
  if (busted) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden">
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none animate-pulse" style={{background: 'rgba(220,0,0,0.04)'}} />
      <div className="fixed top-0 left-0 right-0 h-1 bg-red-600 animate-pulse" />
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-red-600 animate-pulse" />
      <div className="w-full max-w-lg text-center">
        <div className="text-red-500 mb-6 animate-bounce">
          <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
            <path d="M32 8L56 52H8L32 8z" strokeLinejoin="round"/>
            <line x1="32" y1="28" x2="32" y2="38"/>
            <circle cx="32" cy="45" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="font-mono text-red-500 text-2xl font-bold mb-2 tracking-widest"
          style={{textShadow: '0 0 20px rgba(220,0,0,0.8)'}}>
          ⚠ UNAUTHORIZED ACCESS DETECTED
        </h1>
        <div className="border border-red-900/60 rounded-xl p-6 mt-6 bg-red-950/20 text-left space-y-3">
          <p className="font-mono text-red-400 text-xs"><span className="text-red-600">{'>'}</span> SECURITY BREACH PROTOCOL INITIATED</p>
          <p className="font-mono text-red-400 text-xs"><span className="text-red-600">{'>'}</span> INCIDENT ID: <span className="text-red-300">{incidentId}</span></p>
          <p className="font-mono text-red-400 text-xs"><span className="text-red-600">{'>'}</span> TIMESTAMP: <span className="text-red-300">{new Date().toISOString()}</span></p>
          <p className="font-mono text-red-400 text-xs"><span className="text-red-600">{'>'}</span> STATUS: <span className="text-red-300 animate-pulse">LOGGING SESSION DATA...</span></p>
          <p className="font-mono text-red-400 text-xs"><span className="text-red-600">{'>'}</span> ATTEMPTS: <span className="text-red-300">2 / 2 — THRESHOLD EXCEEDED</span></p>
          <div className="border-t border-red-900/40 pt-3 mt-3">
            <p className="font-mono text-red-500 text-xs animate-pulse">⚠ This incident has been recorded and flagged for review.</p>
            <p className="font-mono text-red-700 text-xs mt-2">Unauthorized access attempts may violate applicable laws.</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="font-mono text-red-700 text-xs mb-2">COLLECTING INCIDENT REPORT...</p>
          <div className="w-full bg-red-950 rounded-full h-1">
            <div className="bg-red-600 h-1 rounded-full animate-pulse" style={{width: '100%'}} />
          </div>
        </div>
        <button
          onClick={() => { setBusted(false); setAttempts(0); setPassword(''); setError(''); }}
          className="mt-8 text-xs font-mono text-red-900 hover:text-red-700 transition-colors underline"
        >
          I understand — go back
        </button>
      </div>
    </div>
  );

  // Login screen
  if (!authed) return (
    <div className="min-h-screen bg-[#03010a] flex items-center justify-center px-6">
      <div className="scanline" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <svg width="48" height="38" viewBox="0 0 951 759" fill="none" className="mx-auto mb-4 drop-shadow-[0_0_12px_rgba(167,139,250,0.7)]">
            <path d="M558.638 534.884C507.977 342.844 705.908 248.591 731.828 230.919L753.035 214.425C850.115 385.022 810.764 516.426 778.954 560.803C648.178 795.257 454.96 749.309 385.449 741.062C329.84 734.464 259.386 681.761 231.11 656.234C225.862 644.834 218.296 629.03 211.847 616.87C204.574 611.484 199.809 606.369 199.3 602.039C198.283 593.399 204.3 602.64 211.847 616.87C231.487 631.413 269.415 647.923 291.196 656.234C397.23 679.797 599.167 688.516 558.638 534.884Z" fill="#a78bfa"/>
            <line x1="6.5" y1="735.667" x2="941.641" y2="80.875" stroke="#a78bfa" strokeWidth="13" strokeLinecap="round"/>
            <circle cx="478.524" cy="414.712" r="337.522" stroke="#a78bfa" strokeWidth="13"/>
          </svg>
          <h1 className="text-2xl font-bold mb-1 neon-text"><GlitchText text="COCKPIT" /></h1>
          <p className="text-purple-500 text-sm font-mono">// restricted_access<span className="cursor-blink">_</span></p>
        </div>
        <div className="bg-white/3 border border-purple-900/40 rounded-2xl p-6">
          <label className="block text-purple-300 text-xs font-mono uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="terminal-input w-full bg-black/40 border border-purple-800/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none mb-4"
            placeholder="Enter admin password"
          />
          {error && <p className="text-red-400 text-xs mb-3 font-mono">{error}</p>}
          <button onClick={login} className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-all text-sm">
            Access Control Center
          </button>
        </div>
      </div>
    </div>
  );

  // Main cockpit
  return (
    <div className="min-h-screen bg-[#03010a] text-white">
      <div className="scanline" />
      <div className="border-b border-purple-900/30 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <svg width="28" height="22" viewBox="0 0 951 759" fill="none">
            <path d="M558.638 534.884C507.977 342.844 705.908 248.591 731.828 230.919L753.035 214.425C850.115 385.022 810.764 516.426 778.954 560.803C648.178 795.257 454.96 749.309 385.449 741.062C329.84 734.464 259.386 681.761 231.11 656.234C225.862 644.834 218.296 629.03 211.847 616.87C204.574 611.484 199.809 606.369 199.3 602.039C198.283 593.399 204.3 602.64 211.847 616.87C231.487 631.413 269.415 647.923 291.196 656.234C397.23 679.797 599.167 688.516 558.638 534.884Z" fill="#a78bfa"/>
            <circle cx="478.524" cy="414.712" r="337.522" stroke="#a78bfa" strokeWidth="13"/>
          </svg>
          <span className="font-mono text-sm tracking-widest neon-text"><GlitchText text="CONTROL_CENTER" intensity="low" /></span>
        </div>
        <div className="flex gap-3">
          <a href="/" className="text-xs text-purple-400 hover:text-purple-200 font-mono border border-purple-800/50 px-3 py-1.5 rounded-lg transition-colors">← View Site</a>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 font-mono border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white/2 border border-purple-900/30 rounded-2xl p-6 mb-10">
          <h2 className="font-bold text-lg mb-6">
            <span className="neon-text-cyan font-mono">{editId ? '> EDIT_RECORD' : '> ADD_NEW_RECORD'}</span>
          </h2>
          {msg && <div className="mb-4 text-green-400 text-sm font-mono">{msg}</div>}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'title', label: 'Job Title', placeholder: 'e.g. Software Engineer' },
              { key: 'company', label: 'Company', placeholder: 'e.g. PT ALTO Network' },
              { key: 'location', label: 'Location', placeholder: 'e.g. Jakarta, Indonesia' },
              { key: 'start_date', label: 'Start Date', placeholder: 'e.g. Jan 2024' },
              { key: 'end_date', label: 'End Date', placeholder: 'Leave blank if current' },
              { key: 'order_index', label: 'Order Index', placeholder: '1 = top' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-purple-400 text-xs font-mono uppercase tracking-widest mb-1">{f.label}</label>
                <input
                  value={form[f.key] || ''}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="terminal-input w-full bg-black/40 border border-purple-800/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-purple-400 text-xs font-mono uppercase tracking-widest mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Describe the role and key achievements..."
              className="terminal-input w-full bg-black/40 border border-purple-800/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none resize-none"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="is_current"
              checked={form.is_current}
              onChange={e => setForm({ ...form, is_current: e.target.checked })}
              className="w-4 h-4 accent-purple-500"
            />
            <label htmlFor="is_current" className="text-purple-300 text-sm">Currently working here</label>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-all"
            >
              {saving ? 'Saving...' : editId ? 'Update Experience' : 'Add Experience'}
            </button>
            {editId && (
              <button
                onClick={() => { setEditId(null); setForm(empty); }}
                className="px-6 py-2.5 border border-purple-800/50 text-purple-400 hover:text-white rounded-lg font-medium text-sm transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4 font-mono">
          <span className="neon-text-cyan">{'>'}</span>{' '}
          <span className="neon-text">EXPERIENCE_DATABASE</span>{' '}
          <span className="text-purple-600 text-sm">[{experiences.length} records]</span>
        </h2>
        <div className="space-y-3">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-white/2 border border-purple-900/30 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm">{exp.title}</h3>
                  {exp.is_current === 1 && <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">Current</span>}
                </div>
                <p className="text-purple-400 text-xs">{exp.company} · {exp.location}</p>
                <p className="text-purple-600 text-xs font-mono mt-1">{exp.start_date} – {exp.end_date || 'Present'}</p>
                <p className="text-purple-300 text-xs mt-2 line-clamp-2">{exp.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => edit(exp)} className="text-xs text-purple-400 hover:text-purple-200 border border-purple-800/50 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                <button onClick={() => del(exp.id)} className="text-xs text-red-500 hover:text-red-300 border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}