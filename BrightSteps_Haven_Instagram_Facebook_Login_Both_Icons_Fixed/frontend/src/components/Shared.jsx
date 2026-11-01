import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, HeartHandshake } from 'lucide-react';
import { SectionHeading } from './Layout';

const services = [
  { icon: '🧩', title: 'Occupational Therapy', text: 'Build everyday skills, coordination, sensory regulation and confidence through meaningful, child-led activities.', tone: 'lilac' },
  { icon: '🌿', title: 'Physiotherapy', text: 'Support movement, balance, posture, strength and mobility through individualised movement programmes.', tone: 'mint' },
  { icon: '💬', title: 'Speech & Language', text: 'Encourage communication, understanding, expressive language and alternative ways to connect.', tone: 'peach' },
  { icon: '🌈', title: 'Sensory Support', text: 'Explore sensory experiences in a supportive environment designed around each child’s comfort and needs.', tone: 'blue' },
  { icon: '🤸', title: 'Rehabilitation', text: 'Work towards functional goals with guided exercises and coordinated developmental support.', tone: 'peach' },
  { icon: '🌱', title: 'Developmental Support', text: 'Personalised support for learning, play, social interaction and practical everyday routines.', tone: 'mint' }
];

export function ServiceCards({ limit }) {
  const list = limit ? services.slice(0, limit) : services;
  return <div className="services-grid">{list.map((service, i) => <article className="service-card" key={service.title} style={{'--delay': `${i * 70}ms`}}><div className={`service-icon ${service.tone}`}>{service.icon}</div><h3>{service.title}</h3><p>{service.text}</p><Link to="/services" className="text-link">Explore service <ArrowRight size={16}/></Link></article>)}</div>;
}

export function ServicesSection({ limit = 3 }) {
  return <section className="section section-soft"><div className="container"><SectionHeading eyebrow="How we help" title="Support shaped around your child" text="Different children need different kinds of support. We start by listening, then work together on meaningful goals."/><ServiceCards limit={limit}/><div className="section-bottom-link"><Link className="button button-outline" to="/services">Explore all services <ArrowUpRight size={17}/></Link></div></div></section>;
}

export function CTASection() {
  return <section className="container cta-section"><div className="cta-card"><div className="cta-orb orb-one"/><div className="cta-orb orb-two"/><div className="cta-content"><span className="eyebrow eyebrow-light"><span className="eyebrow-dot"/>Your next step starts here</span><h2>You don’t have to figure it all out alone.</h2><p>Talk with our team about your child’s needs, your questions and the kind of support that may help.</p><Link to="/appointment" className="button button-light">Arrange a first visit <ArrowUpRight size={17}/></Link></div><div className="cta-illustration"><div className="cta-heart"><HeartHandshake size={66} strokeWidth={1.3}/></div><span className="float-dot dot-a"/><span className="float-dot dot-b"/><span className="float-dot dot-c"/></div></div></section>;
}

export function ValuesStrip() {
  const values = ['Child-led and respectful', 'Family partnership', 'Individual goals', 'Progress at every pace'];
  return <div className="values-strip"><div className="container values-inner">{values.map(v=><span key={v}><span className="check-icon"><Check size={14}/></span>{v}</span>)}</div></div>;
}
