# BrightSteps Haven — MCA Minor Project

BrightSteps Haven is an academic web application concept for a child development and care centre. It includes public information pages, parent authentication, appointment/enquiry forms, a parent dashboard, an admin dashboard, and an admin-managed video library.

## Technology

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose/native collection access
- Authentication: separate parent and admin sessions

## Run locally

1. Install Node.js (LTS recommended).
2. In `backend`, install dependencies with `npm install`.
3. Copy `backend/config.env.example` to `backend/config.env` and enter your own MongoDB URI, session secret, and any email/admin settings required by the backend. Never commit real credentials.
4. Start the backend from `backend` with `npm run dev`.
5. In a second terminal, go to `frontend` and run `npm install`.
6. Copy `frontend/.env.example` to `frontend/.env` if you need to change the API address. For local development, the default is `http://localhost:5000`.
7. Start the frontend with `npm run dev` and open the local Vite URL printed in the terminal.

## Deployment note

For deployment, set `VITE_API_URL` to the HTTPS URL of the deployed backend, and configure the backend CORS allow-list and secure session cookies for the deployed frontend domain. GitHub Pages alone cannot run the Node/Express backend.

## Academic demonstration note

The contact phone, email and location shown in the interface are demonstration placeholders. Replace them with verified details before any real public launch. The site is a project concept and does not claim that clinical, hospital or residential services are licensed or currently operating. Confirm all video links and image usage before presenting or publishing the site.

## Main routes

- `/` — Home
- `/about`, `/services`, `/hospital-care`, `/facilities`, `/residential-care`, `/activities`, `/team`, `/gallery`, `/short-videos` — public information pages
- `/appointment`, `/contact` — parent login required
- `/parent-dashboard` — parent login/sign-up and parent dashboard
- `/admin` — separate admin login/dashboard
