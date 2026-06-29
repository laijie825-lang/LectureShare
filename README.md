# LectureShare

**LectureShare** is a lecture slide sharing platform for classrooms — teachers upload lesson decks after class so absent students can catch up, and students can also browse preview slides for lessons that haven't happened yet.

This repo contains an **interactive frontend prototype** (single React component, mock data, no backend) built to demo the full user experience before building the real, production backend.

> 🧪 **This is a prototype, not a production app.** Logins, file uploads, and slide content are all simulated in-browser so you can click through the entire experience with no server, database, or file storage required. See [What's real vs. simulated](#whats-real-vs-simulated) below.

---

## Features

**Teacher Dashboard**
- Upload lesson slides with Course, Class Group, Lesson Topic, Date, and Label (Past Lesson / Upcoming Preview) tags
- Bulk upload mode for tagging multiple decks at once
- Edit lesson details or replace a file on an existing deck
- Delete decks with a confirmation step
- Engagement analytics: views & downloads per deck, with a chart of top lessons

**Student Dashboard**
- Filterable, searchable slide library (by topic, course, or date)
- Dedicated **Missed Lectures** tab, auto-grouped by course
- Dedicated **Future Previews** tab for early-posted lessons
- In-browser slide viewer: page navigation, zoom, fullscreen, keyboard shortcuts
- Bookmarks for quick access to saved decks
- One-click download per deck

**Shared**
- Teacher / Student role-based dashboards and navigation
- Light / dark mode toggle
- In-app notifications when new slides are posted
- Mobile-responsive layout (sidebar nav collapses to a bottom tab bar)

---

## Quick Start

This prototype is a single React component (`lecture_share_prototype.jsx`). To run it locally:

```bash
npm create vite@latest lectureshare-demo -- --template react
cd lectureshare-demo
npm install lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

1. Copy `lecture_share_prototype.jsx` into `src/App.jsx` (replacing the default file).
2. Make sure Tailwind is wired up in `src/index.css` (`@tailwind base; @tailwind components; @tailwind utilities;`) and `tailwind.config.js` includes `./src/**/*.{js,jsx}` in `content`.
3. Run it:

```bash
npm run dev
```

### Dependencies
- [React](https://react.dev/) 18+
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) — icons
- [recharts](https://recharts.org/) — the engagement chart on the Analytics page

---

## How to Use the Demo

1. On the login screen, pick **Teacher** or **Student**, then either fill in any dummy email/password or hit **"Skip the form — continue as demo [role]."**
2. **As a Teacher:** go to **Upload Slides**, fill in the lesson details, attach any file, and submit. It'll show "Processing…" then become available to students.
3. **Switch roles** any time via the logout icon (top right) — your uploads and data persist for the rest of the session.
4. **As a Student:** check the **Missed Lectures** / **Future Previews** tabs, open a deck to try the slide viewer (arrow keys to change page, `+`/`-` to zoom, fullscreen icon), star a deck to bookmark it, and check the notification bell for new uploads.

---

## What's Real vs. Simulated

Since this prototype has no backend, a few things are mocked so the full flow is still demonstrable:

| Feature | In this prototype | In a real build |
|---|---|---|
| Accounts & login | Any input works — no real auth | Real email/password auth with hashed passwords |
| File upload | Captures the filename only | Actual file stored (e.g. S3-compatible storage) |
| Slide rendering | Auto-generated placeholder slides based on the lesson topic | Real PPT/PPTX/PDF converted to images and rendered with PDF.js |
| Data persistence | Resets on page refresh (in-memory state only) | Stored in a real database |
| Engagement metrics | Manually incremented mock counters | Logged per real student view/download |

A full technical spec for turning this into a production app — tech stack, database schema, API design, and code samples — is available as a companion document if you'd like to build it out further.

---

## Project Structure

The whole prototype lives in one file for portability:

```
lecture_share_prototype.jsx
├─ LoginScreen          – role selection, login/register
├─ Header               – nav bar, dark mode toggle, notifications
├─ TeacherDashboard      – sidebar nav: Upload / My Slides / Analytics
│  ├─ UploadView         – single + bulk upload form
│  ├─ MySlidesView       – deck grid with edit/delete
│  └─ AnalyticsView      – engagement stats + chart
├─ StudentDashboard      – search, filters, tabs, deck grid
│  └─ StudentDeckCard    – bookmark, view, download
├─ SlideViewerModal      – page nav, zoom, fullscreen, keyboard controls
└─ App                   – top-level state & routing between the above
```

---

## Roadmap

- [ ] Real authentication (email/password, password reset)
- [ ] File storage + PPT/PPTX → PDF conversion pipeline
- [ ] Persistent database (courses, decks, views, bookmarks)
- [ ] Real-time notifications
- [ ] Class roster / enrollment management
- [ ] Admin console for school staff accounts

---

## License

MIT — feel free to use this as a starting point for your own project.
