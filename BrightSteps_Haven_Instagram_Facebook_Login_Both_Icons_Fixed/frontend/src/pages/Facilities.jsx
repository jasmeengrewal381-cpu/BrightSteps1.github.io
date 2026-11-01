import React, { useState } from 'react';
import {
  Activity, Accessibility, BedDouble, CalendarDays, CheckCircle2,
  ChevronDown, HeartHandshake, ShieldCheck, Sparkles, VolumeX,
  Stethoscope, PhoneCall, MessagesSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, SectionHeading } from '../components/Layout';
import consultationImage from '../images/about.JPG';
import familyImage from '../images/A-mother-taking-care-of-her-special-need-child-683x1024.png';
import sensoryImage from '../images/sensoryImage.jpg';
import Quitspace from '../images/Quitspace.JPG';
import careImage from '../images/armaan.JPG';
import supportImage from '../images/photo.JPG';

import parent from '../images/parent.JPG';
import mobility from '../images/mobility.JPG';
import assesment from '../images/assesment.JPG';
import therapy from '../images/therapy.webp';
import communication from '../images/communication.webp';
const facilities = [
  { icon: Sparkles, title: 'Sensory integration room', tag: 'Sensory support', image: sensoryImage, alt: 'Sensory support environment', text: 'A planned space for sensory activities, tactile exploration and supported movement. Ask the team which equipment and sessions are currently available.' },
  { icon: VolumeX, title: 'Quiet and calm space', tag: 'Emotional comfort', image: Quitspace, alt: 'Child-centred care environment', text: 'A lower-stimulation area for breaks when a child feels overwhelmed by noise, light or activity, based on individual needs and available space.' },
  { icon: Accessibility, title: 'Accessibility and mobility', tag: 'Inclusive access', image: mobility, alt: 'Supported child activity', text: 'Discuss step-free access, accessible washrooms, handrails, mobility aids and other reasonable adjustments before your visit.' },
  { icon: Stethoscope, title: 'Assessment and consultation', tag: 'Individual needs', image: assesment, alt: 'Consultation and care planning', text: 'A private conversation to discuss a child’s strengths, concerns, support needs and whether assessment or referral may be appropriate.' },
  { icon: Activity, title: 'Therapy and rehabilitation', tag: 'Development', image: therapy, alt: 'Child development support', text: 'Ask about speech and language support, occupational therapy, physiotherapy and developmental activities offered by qualified professionals.' },
  { icon: HeartHandshake, title: 'Parent and family support', tag: 'Caregiver guidance', image: parent, alt: 'Parent supporting a child', text: 'A welcoming space for caregiver guidance, home-care strategies and conversations about coordinating support across everyday routines.' },
  { icon: MessagesSquare, title: 'Communication support', tag: 'Communication', image: communication, alt: 'Child-focused support environment', text: 'Explore visual schedules, picture cards, communication boards and other tools that may help children express choices and needs.' },
  { icon: BedDouble, title: 'Residential care environment', tag: 'Daily living', image: careImage, alt: 'Child care and support', text: 'For families exploring residential care, ask about sleeping arrangements, daily routines, supervision, meals, personal care and visiting policies.' },
  { icon: ShieldCheck, title: 'Safety, hygiene and care', tag: 'Wellbeing', image: Quitspace, alt: 'Child-friendly care setting', text: 'Learn about safeguarding, cleaning routines, visitor procedures and how care needs are discussed with families and appropriate professionals.' },
];

const faqs = [
  { q: 'How do I request an appointment?', a: 'Use the appointment request form and choose the service and preferred date. A request is not a confirmed booking; the centre must contact you to confirm availability.' },
  { q: 'Can I tell the team about sensory or communication needs?', a: 'Yes. Share only what is needed to arrange a comfortable visit, such as communication preferences, mobility access or a need for a quieter waiting space. Avoid sending sensitive medical records through a general enquiry.' },
  { q: 'Are all listed facilities guaranteed to be available?', a: 'No. This page helps families understand what they can ask about. Contact the centre to verify which facilities, qualified professionals and services are actually available before travelling.' },
  { q: 'Does this website provide emergency medical care?', a: 'No. Website enquiries are not an emergency service. For an urgent or life-threatening situation in India, call 112 or go to the nearest emergency department.' },
];

