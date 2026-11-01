import { API_BASE } from '../api';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API = `${API_BASE}/api/admin`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('brightstepsadmin');
  const [password, setPassword] = useState('');
  const [totals, setTotals] = useState({
    appointments: 0,
    enquiries: 0,
    pendingAppointments: 0,
    newEnquiries: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [videoForm, setVideoForm] = useState({ title: '', category: 'Therapy', description: '', videoUrl: '' });
  const [editingVideoId, setEditingVideoId] = useState('');

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed.');
    }

    return data;
  }

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const [summary, appointmentData, enquiryData, videoData] =
        await Promise.all([
          apiRequest('/dashboard'),
          apiRequest('/appointments'),
          apiRequest('/enquiries'),
          apiRequest('/videos')
        ]);

      setTotals(summary.totals);
      setAppointments(appointmentData.appointments);
      setEnquiries(enquiryData.enquiries);
      setVideos(videoData.videos || []);
      setLoggedIn(true);
    } catch (err) {
      setError(err.message);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        await apiRequest('/me');
        if (active) await loadDashboard();
      } catch {
        if (active) setLoggedIn(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      setPassword('');
      await loadDashboard();
      setNotice('Welcome to BrightSteps Haven Admin.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    setError('');
    setNotice('');

    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });

      setAppointments(current =>
        current.map(item =>
          item._id === id ? { ...item, status } : item
        )
      );

      await loadDashboard();
      setNotice('Appointment status updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch (err) {
      // Navigate away even if the logout request fails; the backend session
      // is checked again if the admin page is opened later.
      console.error('Admin logout request failed:', err);
    } finally {
      setLoggedIn(false);
      setAppointments([]);
      setEnquiries([]);
      setVideos([]);
      setPassword('');
      setNotice('');
      navigate('/', { replace: true });
    }
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredAppointments = appointments.filter(item => [item.parentName, item.phone, item.email, item.appointmentType, item.service, item.teamMember, item.date, item.status, item.childAge].some(value => String(value || '').toLowerCase().includes(normalizedSearch)));
  const filteredEnquiries = enquiries.filter(item => [item.name, item.email, item.phone, item.subject, item.message, item.status].some(value => String(value || '').toLowerCase().includes(normalizedSearch)));
  const filteredVideos = videos.filter(item => [item.title, item.category, item.description, item.videoUrl].some(value => String(value || '').toLowerCase().includes(normalizedSearch)));

  async function saveVideo(event) {
    event.preventDefault(); setError(''); setNotice('');
    try {
      const editing = Boolean(editingVideoId);
      const result = await apiRequest(editing ? `/videos/${editingVideoId}` : '/videos', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(videoForm) });
      setVideos(current => editing ? current.map(item => item._id === editingVideoId ? result.video : item) : [result.video, ...current]);
      setVideoForm({ title: '', category: 'Therapy', description: '', videoUrl: '' }); setEditingVideoId('');
      setNotice(editing ? 'Video updated.' : 'Video added to the library.');
    } catch (err) { setError(err.message); }
  }
  async function deleteVideo(id) {
    if (!window.confirm('Delete this video from the website?')) return;
    try { await apiRequest(`/videos/${id}`, { method: 'DELETE' }); setVideos(current => current.filter(item => item._id !== id)); setNotice('Video deleted.'); setError(''); }
    catch (err) { setError(err.message); }
  }
  function editVideo(video) {
    setEditingVideoId(video._id); setVideoForm({ title: video.title || '', category: video.category || 'Therapy', description: video.description || '', videoUrl: video.videoUrl || '' }); setSearchQuery('');
    document.querySelector('.admin-video-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!loggedIn) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-logo">BH</div>
          <p className="admin-eyebrow">BRIGHTSTEPS HAVEN</p>
          <h1>Admin Login</h1>
          <p className="admin-subtitle">
            Sign in to manage appointments and enquiries.
          </p>

          {error && <p className="admin-error">{error}</p>}

          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button className="admin-primary-button" type="submit">
            Sign In
          </button>

          {error && (
            <button
              className="admin-secondary-button"
              type="button"
              onClick={() => setError('')}
            >
              Dismiss
            </button>
          )}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">BRIGHTSTEPS HAVEN</p>
          <h1>Admin Dashboard</h1>
        </div>

        <button className="admin-logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      {error && <p className="admin-error">{error}</p>}
      {notice && <p className="admin-notice">{notice}</p>}

      <section className="admin-welcome">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h2>Welcome back!</h2>
          <p>Manage the care requests received by your centre.</p>
        </div>
        <span className="admin-welcome-icon">✦</span>
      </section>

      <section className="admin-stats">
        <article className="admin-stat-card">
          <span>Total Appointments</span>
          <strong>{totals.appointments}</strong>
          <small>All appointment records</small>
        </article>

        <article className="admin-stat-card">
          <span>Pending Appointments</span>
          <strong>{totals.pendingAppointments}</strong>
          <small>Awaiting action</small>
        </article>

        <article className="admin-stat-card">
          <span>Contact Enquiries</span>
          <strong>{totals.enquiries}</strong>
          <small>Messages received</small>
        </article>

        <article className="admin-stat-card">
          <span>New Enquiries</span>
          <strong>{totals.newEnquiries}</strong>
          <small>Not yet marked as contacted</small>
        </article>
      </section>

      <section className="admin-records">
        <div className="admin-records-heading">
          <div>
            <p className="admin-eyebrow">CENTRE MANAGEMENT</p>
            <h2>Manage Records</h2>
          </div>

          <button
            className="admin-refresh-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="admin-tabs">
          <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => { setActiveTab('appointments'); setSearchQuery(''); }}>Appointments ({appointments.length})</button>
          <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}>Enquiries ({enquiries.length})</button>
          <button className={activeTab === 'videos' ? 'active' : ''} onClick={() => { setActiveTab('videos'); setSearchQuery(''); }}>Service Videos ({videos.length})</button>
        </div>

        <div className="admin-search-wrap"><span className="admin-search-icon" aria-hidden="true">⌕</span><input className="admin-search-input" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder={activeTab === 'appointments' ? 'Search parent, phone, email, service, date or status…' : activeTab === 'enquiries' ? 'Search name, email, phone, subject or message…' : 'Search video title, category or URL…'} aria-label="Search dashboard records" />{searchQuery && <button className="admin-search-clear" type="button" onClick={() => setSearchQuery('')}>Clear</button>}</div>

        {activeTab === 'appointments' ? (
          filteredAppointments.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Parent Name</th><th>Contact</th><th>Appointment type</th><th>Service</th><th>Preferred team</th><th>Date</th><th>Status</th></tr></thead><tbody>{filteredAppointments.map(item => <tr key={item._id}><td><strong>{item.parentName || '—'}</strong><small>{item.childAge || 'Age not provided'}</small></td><td>{item.phone || '—'}<small>{item.email || 'No email'}</small></td><td>{item.appointmentType || 'Therapy Services'}</td><td>{item.service || '—'}</td><td>{item.teamMember || 'No preference'}</td><td>{item.date || '—'}</td><td><select aria-label={`Status for ${item.parentName || 'appointment'}`} value={item.status || 'Pending'} onChange={event => updateStatus(item._id, event.target.value)}><option value="Pending">Pending</option><option value="Confirmed">Confirmed</option><option value="Cancelled">Cancelled</option></select></td></tr>)}</tbody></table></div> : <p className="admin-empty">{searchQuery ? `No appointments match “${searchQuery}”.` : 'No appointments found.'}</p>
        ) : activeTab === 'enquiries' ? (
          filteredEnquiries.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Contact</th><th>Subject</th><th>Message</th><th>Received</th></tr></thead><tbody>{filteredEnquiries.map(item => <tr key={item._id}><td>{item.name || '—'}</td><td>{item.email || '—'}<small>{item.phone || ''}</small></td><td>{item.subject || '—'}</td><td className="admin-message-cell">{item.message || '—'}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div> : <p className="admin-empty">{searchQuery ? `No enquiries match “${searchQuery}”.` : 'No contact enquiries found.'}</p>
        ) : (
          <div className="admin-video-management">
            <form className="admin-video-form" onSubmit={saveVideo}>
              <h3>{editingVideoId ? 'Edit service video' : 'Add a service video'}</h3>
              <div className="admin-video-form-grid">
                <label>Video title<input value={videoForm.title} onChange={e => setVideoForm(old => ({ ...old, title: e.target.value }))} required maxLength={140} placeholder="Speech therapy introduction" /></label>
                <label>Category<select value={videoForm.category} onChange={e => setVideoForm(old => ({ ...old, category: e.target.value }))}><option>Therapy</option><option>Development</option><option>Rehabilitation</option><option>Activities</option><option>Care</option><option>Family Support</option></select></label>
                <label className="admin-video-wide">YouTube or Shorts URL<input type="url" value={videoForm.videoUrl} onChange={e => setVideoForm(old => ({ ...old, videoUrl: e.target.value }))} required placeholder="https://www.youtube.com/shorts/VIDEO_ID" /></label>
                <label className="admin-video-wide">Description<textarea value={videoForm.description} onChange={e => setVideoForm(old => ({ ...old, description: e.target.value }))} maxLength={500} rows={3} placeholder="A short, parent-friendly description" /></label>
              </div>
              <div className="admin-video-form-actions"><button className="admin-primary-button" type="submit">{editingVideoId ? 'Save changes' : 'Add video'}</button>{editingVideoId && <button className="admin-secondary-button" type="button" onClick={() => { setEditingVideoId(''); setVideoForm({ title: '', category: 'Therapy', description: '', videoUrl: '' }); }}>Cancel edit</button>}</div>
              <p className="admin-video-help">Use a public YouTube video or Shorts URL. Some creators disable embedding, so the website also provides a Watch on YouTube link.</p>
            </form>
            <div className="admin-video-list-heading"><h3>Video library</h3><span>{filteredVideos.length} video{filteredVideos.length === 1 ? '' : 's'}</span></div>
            {filteredVideos.length ? <div className="admin-video-list">{filteredVideos.map(video => <article className="admin-video-item" key={video._id}><div><span className="admin-video-category">{video.category}</span><h4>{video.title}</h4><p>{video.description || 'No description added.'}</p><a href={video.videoUrl} target="_blank" rel="noreferrer">Open YouTube link</a></div><div className="admin-video-actions"><button type="button" onClick={() => editVideo(video)}>Edit</button><button type="button" className="danger" onClick={() => deleteVideo(video._id)}>Delete</button></div></article>)}</div> : <p className="admin-empty">{searchQuery ? `No videos match “${searchQuery}”.` : 'No videos in the library yet. Add the first one above.'}</p>}
          </div>
        )}
      </section>

      <footer className="admin-footer">
        BrightSteps Haven · Care, support and development
      </footer>
    </main>
  );
}
