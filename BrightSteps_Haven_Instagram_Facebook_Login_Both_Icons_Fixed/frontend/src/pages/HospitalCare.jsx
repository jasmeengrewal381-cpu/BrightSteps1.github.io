import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, HeartPulse, Stethoscope, ClipboardCheck, ShieldCheck, PhoneCall } from 'lucide-react';
import { SectionHeading } from '../components/Layout';

const hospitalServices = [
  { icon: Stethoscope, title: 'Medical consultation', text: 'A place to discuss your child’s health concerns with an appropriately qualified healthcare professional, where this service is available.' },
  { icon: ClipboardCheck, title: 'Child health assessment', text: 'Support in understanding health and developmental concerns, with referrals to suitable specialists when needed.' },
  { icon: HeartPulse, title: 'Coordinated care', text: 'Help families discuss care needs and coordinate with therapy and developmental support teams.' },
  { icon: ShieldCheck, title: 'Family guidance and safety', text: 'Clear information about next steps, safe care practices and how families can prepare for a visit.' },
];

export default function HospitalCare() {
  return <main className="hospital-care-page">
    <section className="hospital-parallax-hero" aria-label="BrightSteps Haven hospital care">
      <div className="hospital-hero-overlay" />
      <div className="hospital-hero-content">
        <span className="hospital-eyebrow">HOSPITAL CARE</span>
        <span className="hospital-title-rule" />
        <h1>Comprehensive Medical Care <br />for <em>Every Child</em></h1>
        <p>Compassionate, child-centred healthcare and coordinated support for children and families, in a welcoming environment.</p>
        <div className="hospital-hero-actions">
          <a className="button hospital-primary-button" href="#hospital-services">Our Hospital Services <ArrowRight size={18} /></a>
          <Link className="hospital-secondary-link" to="/appointment">Book an appointment</Link>
        </div>
        <div className="hospital-hero-note"><HeartPulse size={19} /><span>Care that respects every child’s needs and individuality</span></div>
      </div>
      <a className="hospital-scroll-cue" href="#hospital-services" aria-label="Scroll to hospital services"><span /> Explore care</a>
    </section>

    <section className="section hospital-intro-section" id="hospital-services">
      <div className="container">
        <SectionHeading eyebrow="Medical support" title="A thoughtful approach to child health" text="Explore the types of hospital-related support families can ask about. Please contact BrightSteps Haven to confirm which services, qualified professionals and facilities are currently available." center />
        <div className="hospital-service-grid">{hospitalServices.map(({ icon: Icon, title, text }, index) => <article className="hospital-service-card" key={title} style={{'--hospital-card-delay': `${index * 90}ms`}}><span className="hospital-service-icon"><Icon size={24} /></span><span className="hospital-service-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="hospital-parallax-band">
      <div className="hospital-band-shade" />
      <div className="container hospital-band-content"><span className="hospital-eyebrow">ONE TEAM, SHARED GOALS</span><h2>Medical care and developmental support, working together.</h2><p>Families can explore hospital-related care alongside therapy and developmental services, with the right professional guidance for each child.</p><Link to="/services" className="button hospital-primary-button">Explore Development & Therapy <ArrowRight size={18} /></Link></div>
    </section>

    <section className="section hospital-next-step"><div className="container hospital-next-card"><div className="hospital-next-icon"><CalendarDays size={27} /></div><div><span className="hospital-eyebrow">YOUR NEXT STEP</span><h2>Talk with our team</h2><p>Contact us to ask about availability, professional qualifications, accessibility and the right next step for your family.</p></div><Link className="button" to="/appointment">Request an appointment <ArrowRight size={17} /></Link></div></section>
    <section className="hospital-emergency-note"><div className="container"><PhoneCall size={19}/><p><strong>Medical emergency?</strong> This website is not an emergency service. In India, call 112 or go to the nearest emergency department for urgent or life-threatening situations.</p></div></section>
  </main>;
}
