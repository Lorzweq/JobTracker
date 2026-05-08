import { useState, useEffect, useCallback } from "react";
import { I18nContext } from "./contexts/I18nContext";
import { translations } from "./i18n/translations";
import { load, save, STAGES, emptyJob } from "./utils/helpers";
import { signOut, getSession, setSession } from "./utils/supabaseClient";
import JobModal from "./components/JobModal";
import Column from "./components/Column";
import AnalyticsPage from "./components/AnalyticsPage";
import CVAnalyzerPage from "./components/CVAnalyzerPage";
import LandingPage from "./components/LandingPage";
import FlyingCard from "./components/FlyingCard";
import TermsPage from "./components/TermsPage";
import PrivacyPage from "./components/PrivacyPage";
import DisclaimerPage from "./components/DisclaimerPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import NotFoundPage from "./components/NotFoundPage";
import RegisterModal from "./components/RegisterModal";
import LeaderboardPage from "./components/LeaderboardPage";
import { STAGE_COLORS } from "./utils/helpers"; // if not already imported
import { loadLeaderboardEntries, syncCurrentUserLeaderboardEntry } from "./utils/leaderboard";
import "./index.css";

export default function App() {
  const [jobs, setJobs] = useState(load);
  const [page, setPage] = useState(() => {
    try {
      const session = getSession();
      return session?.user ? "board" : "home";
    } catch {
      return "home";
    }
  }); // home, board, analytics, leaderboard, cv, terms, privacy, disclaimer, login, signup, 404
  const [transitionPage, setTransitionPage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modal, setModal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [search, setSearch] = useState("");
  const [fade, setFade] = useState(false);
  const [langChanging, setLangChanging] = useState(false);

  // Auth state - restore from stored session on this device
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(getSession()?.user);
    } catch {
      return localStorage.getItem("jobtracker_auth") === "true";
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const session = getSession();
      return session?.user || null;
    } catch {
      return null;
    }
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [requestedPage, setRequestedPage] = useState(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState(() => loadLeaderboardEntries());

  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem("jobtracker_lang");
    return (stored === "fi" || stored === "en" || stored === "sv") ? stored : "fi";
  });
  const t = useCallback((key) => translations[lang][key] || key, [lang]);

  const changeLanguage = (newLang) => {
    if (newLang === lang) return;
    setLangChanging(true);
    // short fade-out then switch language then fade-in
    window.setTimeout(() => {
      setLang(newLang);
      setLangChanging(false);
    }, 260);
  };

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("jobtracker_theme");
    return (stored === "light" || stored === "dark") ? stored : "dark";
  });

  // Theme is already set via script in index.html, but keep this for changes
  useEffect(() => {
    localStorage.setItem("jobtracker_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem("jobtracker_lang", lang); }, [lang]);
  useEffect(() => save(jobs), [jobs]);

  // Auth state sync with localStorage
  useEffect(() => {
    localStorage.setItem("jobtracker_auth", isAuthenticated.toString());
  }, [isAuthenticated]);

  // Restore user from localStorage on app mount if session exists
  useEffect(() => {
    try {
      const session = getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        localStorage.setItem("jobtracker_auth", "true");
      } else {
        // A stale auth flag without a session should not keep the app half-authenticated.
        setIsAuthenticated(false);
        localStorage.removeItem("jobtracker_auth");
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
    }
  }, []);

  // Keep session refreshed while authenticated so login persists on this device.
  useEffect(() => {
    if (isAuthenticated && user) {
      setSession(user);
    }
  }, [isAuthenticated, user]);



  useEffect(() => {
    if (isAuthenticated && user) {
      setLeaderboardEntries(syncCurrentUserLeaderboardEntry(user, jobs.length));
    } else {
      setLeaderboardEntries(loadLeaderboardEntries());
    }
  }, [isAuthenticated, user, jobs.length]);

  // Triggered when clicking "+" on a column
const openAddForStage = (stage) => {
  setAddModalStage(stage);
};

// Called after modal form is submitted
const handleAddWithFly = (formData, targetStage) => {
  // Find the "+" button and column body positions
  const addBtn = document.querySelector(`.column-wrapper[data-stage="${targetStage}"] .col-add-button`);
  const columnBody = document.querySelector(`.column-wrapper[data-stage="${targetStage}"] .col-body`);
  
  if (addBtn && columnBody) {
    const startRect = addBtn.getBoundingClientRect();
    const endRect = columnBody.getBoundingClientRect();
    
    const newJob = {
      ...formData,
      id: Date.now(),
      stage: targetStage,
    };
    
    setFlyingCardData({
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: endRect.left + 30,   // approximate first card position
      endY: endRect.top + 30,
      job: newJob,
    });
  } else {
    // fallback (no animation)
    const newJob = { ...formData, id: Date.now(), stage: targetStage };
    setJobs(prev => [...prev, newJob]);
  }
  setAddModalStage(null);
};

// When flying animation finishes, actually add the job
const finishFlyingAndAdd = (job) => {
  setJobs(prev => [...prev, job]);
  setFlyingCardData(null);
};

  const saveJob = (form) => {
    setJobs(prev => {
      const exists = prev.find(j => j.id === form.id);
      return exists ? prev.map(j => j.id === form.id ? form : j) : [...prev, form];
    });
    setModal(null);
  };
  const deleteJob = (id) => { setJobs(prev => prev.filter(j => j.id !== id)); setModal(null); };
  const moveJob = (id, stage) => setJobs(prev => prev.map(j => j.id === id ? { ...j, stage } : j));
  const filtered = jobs.filter(j => !search || `${j.company} ${j.role} ${j.location}`.toLowerCase().includes(search.toLowerCase()));

  // Auth handlers
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("jobtracker_auth", "true");
    if (userData?.username) {
      localStorage.setItem("jobseeker_username", userData.username);
    }
    // Persist session so user stays logged in after page refresh
    setSession(userData);
    setLeaderboardEntries(syncCurrentUserLeaderboardEntry(userData, jobs.length));
    // Redirect to requested page or board
    switchPage(requestedPage || "board");
    setRequestedPage(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("jobtracker_auth");
    localStorage.removeItem("auth_session");
    localStorage.removeItem("auth_user");
    switchPage("home");
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(false);
    switchPage("signup");
  };

  const handleSignInClick = () => {
    setShowRegisterModal(false);
    switchPage("login");
  };

  const switchPage = (newPage) => {
    // Special-case: demo/test entrypoint — enable demo mode and open board
    let bypassAuth = false;
    if (newPage === "demo") {
      setDemoMode(true);
      newPage = "board";
      bypassAuth = true;
    }

    // Guard: Protect certain pages if not authenticated (but allow demoMode)
    if (!isAuthenticated && !demoMode && !bypassAuth && ["board", "analytics", "leaderboard", "cv"].includes(newPage)) {
      setRequestedPage(newPage);
      setShowRegisterModal(true);
      return;
    }

    if (newPage === page && !isTransitioning) return;
    setTransitionPage(newPage);
    setIsTransitioning(true);
    setFade(true);
    window.setTimeout(() => {
      setPage(newPage);
      setFade(false);
      setIsTransitioning(false);
      setTransitionPage(null);
    }, 650);
  };

  const renderTransitionSkeleton = () => (
    <div className="page-transition-skeleton" aria-live="polite" aria-busy="true">
      <div className="transition-shell">
        <div className="transition-hero skeleton">
          <div className="skeleton-title transition-title"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line"></div>
        </div>
        <div className="transition-grid">
          <div className="skeleton transition-card">
            <div className="skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line half"></div>
          </div>
          <div className="skeleton transition-card">
            <div className="skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line half"></div>
          </div>
          <div className="skeleton transition-card transition-card-wide">
            <div className="skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
        <div className="transition-label">
          {transitionPage === "board" && "Preparing your board..."}
          {transitionPage === "analytics" && "Loading analytics..."}
          {transitionPage === "leaderboard" && "Loading leaderboard..."}
          {transitionPage === "cv" && "Opening CV analyzer..."}
        </div>
      </div>
    </div>
  );

  // If on landing page, show landing without header
  if (page === "home") {
    return (
      <I18nContext.Provider value={{ t, lang, setLang }}>
        <div className="app">
          <LandingPage onNavigate={switchPage} t={t} />
          {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} onRegister={handleRegisterClick} onSignIn={handleSignInClick} t={t} />}
          {isTransitioning && renderTransitionSkeleton()}
        </div>
      </I18nContext.Provider>
    );
  }

  // Show auth pages (login, signup) without header
  if (page === "login") {
    return (
      <I18nContext.Provider value={{ t, lang, setLang }}>
        <div className="app">
          <LoginPage t={t} onLoginSuccess={handleLogin} onNavigate={switchPage} />
          {isTransitioning && renderTransitionSkeleton()}
        </div>
      </I18nContext.Provider>
    );
  }

  if (page === "signup") {
    return (
      <I18nContext.Provider value={{ t, lang, setLang }}>
        <div className="app">
          <SignupPage t={t} onSignupSuccess={handleLogin} onNavigate={switchPage} />
          {isTransitioning && renderTransitionSkeleton()}
        </div>
      </I18nContext.Provider>
    );
  }

  if (page === "404") {
    return (
      <I18nContext.Provider value={{ t, lang, setLang }}>
        <div className="app">
          <NotFoundPage t={t} />
        </div>
      </I18nContext.Provider>
    );
  }

  // Otherwise show main app with header
  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      <div className="app">
        <header className="header">
          <div className="header-left" style={{ cursor: "pointer" }} onClick={() => switchPage("board")}>
            <h1 className="app-title">{t("appTitle")}</h1>
            <span className="app-sub">{t("appSub")}</span>
          </div>
          <div className="header-right">
              {(isAuthenticated || demoMode) && <input className="search" placeholder={t("search")} value={search} onChange={e => setSearch(e.target.value)} />}
              {(isAuthenticated || demoMode) && (
              <div className="tabs">
                <button className={`tab ${page === "board" ? "tab-active" : ""}`} onClick={() => switchPage("board")}>{t("board")}</button>
                <button className={`tab ${page === "analytics" ? "tab-active" : ""}`} onClick={() => switchPage("analytics")}>{t("analytics")}</button>
                <button className={`tab ${page === "leaderboard" ? "tab-active" : ""}`} onClick={() => switchPage("leaderboard")}>{t("leaderboard")}</button>
                <button className={`tab ${page === "cv" ? "tab-active" : ""}`} onClick={() => switchPage("board")}>{t("cvAnalyzer")}</button>
              </div>
            )}
            <div className="theme-toggle">
              <span className="theme-label">{t("themeToggle")}</span>
              <div className="toggle-switch">
                <button className={`toggle-opt ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>☀️</button>
                <button className={`toggle-opt ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>🌙</button>
              </div>
            </div>
            <div className="lang-selector">
              <button className={`lang-btn ${lang === "fi" ? "active" : ""}`} onClick={() => changeLanguage("fi")}>FI</button>
              <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => changeLanguage("en")}>EN</button>
              <button className={`lang-btn ${lang === "sv" ? "active" : ""}`} onClick={() => changeLanguage("sv")}>SV</button>
            </div>
            {isAuthenticated && <button className="btn-add" onClick={() => setModal(emptyJob())}>+ {t("addJob")}</button>}
            {isAuthenticated && <button className="btn-logout" onClick={handleLogout}>{t("logout")}</button>}
            {!isAuthenticated && demoMode && <button className="btn-demo-exit" onClick={() => { setDemoMode(false); switchPage("home"); }}>{t("exitDemo")}</button>}
          </div>
        </header>

        <main className={`content ${fade ? "fade-out" : "fade-in"}`}>
          {page === "board" && <div className="board">{STAGES.map(stage => <Column key={stage} stage={stage} jobs={filtered.filter(j => j.stage === stage)} onEdit={j => { if (isAuthenticated) setModal(j); else { setRequestedPage("board"); setShowRegisterModal(true); } }} onDrop={moveJob} dragOverStage={dragOverStage} setDragOverStage={setDragOverStage} draggingId={draggingId} setDraggingId={setDraggingId} t={t} />)}</div>}
          {page === "analytics" && <AnalyticsPage jobs={jobs} t={t} />}
          {page === "leaderboard" && <LeaderboardPage entries={leaderboardEntries} currentUserId={user?.id} t={t} />}
          {page === "cv" && <CVAnalyzerPage t={t} />}
          {page === "terms" && <TermsPage t={t} />}
          {page === "privacy" && <PrivacyPage t={t} />}
          {page === "disclaimer" && <DisclaimerPage t={t} />}
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-links">
              <button onClick={() => switchPage("terms")} className="footer-link">{t("terms")}</button>
              <button onClick={() => switchPage("privacy")} className="footer-link">{t("privacy")}</button>
              <button onClick={() => switchPage("disclaimer")} className="footer-link">{t("disclaimer")}</button>
              <a href="mailto:support@jobseeker.app" className="footer-link">{t("support")}</a>
            </div>
            <p className="footer-text">&copy; 2026 JobSeeker. All rights reserved.</p>
          </div>
        </footer>

        {modal && <JobModal job={modal} onSave={saveJob} onClose={() => setModal(null)} onDelete={modal.company ? () => deleteJob(modal.id) : null} t={t} />}
      </div>
    </I18nContext.Provider>
  );
}