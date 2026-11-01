import { API_BASE } from '../api';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
  CheckCircle
} from 'lucide-react';
import './contact.css';

const API_URL = `${API_BASE}/api/enquiries`;

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));

    if (error) {
      setError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Your enquiry could not be submitted.'
        );
      }

      setSubmitted(true);

      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(
        err.message ||
          'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="contact-page">
      {/* Hero section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            <Heart size={16} />
            WE ARE HERE FOR YOUR FAMILY
          </span>

          <h1>
            Let's Talk About
            <span> Your Child's Care</span>
          </h1>

          <p>
            Have a question about our services or need help choosing
            the right support for your child? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="contact-main">
        <div className="contact-layout">
          {/* Contact information */}
          <aside className="contact-information">
            <span className="contact-small-title">
              GET IN TOUCH
            </span>

            <h2>We'd Love to Hear From You</h2>

            <p className="contact-description">
              Every child deserves understanding, care, and support.
              Contact us and let us help you take the next step.
            </p>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={21} />
              </div>

              <div>
                <h3>Call Us</h3>
                <p>Sample contact number for the academic project.</p>
                <a href="tel:+919876543210">
                  +91 98765 43210 (demo)
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={21} />
              </div>

              <div>
                <h3>Email Us</h3>
                <p>Send us your questions or enquiries.</p>
                <a href="mailto:hello@brightsteps.example">
                  hello@brightsteps.example (demo)
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={21} />
              </div>

              <div>
                <h3>Visit Us</h3>
                <p>
                  Centre location has not been specified in this academic project demo.
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Clock size={21} />
              </div>

              <div>
                <h3>Working Hours</h3>
                <p>Monday – Saturday</p>
                <p>9:00 AM – 6:00 PM</p>
              </div>
            </div>

            <div className="contact-note">
              <Heart size={20} />
              <p>
                Every question matters. We're happy to guide you
                toward the support your child needs.
              </p>
            </div>
          </aside>

          {/* Contact form */}
          <section className="contact-form-card">
            <span className="contact-small-title">
              SEND US A MESSAGE
            </span>

            <h2>How Can We Help?</h2>

            <p className="contact-form-description">
              Fill in the form below and submit your enquiry.
            </p>

            {submitted ? (
              <div className="contact-success" role="status">
                <CheckCircle size={52} />

                <h3>Message Submitted Successfully!</h3>

                <p>
                  Thank you for contacting BrightSteps Haven.
                  Your enquiry has been received.
                </p>

                <button
                  type="button"
                  className="contact-button"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="contact-field">
                  <label htmlFor="contact-name">
                    Your Name *
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-email">
                      Email Address *
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-phone">
                      Phone Number
                    </label>

                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-subject">
                    Subject *
                  </label>

                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select a subject
                    </option>
                    <option value="General Enquiry">
                      General Enquiry
                    </option>
                    <option value="Therapy Services">
                      Therapy Services
                    </option>
                    <option value="Child Assessment">
                      Child Assessment
                    </option>
                    <option value="Appointment">
                      Appointment
                    </option>
                    <option value="Hospital Facilities">
                      Hospital Facilities
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">
                    Your Message *
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && (
                  <p className="contact-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="contact-button"
                  disabled={loading}
                >
                  {loading
                    ? 'Sending Enquiry...'
                    : 'Send Enquiry'}

                  {!loading && <Send size={17} />}
                </button>

                <p className="contact-privacy">
                  Your information should be handled privately
                  and used to respond to your enquiry.
                </p>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
