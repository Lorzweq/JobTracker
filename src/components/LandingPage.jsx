import { useEffect, useRef } from "react";

export default function LandingPage({ onNavigate, t }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const particles = [];
    const particleCount = 72;
    let animationFrameId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${0.16 + Math.sin(Date.now() * 0.001) * 0.08})`;
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-left" aria-hidden="true" />
      <div className="landing-glow landing-glow-right" aria-hidden="true" />
      <canvas ref={canvasRef} className="particle-canvas" />

      <div className="landing-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="landing-badge">
              <span className="landing-badge-dot" />
              Job tracking, upgraded
            </div>

            
            <h1 className="landing-title">{t("appTitle")}</h1>
            <p className="landing-sub">{t("appSub")}</p>
            <p className="landing-description">{t("landingDesc")}</p>

            <div className="landing-aux">
              <button className="auth-link auth-link-button landing-signin" onClick={() => onNavigate("login")}>{t("signin")}</button>
              <button className="auth-link auth-link-button landing-test" onClick={() => onNavigate("demo")}>{t("testSite")}</button>
            </div>

            <div className="landing-points">
              <div className="landing-point">
                <span className="landing-point-kicker">Board</span>
                <span>{t("boardDesc")}</span>
              </div>
              <div className="landing-point">
                <span className="landing-point-kicker">AI</span>
                <span>{t("cvDescShort")}</span>
              </div>
              <div className="landing-point">
                <span className="landing-point-kicker">Flow</span>
                <span>{t("analyticsDesc")}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="preview-frame">
              <div className="preview-topbar">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-grid">
                <div className="preview-panel preview-panel-large">
                  <div className="preview-label">{t("board")}</div>
                  <div className="preview-card preview-card-accent">
                    <span className="preview-card-title">Product Designer</span>
                    <span className="preview-card-sub">Aurora Studio</span>
                  </div>
                  <div className="preview-card">
                    <span className="preview-card-title">Frontend Engineer</span>
                    <span className="preview-card-sub">Signal Works</span>
                  </div>
                  <div className="preview-card preview-card-muted">
                    <span className="preview-card-title">Interview</span>
                    <span className="preview-card-sub">2 active roles</span>
                  </div>
                </div>

                <div className="preview-panel">
                  <div className="preview-label">{t("analytics")}</div>
                  <div className="preview-mini-chart">
                    <span style={{ height: "56%" }} />
                    <span style={{ height: "86%" }} />
                    <span style={{ height: "42%" }} />
                    <span style={{ height: "72%" }} />
                  </div>
                </div>

                <div className="preview-panel preview-panel-wide">
                  <div className="preview-label">{t("cvAnalyzer")}</div>
                  <div className="preview-scanline" />
                  <div className="preview-copy-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon feature-icon-board">01</div>
            <h3>{t("board")}</h3>
            <p>{t("boardDesc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-analytics">02</div>
            <h3>{t("analytics")}</h3>
            <p>{t("analyticsDesc")}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-ai">03</div>
            <h3>{t("cvAnalyzer")}</h3>
            <p>{t("cvDescShort")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
