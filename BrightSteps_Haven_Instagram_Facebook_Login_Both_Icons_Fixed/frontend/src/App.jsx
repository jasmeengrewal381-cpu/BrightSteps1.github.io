import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Activities from './pages/Activities';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import ShortVideos from './pages/ShortVideos';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Facilities from './pages/Facilities';
import HospitalCare from './pages/HospitalCare';
import ResidentialCare from './pages/ResidentialCare';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import { API_BASE } from './api';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}
function NotFound() {
  return <main className="not-found container"><span className="eyebrow">Page not found</span><h1>Let’s find the right path.</h1><p>The page you’re looking for may have moved.</p><a href="/" className="button">Back to home</a></main>;
}
function ParentOnly({ children }) {
  const location = useLocation();
  const [status, setStatus] = React.useState('checking');
  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/parents/me`, { credentials: 'include' })
      .then(response => { if (active) setStatus(response.ok ? 'ok' : 'login'); })
      .catch(() => { if (active) setStatus('login'); });
    return () => { active = false; };
  }, [location.pathname]);
  if (status === 'checking') return <main className="container auth-checking">Checking your parent account…</main>;
  if (status !== 'ok') return <Navigate to={`/parent-dashboard?next=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}
export default function App() {
  const location = useLocation();
  const adminPage = location.pathname === '/admin';
  return <>
    <ScrollToTop />
    {!adminPage && <Header />}
    <main>
      <Routes>
        {/* Information pages stay public. Parent login is required for appointment and contact requests. */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/hospital-care" element={<HospitalCare />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/residential-care" element={<ResidentialCare />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/team" element={<Team />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/short-videos" element={<ShortVideos />} />
        <Route path="/appointment" element={<ParentOnly><Appointment /></ParentOnly>} />
        <Route path="/contact" element={<ParentOnly><Contact /></ParentOnly>} />
        {/* Parent dashboard contains the parent login/sign-up screen when logged out. */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        {/* Admin has its own separate login and session. */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    {!adminPage && <Footer />}
  </>;
}
