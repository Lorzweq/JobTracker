export default function NotFoundPage({ t }) {
  return (
    <section className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2>Page Not Found</h2>
          <p className="not-found-description">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          
          <button 
            onClick={() => window.location.href = "/"} 
            className="btn-back-home"
          >
            ← Back to Home
          </button>

          <div className="not-found-illustration">
            <div className="floating-card">
              <span>📋</span>
            </div>
            <div className="floating-card" style={{ animationDelay: "0.2s" }}>
              <span>💼</span>
            </div>
            <div className="floating-card" style={{ animationDelay: "0.4s" }}>
              <span>🎯</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
