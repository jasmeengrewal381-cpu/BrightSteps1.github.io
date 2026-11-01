BrightSteps Haven update notes

Included updates:
- Admin Dashboard search filters appointments, enquiries, and service videos.
- Parent Dashboard search filters the signed-in parent's appointment history.
- Admin can add, edit, and delete service video records in the Admin Dashboard.
- Public video cards use YouTube embed URLs and include a Watch on YouTube fallback.
- Residential Care page includes example daily routine, support features, safety/wellbeing, family updates, and admission enquiry information.
- Parent Dashboard includes appointment history/status, upcoming appointment reminders, and profile editing.
- Home is the only public content page. Parent-facing pages redirect logged-out visitors to the Parent Login/Sign up screen, then return them to the page they requested after login.
- Admin login remains separate at /admin.
- Existing appointment and enquiries MongoDB collections remain unchanged. Video records use the separate serviceVideos collection.

Setup:
1. Extract the ZIP.
2. In backend, copy config.env.example to config.env and fill in your own credentials.
3. Run npm install and npm run dev in backend.
4. Run npm install and npm run dev in frontend.

Video note: Some YouTube creators disable embedding. In those cases, use the always-visible Watch on YouTube link. The admin video manager lets you add a different public video URL.
