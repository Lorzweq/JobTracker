import { useState, useEffect } from "react";
import { authenticateUser } from "../utils/supabaseClient";

export default function LoginPage({ t, onLoginSuccess, onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUsername, setStoredUsername] = useState("");
  const [useStoredUsername, setUseStoredUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const u = localStorage.getItem('jobseeker_username');
      if (u) {
        setStoredUsername(u);
        setUseStoredUsername(true);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const usernameToUse = useStoredUsername && storedUsername ? storedUsername : username;
      const user = await authenticateUser(usernameToUse, password);
      if (!user) throw new Error('Invalid credentials');
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>{t("loginWelcomeBack")}</h1>
          <p className="auth-subtitle">{t("loginSignInTo")}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            {useStoredUsername && storedUsername ? (
              <div className="form-group">
                <div>{t("loginSigningInAs")}</div>
                <div className="stored-email-row">
                  <span className="stored-email">{storedUsername}</span>
                  <button
                    type="button"
                    className="auth-link auth-link-button"
                    onClick={() => {
                      try { localStorage.removeItem('jobseeker_username'); } catch (e) {}
                      setUseStoredUsername(false);
                      setStoredUsername('');
                    }}
                  >{t("loginUseDifferentAccount")}</button>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="username">{t("loginUsername")}</label>
                  <input
                    id="username"
                    type="text"
                    placeholder={t("loginUsernamePlaceholder")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="auth-input"
                    autoComplete="username"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
                  />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">{t("loginPassword")}</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="auth-input"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); } }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? "Signing in..." : t("loginSignInButton")}
            </button>
          </form>

          <p className="auth-footer">
            {t("loginNoAccount")} <button type="button" className="auth-link auth-link-button" onClick={() => onNavigate?.("signup")}> {t("loginCreateOne")} </button>
          </p>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
                      <h2>{t("landingTitle")}</h2>
          <p>{t("landingAuth")}</p>
          <ul className="features-list">
            <li>✓ {t("landingFeature1")}</li>
            <li>✓ {t("landingFeature2")}</li>
            <li>✓ {t("landingFeature3")}</li>
            <li>✓ {t("landingFeature4")}</li>
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
