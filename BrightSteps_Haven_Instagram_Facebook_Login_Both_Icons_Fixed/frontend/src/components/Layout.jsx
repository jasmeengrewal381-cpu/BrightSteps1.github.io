
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';


const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Hospital Care', '/hospital-care'],
  ['Development & Therapy', '/services'],
  ['Facilities', '/facilities'],
  ['Residential Care', '/residential-care'],
  ['Activities', '/activities'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact']
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  return <>
    <div className="topbar"><div className="container topbar-inner"><span>Care that sees the child, not just the diagnosis.</span><span className="topbar-right">Demo contact: +91 98765 43210 | Mon–Sat, 9 AM–6 PM</span></div></div>
    <header className="site-header"><div className="container nav-wrap">
      <Link className="brand" to="/" aria-label="BrightSteps home"><span className="brand-mark">BS</span><span className="brand-copy"><strong>brightsteps</strong><small>HOSPITAL & DEVELOPMENT CENTRE</small></span></Link>
      <button className="mobile-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>{menuOpen ? 'Close menu' : 'Menu'}</button>
      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
        {links.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        <Link className="button button-small nav-cta" to="/parent-dashboard">Login / Sign up</Link>
      </nav>
    </div></header>
  </>;
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <span className="brand-mark">BS</span>
            <span className="brand-copy">
              <strong>brightsteps</strong>
              <small>HOSPITAL & DEVELOPMENT CENTRE</small>
            </span>
          </Link>
          <p>Every child has a way to grow. We help families discover it, one small step at a time.</p>
          <div className="socials" aria-label="Social media links">
            <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" aria-label="Open Instagram login" title="Instagram login"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" aria-label="Open Facebook login" title="Facebook login"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.7V3.14C16.5 3.05 15.38 3 14.08 3c-2.72 0-4.58 1.66-4.58 4.7v1.9H6.75v3.2H9.5V21h4z"/></svg></a>
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            {links.slice(1).map(([label, path]) => (
              <li key={path}><Link to={path}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Get in touch</h4>
          <ul className="footer-contact">
            <li>Location: to be confirmed</li>
            <li>Demo phone: +91 98765 43210</li>
            <li>Demo email: hello@brightsteps.example</li>
          </ul>
          <p className="footer-note">Academic project demo: replace these sample contact details with verified centre information before public launch.</p>
        </div>

        <div className="footer-cta">
          <span className="eyebrow">A good first step</span>
          <h3>Let’s find the right support for your child.</h3>
          <Link to="/appointment" className="button">Plan a first visit</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BrightSteps Haven Hospital & Development Centre</span>
        <span>Made with care for every kind of growth</span>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, text, image, imageAlt }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
        {image && (
          <div className="page-hero-image">
            <img src={image} alt={imageAlt || 'Child-centred care and developmental support'} />
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={`section-heading ${center ? 'center' : ''}`}>
      <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
