import { API_BASE } from '../api';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, MessageCircle, UserRound, LogOut, HeartHandshake, ShieldCheck, Bell, Pencil, Search, Save, X } from 'lucide-react';
import './ParentDashboard.css';
const API = `${API_BASE}/api/parents`;
export default function ParentDashboard() {
  const [parent, setParent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileNotice, setProfileNotice] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const next = new URLSearchParams(location.search).get('next');
  async function loadParent() {
    try {
      const response = await fetch(`${API}/me`, { credentials: 'include' });
      if (!response.ok) { setParent(null); return; }
      const data = await response.json(); setParent(data.parent); setProfileForm({ name: data.parent.name || '', email: data.parent.email || '' });
      const appt = await fetch(`${API}/my-appointments`, { credentials: 'include' });
      if (appt.ok) { const result = await appt.json(); setAppointments(result.appointments || []); }
    } catch { setParent(null); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadParent(); }, []);
  function update(e) { setForm(old => ({ ...old, [e.target.name]: e.target.value })); setError(''); }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch(`${API}/${mode === 'signup' ? 'signup' : 'login'}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not sign in.');
      setForm({ name: '', email: '', password: '' });
      await loadParent();
      if (next) navigate(next, { replace: true });
    } catch (err) { setError(err.message || 'Unable to connect. Check that the backend is running.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    try { await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' }); } finally { setParent(null); setAppointments([]); setMode('login'); navigate('/', { replace: true }); }
  }
  async function saveProfile(event) {
    event.preventDefault(); setBusy(true); setError(''); setProfileNotice('');
    try {
      const response = await fetch(`${API}/profile`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileForm) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not update profile.');
      setParent(data.parent); setProfileForm({ name: data.parent.name, email: data.parent.email }); setEditingProfile(false); setProfileNotice('Your profile was updated.');
    } catch (err) { setError(err.message || 'Could not update profile.'); }
    finally { setBusy(false); }
  }
  const normalizedAppointmentSearch = appointmentSearch.trim().toLowerCase();
  const filteredAppointments = appointments.filter(item => [item.service, item.date, item.phone, item.status, item.message, item.parentName].some(value => String(value || '').toLowerCase().includes(normalizedAppointmentSearch)));
  const upcomingAppointments = appointments.filter(item => {
    const date = item.date ? new Date(item.date) : null;
    return date && !Number.isNaN(date.getTime()) && date >= new Date(new Date().setHours(0, 0, 0, 0)) && !['Cancelled', 'Completed'].includes(item.status);
  });

  if (loading) return <section className="parent-page"><div className="parent-auth-card">Checking your account…</div></section>;
  if (!parent) return <section className="parent-page"><div className="parent-auth-card">
    <div className="parent-auth-brand">BS</div><span className="parent-auth-eyebrow">BRIGHTSTEPS HAVEN</span><h1>{mode === 'login' ? 'Parent login' : 'Create a parent account'}</h1><p className="parent-auth-description">Sign in to request appointments, contact our care team and view your appointment updates.</p>
    <div className="parent-auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError(''); }}>Log in</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setError(''); }}>Sign up</button></div>
    <form className="parent-auth-form" onSubmit={submit}>
      {mode === 'signup' && <label>Parent / caregiver name<input name="name" value={form.name} onChange={update} autoComplete="name" required maxLength={100} placeholder="Your full name" /></label>}
      <label>Email address<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required placeholder="you@example.com" /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={update} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 8 : undefined} required placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} /></label>
      {error && <p className="parent-auth-error" role="alert">{error}</p>}
      <button className="parent-auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}</button>
    </form>
    <div className="admin-access"><ShieldCheck size={17} /><span>Are you a staff administrator?</span><Link to="/admin">Admin login</Link></div>
    <p className="parent-auth-footnote">Already registered? Choose Log in — you do not need to create another account.</p>
  </div></section>;
  return <section className="parent-dashboard-page"><div className="parent-dashboard-wrap">
    <div className="parent-dashboard-heading"><div><span className="parent-auth-eyebrow">YOUR FAMILY SPACE</span><h1>Welcome, {parent.name.split(' ')[0]}</h1><p>Manage your BrightSteps care journey in one place.</p></div><button className="parent-logout" onClick={logout}><LogOut size={17} /> Log out</button></div>
    <div className="parent-welcome-card"><div className="parent-avatar"><UserRound size={30} /></div><div className="parent-profile-details"><h2>{parent.name}</h2><p>{parent.email}</p><span className="parent-status"><HeartHandshake size={15} /> Parent account active</span></div><button className="parent-profile-edit" type="button" onClick={() => { setEditingProfile(value => !value); setProfileNotice(''); setError(''); }}><Pencil size={15} /> {editingProfile ? 'Close' : 'Edit profile'}</button></div>
    {profileNotice && <p className="parent-profile-notice" role="status">{profileNotice}</p>}
    {error && parent && <p className="parent-auth-error parent-dashboard-error" role="alert">{error}</p>}
    {editingProfile && <form className="parent-profile-form" onSubmit={saveProfile}><label>Full name<input value={profileForm.name} onChange={e => setProfileForm(old => ({ ...old, name: e.target.value }))} required maxLength={100} /></label><label>Email address<input type="email" value={profileForm.email} onChange={e => setProfileForm(old => ({ ...old, email: e.target.value }))} required maxLength={254} /></label><div><button type="submit" disabled={busy}><Save size={15}/>{busy ? 'Saving…' : 'Save profile'}</button><button type="button" className="parent-profile-cancel" onClick={() => { setEditingProfile(false); setProfileForm({ name: parent.name, email: parent.email }); }}><X size={15}/>Cancel</button></div></form>}
    {upcomingAppointments.length > 0 && <div className="parent-reminder"><Bell size={21}/><div><strong>Upcoming appointment reminder</strong><p>{upcomingAppointments.map(item => `${item.service || 'Care appointment'} — ${item.date}`).join(' · ')}</p><small>Please contact the centre if you need to confirm or change a visit.</small></div></div>}
    <div className="parent-shortcuts"><Link to="/appointment" className="parent-shortcut"><CalendarDays /><span><strong>Request an appointment</strong><small>Choose a service and preferred date</small></span><b>→</b></Link><Link to="/contact" className="parent-shortcut"><MessageCircle /><span><strong>Contact our care team</strong><small>Ask a question or request guidance</small></span><b>→</b></Link><Link to="/services" className="parent-shortcut"><HeartHandshake /><span><strong>Explore care services</strong><small>Find support options for your child</small></span><b>→</b></Link></div>
    <div className="parent-appointments"><div className="parent-section-title"><div><span className="parent-auth-eyebrow">YOUR REQUESTS</span><h2>Appointment history</h2></div><Link to="/appointment">New appointment +</Link></div>
      <div className="parent-appointment-search"><Search size={17}/><input type="search" value={appointmentSearch} onChange={event => setAppointmentSearch(event.target.value)} placeholder="Search by service, date, phone or status…" aria-label="Search your appointments" />{appointmentSearch && <button type="button" onClick={() => setAppointmentSearch('')}>Clear</button>}</div>
      {filteredAppointments.length ? <div className="parent-appointment-list">{filteredAppointments.map(item => <article className="parent-appointment-item" key={item._id}><div><strong>{item.service || 'Care appointment'}</strong><p>{item.date || 'Date not provided'} · {item.phone || ''}</p></div><span className={`appointment-status ${String(item.status || 'Pending').toLowerCase()}`}>{item.status || 'Pending'}</span></article>)}</div> : appointments.length ? <div className="parent-empty"><CalendarDays size={25}/><p>No appointments match “{appointmentSearch}”.</p><button className="parent-clear-search" type="button" onClick={() => setAppointmentSearch('')}>Clear search</button></div> : <div className="parent-empty"><CalendarDays size={25} /><p>Your appointment requests will appear here after you submit one.</p><Link to="/appointment">Request your first appointment</Link></div>}
    </div>
  </div></section>;
}
