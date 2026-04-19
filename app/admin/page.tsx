'use client';
import { useState, useEffect } from 'react';

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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const login = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); setError(''); loadExperiences(); }
    else setError('Wrong password. Try again.');
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
  };

  const loadExperiences = async () => {
    const res = await fetch('/api/experiences');
    const data = await res.json();
    setExperiences(data);
  };

  useEffect(() => {
    if (authed) loadExperiences();
  }, [authed]);

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

  // Login screen
  if (!authed) return (
    <div className="min-h-screen bg-[#03010a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <svg width="48" height="38" viewBox="0 0 951 759" fill="none" className="mx-auto mb-4 drop-shadow-[0_0_12px_rgba(167,139,250,0.7)]">
            <path d="M558.638 534.884C507.977 342.844 705.908 248.591 731.828 230.919L753.035 214.425C850.115 385.022 810.764 516.426 778.954 560.803C648.178 795.257 454.96 749.309 385.449 741.062C329.84 734.464 259.386 681.761 231.11 656.234C225.862 644.834 218.296 629.03 211.847 616.87C204.574 611.484 199.809 606.369 199.3 602.039C198.283 593.399 204.3 602.64 211.847 616.87C231.487 631.413 269.415 647.923 291.196 656.234C397.23 679.797 599.167 688.516 558.638 534.884Z" fill="#a78bfa"/>
            <line x1="6.5" y1="735.667" x2="941.641" y2="80.875" stroke="#a78bfa" strokeWidth="13" strokeLinecap="round"/>
            <circle cx="478.524" cy="414.712" r="337.522" stroke="#a78bfa" strokeWidth="13"/>
          </svg>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-purple-500 text-sm font-mono">// restricted access</p>
        </div>
        <div className="bg-white/3 border border-purple-900/40 rounded-2xl p-6">
          <label className="block text-purple-300 text-xs font-mono uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full bg-black/40 border border-purple-800/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 mb-4"
            placeholder="Enter admin password"
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button onClick={login} className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-all text-sm">
            Access Control Center
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#03010a] text-white font-[Space_Grotesk,sans-serif]">
      {/* Header */}
      <div className="border-b border-purple-900/30 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <svg width="28" height="22" viewBox="0 0 951 759" fill="none">
            <path d="M558.638 534.884C507.977 342.844 705.908 248.591 731.828 230.919L753.035 214.425C850.115 385.022 810.764 516.426 778.954 560.803C648.178 795.257 454.96 749.309 385.449 741.062C329.84 734.464 259.386 681.761 231.11 656.234C225.862 644.834 218.296 629.03 211.847 616.87C204.574 611.484 199.809 606.369 199.3 602.039C198.283 593.399 204.3 602.64 211.847 616.87C231.487 631.413 269.415 647.923 291.196 656.234C397.23 679.797 599.167 688.516 558.638 534.884Z" fill="#a78bfa"/>
            <circle cx="478.524" cy="414.712" r="337.522" stroke="#a78bfa" strokeWidth="13"/>
          </svg>
          <span className="font-mono text-purple-300 text-sm tracking-widest">ADMIN PANEL</span>
        </div>
        <div className="flex gap-3">
          <a href="/" className="text-xs text-purple-400 hover:text-purple-200 font-mono border border-purple-800/50 px-3 py-1.5 rounded-lg transition-colors">← View Site</a>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 font-mono border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Form */}
        <div className="bg-white/2 border border-purple-900/30 rounded-2xl p-6 mb-10">
          <h2 className="font-bold text-lg mb-6 text-purple-200">
            {editId ? '✏️ Edit Experience' : '➕ Add New Experience'}
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
                  className="w-full bg-black/40 border border-purple-800/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
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
              className="w-full bg-black/40 border border-purple-800/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
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

        {/* Experience list */}
        <h2 className="font-bold text-lg mb-4 text-purple-200">📋 All Experiences ({experiences.length})</h2>
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
