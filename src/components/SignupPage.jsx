import { useState, useCallback } from "react";
import { registerUser } from "../utils/supabaseClient";
import { generateNicknameWithGroq } from "../utils/groqClient";
import { generateNickname } from "../utils/nickname";
import { calculatePasswordStrength, checkPasswordPwned } from "../utils/passwordValidator";

export default function SignupPage({ t, onSignupSuccess, onNavigate }) {
  const [username, setUsername] = useState("");
  const [generatingNickname, setGeneratingNickname] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordPwned, setPasswordPwned] = useState(null);
  const [checkingPassword, setCheckingPassword] = useState(false);

  const handlePasswordChange = useCallback(async (newPassword) => {
    setPassword(newPassword);

    if (!newPassword) {
      setPasswordStrength(null);
      setPasswordPwned(null);
      return;
    }

    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);

    if (newPassword.length >= 6) {
      setCheckingPassword(true);
      const pwned = await checkPasswordPwned(newPassword);
      setPasswordPwned(pwned);
      setCheckingPassword(false);
    }
  }, []);

  const getPasswordLabel = (level) => {
    switch (level) {
      case "weak":
        return `⚠️ ${t("passwordWeak")}`;
      case "fair":
        return `🔸 ${t("passwordFair")}`;
      case "good":
        return `🔹 ${t("passwordGood")}`;
      case "strong":
        return `✅ ${t("passwordStrong")}`;
      case "very-strong":
        return `✅✅ ${t("passwordVeryStrong")}`;
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError(t("errorUsernameRequired"));
    if (username.length < 3) return setError(t("errorUsernameLength"));
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return setError(t("errorUsernameInvalid"));

    if (password !== confirmPassword) return setError(t("errorPasswordsMatch"));
    if (password.length < 6) return setError(t("errorPasswordLength"));

    if (passwordPwned?.isPwned) {
      return setError(t("errorPasswordPwned"));
    }

    setIsLoading(true);
    setGeneratingNickname(true);

    try {
      let nickname;

      try {
        nickname = await generateNicknameWithGroq(username);
      } catch {
        nickname = generateNickname(username);
      }

      const user = await registerUser(username, password, nickname);

      setSuccess(true);
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      localStorage.setItem("jobseeker_username", username);

      setTimeout(() => onSignupSuccess?.(user), 1500);
    } catch (err) {
      setError(err.message || t("errorSignupFailed"));
    } finally {
      setIsLoading(false);
      setGeneratingNickname(false);
    }
  };

  if (success) {
    return (
      <section className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>{t("signupSuccessTitle")}</h2>
              <p>{t("signupSuccessSubtitle")}</p>
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>{t("signupTitle")}</h1>
          <p className="auth-subtitle">{t("signupSubtitle")}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            {/* Username */}
            <div className="form-group">
              <label>{t("signupUsernameLabel")}</label>
              <input
                type="text"
                placeholder={t("signupUsernamePlaceholder")}
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                disabled={isLoading}
                className="auth-input"
                autoComplete="username"
              />
              <small className="password-hint">{t("signupUsernameHint")}</small>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>{t("signupPasswordLabel")}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                className="auth-input"
                autoComplete="new-password"
              />

              {password && (
                <div className="password-strength-container">
                  <div className="password-strength-bar-bg">
                    <div
                      className={`password-strength-bar password-strength-${passwordStrength?.level}`}
                      style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                    />
                  </div>

                  <div className="password-strength-label">
                    <span className={`strength-text strength-${passwordStrength?.level}`}>
                      {getPasswordLabel(passwordStrength?.level)}
                    </span>
                  </div>

                  {passwordStrength?.feedback?.length > 0 && (
                    <ul className="password-feedback">
                      {passwordStrength.feedback.map((tip, idx) => (
                        <li key={idx}>💡 {tip}</li>
                      ))}
                    </ul>
                  )}

                  {checkingPassword && (
                    <div className="password-checking">
                      <span className="spinner-small"></span> {t("passwordChecking")}
                    </div>
                  )}

                  {passwordPwned && !checkingPassword && (
                    <div className={`password-pwned-status ${passwordPwned.isPwned ? "pwned" : "safe"}`}>
                      {passwordPwned.isPwned ? (
                        <>
                          ❌ <strong>{t("passwordCompromised")}:</strong>{" "}
                          {passwordPwned.count.toLocaleString()}
                        </>
                      ) : (
                        <>
                          ✅ <strong>{t("passwordSafe")}</strong>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              <small className="password-hint">{t("signupPasswordHint")}</small>
            </div>

            {/* Confirm */}
            <div className="form-group">
              <label>{t("signupConfirmPasswordLabel")}</label>
              <input
                type="password"
                placeholder={t("signupConfirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="auth-input"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={isLoading || generatingNickname} className="btn-primary">
              {isLoading ? t("signupCreating") : t("signupButton")}
            </button>
          </form>

          <p className="auth-footer">
            {t("signupLoginLink")}{" "}
            <button
              type="button"
              className="auth-link auth-link-button"
              onClick={() => onNavigate?.("login")}
            >
              {t("loginSignInButton")}
            </button>
          </p>
        </div>

        {/* Info panel */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>{t("signupSecureHeading")}</h2>
            <p>{t("signupAuthMethod")}</p>

            <ul className="features-list">
              <li>{t("signupCheck1")}</li>
              <li>{t("signupCheck2")}</li>
              <li>{t("signupCheck3")}</li>
              <li>{t("signupCheck4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}