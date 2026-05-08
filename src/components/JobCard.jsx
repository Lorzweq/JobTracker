import { fmt, STAGE_COLORS } from "../utils/helpers";
import { useState, useRef } from "react";

export default function JobCard({ job, onEdit, onDragStart, onDragEnd, isDragging, t, onTouchStart, onTouchMove, onTouchEnd }) {
  const [touchActive, setTouchActive] = useState(false);
  const touchStartTimeRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartTimeRef.current = Date.now();
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setTouchActive(true);
    onTouchStart && onTouchStart(job.id);
  };

  const handleTouchMove = (e) => {
    if (!touchActive) return;
    const touch = e.touches[0];
    onTouchMove && onTouchMove(touch.clientX, touch.clientY, job.id);
  };

  const handleTouchEnd = (e) => {
    if (!touchActive) return;
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTimeRef.current;
    const touchDistance = Math.sqrt(
      Math.pow(e.changedTouches[0].clientX - touchStartXRef.current, 2) +
      Math.pow(e.changedTouches[0].clientY - touchStartYRef.current, 2)
    );

    // If it's a quick tap without much movement, treat it as a click
    if (touchDuration < 500 && touchDistance < 10) {
      onEdit(job);
    } else {
      // It's a drag, handle the drop
      onTouchEnd && onTouchEnd(e, job.id);
    }
    setTouchActive(false);
  };

  return (
    <div 
      className={`card ${isDragging ? "card-dragging" : ""}`} 
      draggable 
      onDragStart={e => { e.dataTransfer.setData("jobId", job.id); onDragStart(job.id); }} 
      onDragEnd={onDragEnd} 
      onClick={(e) => {
        if (!isDragging) onEdit(job);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ borderLeftColor: STAGE_COLORS[job.stage], touchAction: "none" }}
    >
      <div className="card-top">
        <span className="card-company">{job.company}</span>
        <span className="card-stage">{t ? t(job.stage === "No Response" ? "noresponse" : job.stage.toLowerCase()) : job.stage}</span>
        {job.url && <a href={job.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="card-link">↗</a>}
      </div>
      <div className="card-role">{job.role}</div>
      <div className="card-meta">
        {job.location && <span>{job.location}</span>}
        {job.salary && <span>{job.salary}</span>}
      </div>
      <div className="card-date">{fmt(job.dateApplied)}</div>
    </div>
  );
}