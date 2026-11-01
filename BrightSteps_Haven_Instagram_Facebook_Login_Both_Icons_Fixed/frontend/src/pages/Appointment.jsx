import { API_BASE } from '../api';
import React, { useState } from 'react';
import { CheckCircle2, CalendarDays, Phone, ShieldCheck } from 'lucide-react';
import consultationImage from '../images/about.JPG';
import familyImage from '../images/A-mother-taking-care-of-her-special-need-child-683x1024.png';
import { PageHero } from '../components/Layout';

const therapyServiceOptions = [
  'Occupational Therapy',
  'Physiotherapy',
  'Speech & Language Therapy',
  'Sensory Support',
  'Rehabilitation',
  'Developmental Support'
];

const hospitalServiceOptions = [
  'Clinical Consultation',
  'Paediatric / Child Health Consultation',
  'Developmental Assessment',
  'Nursing & Clinical Care',
  'Medical Follow-up',
  'Hospital Care Enquiry'
];

const teamOptions = [
  'Doctor / Clinical Team',
  'Paediatric / Child Health Team',
  'Occupational Therapist',
  'Physiotherapist',
  'Speech & Language Therapist',
  'Sensory Support Team',
  'Rehabilitation Team',
  'Child Psychologist',
  'Developmental Specialist',
  'Caregiver / Nursing Team'
];

const API_URL = `${API_BASE}/api/enquiries`;

const emptyForm = {
  parentName: '', email: '', phone: '', childAge: '',
  appointmentType: 'Therapy Services', service: '', teamMember: '', date: '', message: ''
};

export default function Appointment() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (!form.parentName.trim() || !form.phone.trim() || !form.service || !form.date) {
      setError('Please complete your name, phone, service and preferred date.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          message: form.message.trim() || 'No additional message provided.'
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not send your request.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Could not connect to the backend. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Book a first visit"
        title={<>Let’s take the first <em>step together.</em></>}
        text="Tell us a little about your family and what support you are looking for. Our team can follow up about availability and next steps."
        image={consultationImage}
        imageAlt="A care consultation"
      />
      <section className="section appointment-section">
        <div className="container appointment-grid">
          <div className="appointment-aside">
            <span className="eyebrow"><span className="eyebrow-dot" />A simple beginning</span>
            <h2>We’re here to listen.</h2>
            <p>You do not need to have all the answers before getting in touch. Share what you feel comfortable sharing, and we can take it from there.</p>
            <div className="appointment-info">
              <div className="info-icon"><Phone size={19} /></div>
              <div><strong>Prefer to speak?</strong><span>Demo: +91 98765 43210</span><small>Sample contact details for the academic project.</small></div>
            </div>
            <div className="appointment-info">
              <div className="info-icon"><CalendarDays size={19} /></div>
              <div><strong>Choose a preferred date</strong><span>We’ll confirm availability</span><small>Your request is not a confirmed booking.</small></div>
            </div>
            <div className="privacy-note">
              <ShieldCheck size={20} />
              <p>Your form is sent to the BrightSteps backend and saved in its MongoDB database. Only share information needed to contact you.</p>
            </div>
            <img className="appointment-aside-image" src={familyImage} alt="Family connection and support" />
          </div>

          <div className="form-card">
            {submitted ? (
              <div className="success-state">
                <div className="success-icon"><CheckCircle2 size={34} /></div>
                <h2>Thank you, {form.parentName.split(' ')[0]}.</h2>
                <p>Your appointment request has been sent successfully. Our team can contact you to confirm availability.</p>
                <div className="request-summary">
                  <span>Appointment type</span><strong>{form.appointmentType}</strong>
                  <span>Requested service</span><strong>{form.service}</strong>
                  <span>Preferred team</span><strong>{form.teamMember || 'No preference'}</strong>
                  <span>Preferred date</span><strong>{form.date}</strong>
                </div>
                <button className="button" onClick={() => { setForm(emptyForm); setSubmitted(false); }}>Submit another request</button>
              </div>
            ) : (
              <>
                <div className="form-heading">
                  <span className="form-step">YOUR FIRST VISIT</span>
                  <h2>Appointment request</h2>
                  <p>Fields marked with * are required.</p>
                </div>
                <form onSubmit={submit} noValidate>
                  <div className="form-row">
                    <label>Parent / caregiver name *
                      <input name="parentName" value={form.parentName} onChange={update} placeholder="Your full name" autoComplete="name" required />
                    </label>
                    <label>Phone number *
                      <input name="phone" type="tel" value={form.phone} onChange={update} placeholder="Your contact number" autoComplete="tel" required />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>Email address
                      <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" />
                    </label>
                    <label>Child’s age
                      <select name="childAge" value={form.childAge} onChange={update}>
                        <option value="">Choose age range</option><option>Under 3 years</option><option>3–5 years</option><option>6–9 years</option><option>10–13 years</option><option>14 years or older</option>
                      </select>
                    </label>
                  </div>
                  <label>What would you like to book? *
                    <select name="appointmentType" value={form.appointmentType} onChange={event => setForm({ ...form, appointmentType: event.target.value, service: '', teamMember: '' })} required>
                      <option>Therapy Services</option>
                      <option>Hospital & Clinical Services</option>
                    </select>
                  </label>
                  <label>{form.appointmentType === 'Hospital & Clinical Services' ? 'Hospital / clinical service *' : 'Therapy service *'}
                    <select name="service" value={form.service} onChange={update} required>
                      <option value="">Select a service</option>
                      {(form.appointmentType === 'Hospital & Clinical Services' ? hospitalServiceOptions : therapyServiceOptions).map(service => <option key={service}>{service}</option>)}
                      <option>Not sure yet — please guide me</option>
                    </select>
                  </label>
                  <label>Preferred team / professional
                    <select name="teamMember" value={form.teamMember} onChange={update}>
                      <option value="">No preference — please recommend</option>
                      {teamOptions.map(member => <option key={member}>{member}</option>)}
                    </select>
                  </label>
                  <p className="form-footnote">Choose a team if you have a preference. BrightSteps will confirm the appropriate professional and availability.</p>
                  <label>Preferred date *
                    <input type="date" name="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={update} required />
                  </label>
                  <label>Anything you’d like us to know?
                    <textarea name="message" rows="4" value={form.message} onChange={update} placeholder="Share questions or support needs you would like to discuss (optional)." />
                  </label>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button type="submit" className="button form-submit" disabled={loading}>
                    {loading ? 'Sending request…' : 'Send appointment request'} <CheckCircle2 size={17} />
                  </button>
                  <p className="form-footnote">Your request is not confirmed until the BrightSteps team contacts you.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
