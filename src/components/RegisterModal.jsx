import { useEffect } from "react";

export default function RegisterModal({ onClose, onRegister, onSignIn, t }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="register-modal-backdrop" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="register-modal-content">
          <div className="register-icon">🚀</div>
          <h2>Join JobSeeker</h2>
          <p className="register-description">
            Create a free account to start tracking your job applications, analyze your CV, and match with opportunities.
          </p>

          <div className="register-features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Track Applications</h3>
                <p>Organize all your job applications in one place</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <div>
                <h3>AI CV Analysis</h3>
                <p>Get insights on your skills and match with jobs</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <div>
                <h3>Secure & Private</h3>
                <p>Your data is encrypted and never shared</p>
              </div>
            </div>
          </div>

          <div className="register-buttons">
            <button className="btn-register-signup" onClick={onRegister}>
              Create Account
            </button>
            <button className="btn-register-signin" onClick={onSignIn}>
              Sign In
            </button>
          </div>

          <p className="register-footer">
            Secure authentication by <a href="https://supabase.com" target="_blank" rel="noreferrer" className="footer-link">Supabase</a>
          </p>
        </div>
      </div>
    </div>
  );
}