const tourPhotos = [
  { src: sensoryImage, alt: 'Sensory support area', label: 'Sensory support' },
  { src: consultationImage, alt: 'Consultation area', label: 'Consultation' },
  { src: familyImage, alt: 'Family support', label: 'Family support' },
  { src: parent, alt: 'Supported activity', label: 'Development activities' },
];

export default function Facilities() {
  const [openFaq, setOpenFaq] = useState(0);
  return <>
    <PageHero eyebrow="Care and development facilities" title={<>A supportive space for <em>every child.</em></>} text="Explore the care environments and support options families can ask us about for children with developmental, physical, sensory, communication or learning needs." image={consultationImage} imageAlt="A child-centred consultation environment" />

    <section className="section"><div className="container">
      <SectionHeading eyebrow="Our environment" title="Facilities designed around individual needs" text="Every child is different. Contact the centre to confirm current facilities, staffing, accessibility and availability before planning a visit." />
      <div className="facility-grid facility-grid-with-images">{facilities.map(({ icon: Icon, title, tag, image, alt, text }) => <article className="facility-card facility-card-image" key={title}>
        <div className="facility-card-photo"><img src={image} alt={alt} loading="lazy" /><div className="facility-icon"><Icon size={23} /></div></div>
        <span className="facility-tag">{tag}</span><h3>{title}</h3><p>{text}</p>
        <Link to="/appointment" className="facility-link">Ask about this <span aria-hidden="true">→</span></Link>
      </article>)}</div>
    </div></section>

    <section className="section section-soft"><div className="container facility-visit-grid">
      <div className="facility-visit-copy"><span className="eyebrow"><span className="eyebrow-dot" />Before your visit</span><h2>Help us make the visit more comfortable.</h2><p>When requesting an appointment, you can tell us what may help your child feel safer and more comfortable. Share only details you are comfortable providing.</p>
        <ul className="facility-checklist"><li><CheckCircle2 size={18} /> Preferred communication method</li><li><CheckCircle2 size={18} /> Sensory or quiet-space preferences</li><li><CheckCircle2 size={18} /> Mobility or access requirements</li><li><CheckCircle2 size={18} /> Questions you want to discuss</li></ul>
        <Link className="button" to="/appointment"><CalendarDays size={17} /> Request an appointment</Link>
      </div>
      <div className="facility-visit-image"><img src={familyImage} alt="Family receiving supportive guidance" loading="lazy" /><div className="facility-image-note"><ShieldCheck size={20} /><span><strong>Family-centred approach</strong><small>Discuss needs before arriving</small></span></div></div>
    </div></section>

    <section className="section"><div className="container"><SectionHeading eyebrow="A look around" title="Explore our care spaces" text="These images are illustrative of child-centred support. Contact us to confirm the actual rooms and facilities available at the centre." />
      <div className="facility-tour-grid">{tourPhotos.map((photo) => <figure className="facility-tour-photo" key={photo.label}><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption>{photo.label}</figcaption></figure>)}</div>
    </div></section>

    <section className="section section-soft"><div className="container"><SectionHeading eyebrow="Common questions" title="Good to know before you visit" text="Clear information helps families plan the next step." /><div className="facility-faq">{faqs.map((faq, i) => <div className={`facility-faq-item ${openFaq === i ? 'is-open' : ''}`} key={faq.q}><button className="facility-faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>{faq.q}<ChevronDown size={19} /></button>{openFaq === i && <p className="facility-faq-answer">{faq.a}</p>}</div>)}</div></div></section>

    <section className="section"><div className="container"><div className="facility-emergency"><div className="facility-emergency-icon"><PhoneCall size={25} /></div><div><h3>Need urgent medical help?</h3><p>BrightSteps website enquiries are not monitored as an emergency service. In India, call <strong>112</strong> for an emergency or visit the nearest emergency department.</p></div><a className="button button-outline" href="tel:112">Call 112</a></div></div></section>
  </>;
}
