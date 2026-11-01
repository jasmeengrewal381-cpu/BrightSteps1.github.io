import { API_BASE } from '../api';

import React, { useEffect, useState } from 'react';
import './ParentAuthPopup.css';

const API_URL = `${API_BASE}/api/parents`;

export default function ParentAuthPopup() {
  const [checking, setChecking] = useState(true);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/me`, {
          credentials: 'include'
        });

        if (active) {
          setVisible(!response.ok);
        }
      } catch {
        if (active) {
          setVisible(true);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  function update(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${mode === 'signup' ? 'signup' : 'login'}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Authentication failed.'
        );
      }

      if (!result.success) {
        throw new Error(
          result.message || 'Could not verify your account.'
        );
      }

      setForm({
        name: '',
        email: '',
        password: ''
      });

      setVisible(false);
    } catch (err) {
      setError(
        err.message ||
          'Could not connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking || !visible) {
    return null;
  }

  return (
    <div
      className="parent-auth-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setError('');
        }
      }}
    >
      <section
        className="parent-auth-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-auth-title"
      >
        <button
          type="button"
          className="parent-auth-close"
          aria-label="Close login popup"
          onClick={() => {
            setError(
              'Please log in or sign up to access BrightSteps.'
            );
          }}
        >
          ×
        </button>

        <div className="parent-auth-brand">BS</div>

        <span className="parent-auth-eyebrow">
          WELCOME TO BRIGHTSTEPS HAVEN
        </span>

        <h2 id="parent-auth-title">
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your parent account'}
        </h2>

        <p className="parent-auth-description">
          {mode === 'login'
            ? 'Log in to your account to continue.'
            : 'Join our community and stay connected with your care journey.'}
        </p>

        <div className="parent-auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'selected' : ''}
            onClick={() => changeMode('login')}
          >
            Log in
          </button>

          <button
            type="button"
            className={mode === 'signup' ? 'selected' : ''}
            onClick={() => changeMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form
          onSubmit={submit}
          className="parent-auth-form"
        >
          {mode === 'signup' && (
            <label>
              Parent / caregiver name

              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={100}
                required
              />
            </label>
          )}

          <label>
            Email address

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              placeholder={
                mode === 'signup'
                  ? 'At least 8 characters'
                  : 'Enter your password'
              }
              autoComplete={
                mode === 'signup'
                  ? 'new-password'
                  : 'current-password'
              }
              minLength={mode === 'signup' ? 8 : undefined}
              maxLength={128}
              required
            />
          </label>

          {error && (
            <p
              className="parent-auth-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="parent-auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>

      
      </section>
    </div>
  );
}