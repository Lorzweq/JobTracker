import { useEffect, useState } from "react";
import { STAGE_COLORS } from "../utils/helpers";

export default function FlyingCard({ startX, startY, endX, endY, job, onFinish, t }) {
  const [pos, setPos] = useState({ x: startX, y: startY, scale: 0.7, opacity: 1 });

  useEffect(() => {
    const startTime = performance.now();
    const duration = 450;

    function animate(now) {
      const elapsed = now - startTime;
      let progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setPos({
        x: startX + (endX - startX) * ease,
        y: startY + (endY - startY) * ease,
        scale: 0.7 * (1 - ease) + 0.2 * ease,
        opacity: 1 - ease * 0.8,
      });

      if (progress < 1) requestAnimationFrame(animate);
      else onFinish(job);
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <div
      className="flying-card"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${pos.scale})`,
        opacity: pos.opacity,
      }}
    >
      <div className="card" style={{ borderLeftColor: STAGE_COLORS[job.stage] }}>
        <div className="card-top">
          <span className="card-company">{job.company}</span>
          <span className="card-stage">{t ? t(job.stage.toLowerCase().replace(" ", "")) : job.stage}</span>
        </div>
        <div className="card-role">{job.role}</div>
        {job.location && <div className="card-meta">{job.location}</div>}
      </div>
    </div>
  );
}