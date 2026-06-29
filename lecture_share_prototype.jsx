import { useState, useEffect } from "react";
import {
  Upload, FileText, Search, Star, Moon, Sun, Bell, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2, Minimize2, X, Trash2, Pencil, BarChart3,
  LayoutGrid, LogOut, Plus, Loader2, GraduationCap, Users, BookOpen,
  CalendarDays, Download, CheckCircle2, Filter, Eye, Clock3, Sparkles,
  Check
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ===================== Helpers & mock data ===================== */

let idSeed = 1000;
const nextId = () => ++idSeed;

const THUMB_GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-teal-400 to-teal-600",
  "from-amber-400 to-amber-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
  "from-sky-400 to-sky-600",
];

function gradientFor(seed) {
  return THUMB_GRADIENTS[seed % THUMB_GRADIENTS.length];
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function makePages(topic, course) {
  return [
    { kind: "title", title: topic, subtitle: course },
    {
      kind: "bullets", title: "Today's Agenda", bullets: [
        "Quick recap of last lesson",
        `New material: ${topic}`,
        "Worked examples",
        "Practice + questions",
      ]
    },
    {
      kind: "bullets", title: "Key Concept 1", bullets: [
        "Definition and the core idea",
        "Why it matters going forward",
        "A common mistake to avoid",
      ]
    },
    {
      kind: "bullets", title: "Key Concept 2", bullets: [
        "Building on Concept 1",
        "Worked example, step by step",
        "Try it yourself",
      ]
    },
    {
      kind: "bullets", title: "Summary & Next Steps", bullets: [
        `Recap: ${topic}`,
        "Practice set assigned",
        "What's coming next lesson",
      ]
    },
  ];
}

function seedDeck(course, classGroup, topic, date, label, views, downloads) {
  const id = nextId();
  return {
    id, course, classGroup, topic, date, label,
    status: "ready",
    views, downloads,
    color: gradientFor(id),
    pages: makePages(topic, course),
    updatedAt: Date.now(),
  };
}

const initialDecks = [
  seedDeck("AP Biology", "Period 3", "Cell Respiration", "2026-06-20", "past_lesson", 34, 12),
  seedDeck("AP Biology", "Period 3", "Photosynthesis Deep Dive", "2026-07-02", "upcoming_preview", 6, 1),
  seedDeck("World History", "Period 1", "The Cold War Begins", "2026-06-23", "past_lesson", 28, 9),
  seedDeck("World History", "Period 1", "Decolonization in Africa", "2026-07-05", "upcoming_preview", 3, 0),
  seedDeck("Algebra II", "Period 5", "Quadratic Functions", "2026-06-25", "past_lesson", 41, 15),
  seedDeck("Algebra II", "Period 5", "Polynomial Division", "2026-06-27", "past_lesson", 22, 7),
  seedDeck("Algebra II", "Period 5", "Intro to Logarithms", "2026-07-08", "upcoming_preview", 2, 0),
];

const LABELS = {
  past_lesson: { text: "Past Lesson", light: "bg-teal-100 text-teal-800", dark: "dark:bg-teal-900/40 dark:text-teal-300" },
  upcoming_preview: { text: "Upcoming Preview", light: "bg-amber-100 text-amber-800", dark: "dark:bg-amber-900/40 dark:text-amber-300" },
};

function LabelBadge({ label }) {
  const l = LABELS[label];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${l.light} ${l.dark}`}>
      {l.text}
    </span>
  );
}

/* ===================== Toast ===================== */

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg animate-[fadeIn_0.15s_ease-out]"
        >
          <CheckCircle2 size={16} className="text-teal-400 dark:text-teal-600 flex-shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ===================== Login Screen ===================== */

function LoginScreen({ onLogin, darkMode, setDarkMode }) {
  const [role, setRole] = useState("student");
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    onLogin({ name: name || (role === "teacher" ? "Ms. Carter" : "Jordan"), role });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="flex items-center gap-2 mb-8">
        <div className="bg-blue-600 text-white rounded-xl p-2.5">
          <BookOpen size={22} />
        </div>
        <span className="text-xl font-semibold text-slate-800 dark:text-slate-100">LectureShare</span>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setRole("teacher")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
              role === "teacher" ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Users size={15} /> I'm a Teacher
          </button>
          <button
            onClick={() => setRole("student")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
              role === "student" ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <GraduationCap size={15} /> I'm a Student
          </button>
        </div>

        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {role === "teacher" ? "Upload and manage your lesson slides." : "Catch up on missed lectures and preview what's next."}
        </p>

        <div className="flex flex-col gap-3">
          {mode === "register" && (
            <input
              type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          <input
            type="text" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {mode === "login" && (
            <button type="button" className="text-xs text-blue-600 dark:text-blue-400 text-left hover:underline">
              Forgot password?
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-semibold mt-1 transition-colors"
          >
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </div>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <Sparkles size={13} /> Skip the form — continue as demo {role}
      </button>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-8 max-w-xs text-center leading-relaxed">
        Prototype preview — uploads, accounts, and files are simulated for demonstration. No real data is stored.
      </p>
    </div>
  );
}

/* ===================== Empty State ===================== */

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
        <Icon size={26} className="text-slate-400 dark:text-slate-500" />
      </div>
      <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{message}</p>
    </div>
  );
}

/* ===================== Header ===================== */

function Header({ user, darkMode, setDarkMode, onLogout, notifications, onOpenNotifs, notifOpen, onMarkAllRead }) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <header className="flex items-center justify-between gap-3 px-4 md:px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white rounded-lg p-1.5">
          <BookOpen size={18} />
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline">LectureShare</span>
      </div>

      <div className="flex items-center gap-2">
        {user.role === "student" && (
          <div className="relative">
            <button
              onClick={onOpenNotifs}
              className="relative p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifications</span>
                  <button onClick={onMarkAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-400 px-4 py-6 text-center">You're all caught up.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-2.5 text-sm border-b border-slate-50 dark:border-slate-700/50 ${n.read ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-100 bg-blue-50/50 dark:bg-blue-900/10"}`}>
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-semibold">
            {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{user.role}</p>
          </div>
          <button onClick={onLogout} className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" aria-label="Switch role / log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ===================== Teacher: Upload / Edit Form ===================== */

function UploadView({ onCreate, onUpdate, editingDeck, onCancelEdit, courses }) {
  const blank = { course: "", classGroup: "", topic: "", date: "2026-06-28", label: "past_lesson" };
  const [form, setForm] = useState(editingDeck ? { ...editingDeck } : blank);
  const [bulk, setBulk] = useState(false);
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(editingDeck ? { ...editingDeck } : blank);
    setBulk(false);
    setFiles([]);
    setRows([]);
    setError("");
  }, [editingDeck]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFiles(fileList) {
    const list = Array.from(fileList);
    const valid = [];
    for (const f of list) {
      const ext = f.name.split(".").pop().toLowerCase();
      if (!["ppt", "pptx", "pdf"].includes(ext)) {
        setError(`"${f.name}" isn't a supported file type. Please upload PPT, PPTX, or PDF.`);
        continue;
      }
      if (f.size > 100 * 1024 * 1024) {
        setError(`"${f.name}" is over the 100MB limit.`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length) setError("");
    if (bulk) {
      setFiles(valid);
      setRows(valid.map((f) => ({ name: f.name, topic: f.name.replace(/\.[^/.]+$/, ""), date: form.date })));
    } else {
      setFiles(valid.slice(0, 1));
    }
  }

  function submitSingle(e) {
    e.preventDefault();
    if (!form.course.trim() || !form.topic.trim() || !form.date || !form.label) {
      setError("Please fill in course, topic, date, and label before uploading.");
      return;
    }
    if (!editingDeck && files.length === 0) {
      setError("Please attach a slide file (PPT, PPTX, or PDF).");
      return;
    }
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      if (editingDeck) {
        onUpdate(editingDeck.id, { ...form });
      } else {
        onCreate({ ...form, fileName: files[0]?.name || "slides.pdf" });
      }
      setSubmitting(false);
    }, 900);
  }

  function submitBulk(e) {
    e.preventDefault();
    if (!form.course.trim() || !form.label) {
      setError("Please choose a course and label for this batch.");
      return;
    }
    if (rows.length === 0) {
      setError("Please attach at least one file.");
      return;
    }
    if (rows.some((r) => !r.topic.trim() || !r.date)) {
      setError("Every file needs a lesson topic and date.");
      return;
    }
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      rows.forEach((r) => {
        onCreate({
          course: form.course, classGroup: form.classGroup, topic: r.topic,
          date: r.date, label: form.label, fileName: r.name,
        });
      });
      setSubmitting(false);
      setRows([]);
      setFiles([]);
    }, 900);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {editingDeck ? "Edit Lesson Slides" : "Upload Lesson Slides"}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        {editingDeck ? "Update the lesson details or replace the file below." : "Add a slide deck for students to view or download."}
      </p>

      {!editingDeck && (
        <label className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 mb-4 cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Bulk upload</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Upload multiple lesson decks at once</p>
          </div>
          <span
            onClick={() => { setBulk(!bulk); setFiles([]); setRows([]); setError(""); }}
            className={`relative w-10 h-6 rounded-full transition-colors ${bulk ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${bulk ? "translate-x-4" : ""}`} />
          </span>
        </label>
      )}

      <form onSubmit={bulk ? submitBulk : submitSingle} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-4">
        {/* Drop zone */}
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            {editingDeck ? "Replace file (optional)" : "Slide file" + (bulk ? "s" : "")}
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-8 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-center">
            <Upload size={22} className="text-slate-400 mb-2" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Drop {bulk ? "files" : "a file"} here, or <span className="text-blue-600 dark:text-blue-400 font-medium">browse</span>
            </span>
            <span className="text-xs text-slate-400 mt-1">PPT, PPTX, or PDF · up to 100MB each</span>
            <input type="file" multiple={bulk} accept=".ppt,.pptx,.pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
          {!bulk && files[0] && (
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-300">
              <FileText size={14} /> {files[0].name}
            </div>
          )}
        </div>

        {bulk && rows.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-3 py-2">File</th>
                  <th className="text-left px-3 py-2">Lesson Topic</th>
                  <th className="text-left px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{r.name}</td>
                    <td className="px-2 py-1.5">
                      <input
                        value={r.topic}
                        onChange={(e) => setRows((rs) => rs.map((row, idx) => idx === i ? { ...row, topic: e.target.value } : row))}
                        className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="date" value={r.date}
                        onChange={(e) => setRows((rs) => rs.map((row, idx) => idx === i ? { ...row, date: e.target.value } : row))}
                        className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Course Name</label>
            <input
              list="course-options" value={form.course} onChange={(e) => set("course", e.target.value)}
              placeholder="e.g. AP Biology"
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="course-options">
              {courses.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Class Group</label>
            <input
              value={form.classGroup} onChange={(e) => set("classGroup", e.target.value)}
              placeholder="e.g. Period 3"
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {!bulk && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Lesson Topic</label>
              <input
                value={form.topic} onChange={(e) => set("topic", e.target.value)}
                placeholder="e.g. Cell Respiration"
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Lesson Date</label>
              <input
                type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Label</label>
          <div className="grid grid-cols-2 gap-2">
            {["past_lesson", "upcoming_preview"].map((l) => (
              <button
                type="button" key={l} onClick={() => set("label", l)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.label === l
                    ? l === "past_lesson" ? "bg-teal-50 dark:bg-teal-900/30 border-teal-400 text-teal-700 dark:text-teal-300" : "bg-amber-50 dark:bg-amber-900/30 border-amber-400 text-amber-700 dark:text-amber-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {form.label === l && <Check size={14} />}
                {l === "past_lesson" ? "Past Lesson" : "Upcoming Preview"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {submitting ? "Processing…" : editingDeck ? "Save Changes" : bulk ? `Upload ${rows.length || 0} Decks` : "Upload Slides"}
          </button>
          {editingDeck && (
            <button type="button" onClick={onCancelEdit} className="text-sm text-slate-500 dark:text-slate-400 px-3 py-2.5 hover:text-slate-700 dark:hover:text-slate-200">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ===================== Teacher: My Slides ===================== */

function TeacherDeckCard({ deck, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className={`h-24 bg-gradient-to-br ${deck.color} flex items-center justify-center relative`}>
        {deck.status === "processing" ? (
          <div className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/30 px-2.5 py-1 rounded-full">
            <Loader2 size={12} className="animate-spin" /> Processing…
          </div>
        ) : (
          <FileText size={26} className="text-white/90" />
        )}
        <span className="absolute top-2 left-2"><LabelBadge label={deck.label} /></span>
      </div>
      <div className="p-3.5 flex-1 flex flex-col">
        <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{deck.topic}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{deck.course} · {deck.classGroup || "All groups"}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(deck.date)}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
          <span className="flex items-center gap-1"><Eye size={12} /> {deck.views}</span>
          <span className="flex items-center gap-1"><Download size={12} /> {deck.downloads}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => onEdit(deck)} className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onDelete(deck)} className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 ml-auto">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MySlidesView({ decks, onEdit, onDelete }) {
  if (decks.length === 0) {
    return <EmptyState icon={FileText} title="No slides uploaded yet" message="Use the Upload tab to add your first lesson deck." />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((d) => <TeacherDeckCard key={d.id} deck={d} onEdit={onEdit} onDelete={onDelete} />)}
    </div>
  );
}

/* ===================== Teacher: Analytics ===================== */

function AnalyticsView({ decks }) {
  const totalViews = decks.reduce((s, d) => s + d.views, 0);
  const totalDownloads = decks.reduce((s, d) => s + d.downloads, 0);
  const chartData = [...decks]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((d) => ({ name: d.topic.length > 16 ? d.topic.slice(0, 15) + "…" : d.topic, views: d.views, downloads: d.downloads }));

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Student Engagement</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">Total Slide Decks</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">{decks.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">Total Views</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">{totalViews}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">Total Downloads</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-1">{totalDownloads}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Views & downloads by lesson</p>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="downloads" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">Lesson</th>
              <th className="text-left px-4 py-2.5">Course</th>
              <th className="text-left px-4 py-2.5">Date</th>
              <th className="text-right px-4 py-2.5">Views</th>
              <th className="text-right px-4 py-2.5">Downloads</th>
            </tr>
          </thead>
          <tbody>
            {decks.map((d) => (
              <tr key={d.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{d.topic}</td>
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{d.course}</td>
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{formatDate(d.date)}</td>
                <td className="px-4 py-2.5 text-right text-slate-700 dark:text-slate-200">{d.views}</td>
                <td className="px-4 py-2.5 text-right text-slate-700 dark:text-slate-200">{d.downloads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===================== Teacher Dashboard ===================== */

function TeacherDashboard({ decks, onCreate, onUpdate, onDelete, courses }) {
  const [view, setView] = useState("myslides");
  const [editingDeck, setEditingDeck] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navItems = [
    { id: "upload", label: "Upload Slides", icon: Upload },
    { id: "myslides", label: "My Slides", icon: LayoutGrid },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  function goTo(id) {
    setEditingDeck(null);
    setView(id);
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-56 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id} onClick={() => goTo(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === item.id ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <item.icon size={16} /> {item.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        {view === "upload" && (
          <UploadView
            courses={courses}
            editingDeck={editingDeck}
            onCancelEdit={() => goTo("myslides")}
            onCreate={(data) => { onCreate(data); goTo("myslides"); }}
            onUpdate={(id, data) => { onUpdate(id, data); goTo("myslides"); }}
          />
        )}
        {view === "myslides" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">My Slides</h2>
              <button onClick={() => goTo("upload")} className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg">
                <Plus size={15} /> Upload New
              </button>
            </div>
            <MySlidesView decks={decks} onEdit={(d) => { setEditingDeck(d); setView("upload"); }} onDelete={setConfirmDelete} />
          </>
        )}
        {view === "analytics" && <AnalyticsView decks={decks} />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30">
        {navItems.map((item) => (
          <button
            key={item.id} onClick={() => goTo(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              view === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 max-w-sm w-full">
            <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Delete this slide deck?</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              "{confirmDelete.topic}" will be permanently removed for all students. This can't be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="text-sm px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button
                onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}
                className="text-sm px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Student: Deck Card ===================== */

function StudentDeckCard({ deck, bookmarked, onToggleBookmark, onOpen, onDownload }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col group">
      <button onClick={() => onOpen(deck)} className={`h-28 w-full bg-gradient-to-br ${deck.color} flex items-center justify-center relative`}>
        <FileText size={28} className="text-white/90" />
        <span className="absolute top-2 left-2"><LabelBadge label={deck.label} /></span>
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </button>
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{deck.topic}</p>
          <button onClick={() => onToggleBookmark(deck.id)} aria-label="Bookmark" className="flex-shrink-0">
            <Star size={16} className={bookmarked ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-600"} />
          </button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{deck.course} · {deck.classGroup}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
          <CalendarDays size={11} /> {formatDate(deck.date)}
        </p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => onOpen(deck)} className="flex-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg py-1.5">
            View
          </button>
          <button onClick={() => onDownload(deck)} aria-label="Download" className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== Student Dashboard ===================== */

function StudentDashboard({ decks, bookmarks, onToggleBookmark, onOpen, onDownload }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");

  const courses = ["all", ...Array.from(new Set(decks.map((d) => d.course)))];

  const tabs = [
    { id: "all", label: "All Slides" },
    { id: "missed", label: "Missed Lectures" },
    { id: "preview", label: "Future Previews" },
    { id: "bookmarks", label: "Bookmarks" },
  ];

  let filtered = decks.filter((d) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || d.topic.toLowerCase().includes(q) || d.course.toLowerCase().includes(q) || d.date.includes(q);
    const matchesCourse = courseFilter === "all" || d.course === courseFilter;
    return matchesQuery && matchesCourse;
  });

  if (tab === "missed") filtered = filtered.filter((d) => d.label === "past_lesson");
  if (tab === "preview") filtered = filtered.filter((d) => d.label === "upcoming_preview");
  if (tab === "bookmarks") filtered = filtered.filter((d) => bookmarks.includes(d.id));

  filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  const grouped = filtered.reduce((acc, d) => {
    acc[d.course] = acc[d.course] || [];
    acc[d.course].push(d);
    return acc;
  }, {});

  const emptyCopy = {
    all: { title: "No slides match your search", message: "Try a different keyword or clear your filters." },
    missed: { title: "Nothing to catch up on", message: "You're all caught up — check back after your next class!" },
    preview: { title: "No upcoming previews yet", message: "Your teacher hasn't posted preview slides for the next lesson." },
    bookmarks: { title: "No bookmarks yet", message: "Tap the star on any slide deck to save it here for quick access." },
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, course, or date…"
            className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-medium border ${
            showFilters ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-700 dark:text-blue-300" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Filter size={14} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Course:</label>
          <select
            value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {courses.map((c) => <option key={c} value={c}>{c === "all" ? "All Courses" : c}</option>)}
          </select>
        </div>
      )}

      <div className="flex gap-1 mb-5 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id} onClick={() => setTab(t.id)}
            className={`px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? "border-blue-600 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={tab === "bookmarks" ? Star : BookOpen} title={emptyCopy[tab].title} message={emptyCopy[tab].message} />
      ) : tab === "missed" ? (
        Object.entries(grouped).map(([course, list]) => (
          <div key={course} className="mb-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Clock3 size={14} /> {course}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {list.map((d) => (
                <StudentDeckCard key={d.id} deck={d} bookmarked={bookmarks.includes(d.id)} onToggleBookmark={onToggleBookmark} onOpen={onOpen} onDownload={onDownload} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((d) => (
            <StudentDeckCard key={d.id} deck={d} bookmarked={bookmarks.includes(d.id)} onToggleBookmark={onToggleBookmark} onOpen={onOpen} onDownload={onDownload} />
          ))}
        </div>
      )}
    </main>
  );
}

/* ===================== Slide Viewer Modal ===================== */

function SlideViewerModal({ deck, onClose, onDownload, bookmarked, onToggleBookmark }) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const total = deck.pages.length;

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") setPage((p) => Math.min(total, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(2, z + 0.25));
      if (e.key === "-") setZoom((z) => Math.max(0.5, z - 0.25));
      if (e.key === "Escape") {
        if (fullscreen) setFullscreen(false);
        else onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [total, fullscreen, onClose]);

  const slide = deck.pages[page - 1];

  return (
    <div className={`fixed z-[60] bg-black/70 flex items-center justify-center ${fullscreen ? "inset-0" : "inset-3 md:inset-10"}`}>
      <div className={`bg-white dark:bg-slate-900 w-full h-full flex flex-col ${fullscreen ? "" : "rounded-2xl overflow-hidden max-w-5xl"}`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{deck.topic}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{deck.course} · {formatDate(deck.date)}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onToggleBookmark(deck.id)} aria-label="Bookmark" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <Star size={16} className={bookmarked ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
            </button>
            <button onClick={() => onDownload(deck)} aria-label="Download" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300">
              <Download size={16} />
            </button>
            <button onClick={() => setFullscreen(!fullscreen)} aria-label="Toggle fullscreen" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300">
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={onClose} aria-label="Close viewer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Slide canvas */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-6">
          <div
            style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease-out" }}
            className="bg-white rounded-lg shadow-xl w-[640px] h-[360px] flex-shrink-0 flex flex-col items-center justify-center px-10 text-center"
          >
            {slide.kind === "title" ? (
              <>
                <p className="text-2xl font-bold text-slate-800">{slide.title}</p>
                <p className="text-sm text-slate-500 mt-2">{slide.subtitle}</p>
              </>
            ) : (
              <div className="w-full text-left">
                <p className="text-lg font-semibold text-slate-800 mb-4">{slide.title}</p>
                <ul className="space-y-2">
                  {slide.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous slide" className="p-2 rounded-lg disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400 w-20 text-center">Page {page} of {total}</span>
          <button onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page >= total} aria-label="Next slide" className="p-2 rounded-lg disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ChevronRight size={18} />
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} aria-label="Zoom out" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.25))} aria-label="Zoom in" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== App ===================== */

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState(initialDecks);
  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [viewerDeckId, setViewerDeckId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const courses = Array.from(new Set(decks.map((d) => d.course)));
  const viewerDeck = decks.find((d) => d.id === viewerDeckId);

  function showToast(message) {
    const id = nextId();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }

  function addNotification(deck) {
    const msg = `New ${deck.label === "past_lesson" ? "past lesson" : "upcoming preview"} slides: "${deck.topic}" (${deck.course})`;
    setNotifications((n) => [{ id: nextId(), message: msg, read: false, deckId: deck.id }, ...n]);
  }

  function handleCreate(data) {
    const id = nextId();
    const deck = {
      id, course: data.course, classGroup: data.classGroup, topic: data.topic,
      date: data.date, label: data.label, status: "processing",
      views: 0, downloads: 0, color: gradientFor(id), pages: makePages(data.topic, data.course),
      updatedAt: Date.now(),
    };
    setDecks((d) => [deck, ...d]);
    showToast(`Uploading "${data.topic}"…`);
    setTimeout(() => {
      setDecks((ds) => ds.map((d) => d.id === id ? { ...d, status: "ready" } : d));
      addNotification(deck);
      showToast(`"${data.topic}" is ready to view`);
    }, 1400);
  }

  function handleUpdate(id, data) {
    setDecks((ds) => ds.map((d) => d.id === id ? {
      ...d, course: data.course, classGroup: data.classGroup, topic: data.topic,
      date: data.date, label: data.label, pages: makePages(data.topic, data.course), updatedAt: Date.now(),
    } : d));
    showToast("Lesson details updated");
  }

  function handleDelete(id) {
    setDecks((ds) => ds.filter((d) => d.id !== id));
    showToast("Slide deck deleted");
  }

  function toggleBookmark(id) {
    setBookmarks((b) => b.includes(id) ? b.filter((x) => x !== id) : [...b, id]);
  }

  function openViewer(deck) {
    setDecks((ds) => ds.map((d) => d.id === deck.id ? { ...d, views: d.views + 1 } : d));
    setViewerDeckId(deck.id);
  }

  function handleDownload(deck) {
    setDecks((ds) => ds.map((d) => d.id === deck.id ? { ...d, downloads: d.downloads + 1 } : d));
    showToast(`Downloading "${deck.topic}" (demo)`);
  }

  if (!user) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <LoginScreen onLogin={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors" onClick={() => notifOpen && setNotifOpen(false)}>
        <Header
          user={user} darkMode={darkMode} setDarkMode={setDarkMode}
          onLogout={() => setUser(null)}
          notifications={notifications}
          notifOpen={notifOpen}
          onOpenNotifs={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }}
          onMarkAllRead={() => setNotifications((n) => n.map((x) => ({ ...x, read: true })))}
        />

        {user.role === "teacher" ? (
          <TeacherDashboard decks={decks} onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete} courses={courses} />
        ) : (
          <StudentDashboard
            decks={decks.filter((d) => d.status === "ready")}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onOpen={openViewer}
            onDownload={handleDownload}
          />
        )}

        {viewerDeck && (
          <SlideViewerModal
            deck={viewerDeck}
            onClose={() => setViewerDeckId(null)}
            onDownload={handleDownload}
            bookmarked={bookmarks.includes(viewerDeck.id)}
            onToggleBookmark={toggleBookmark}
          />
        )}

        <ToastStack toasts={toasts} />
      </div>
    </div>
  );
}
