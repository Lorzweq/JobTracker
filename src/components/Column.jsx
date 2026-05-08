import JobCard from "./JobCard";
import { STAGE_COLORS, STAGE_BG } from "../utils/helpers";

export default function Column({ stage, jobs, onEdit, onDrop, dragOverStage, setDragOverStage, draggingId, setDraggingId, t, onTouchDrop }) {
  const isOver = dragOverStage === stage;
  const stageKey = stage === "No Response" ? "noresponse" : stage === "Scam" ? "scam" : stage.toLowerCase();
  
  const handleTouchMove = (clientX, clientY, jobId) => {
    // Find which column is under the current touch point
    const element = document.elementFromPoint(clientX, clientY);
    const columnElement = element?.closest(".column");
    
    if (columnElement) {
      // Find the stage from the column
      const stageText = columnElement.querySelector(".col-title")?.textContent;
      const allStages = ["Applied", "Interview", "Offer", "Rejected", "No Response", "Scam"];
          const targetStage = allStages.find(s => t(s === "No Response" ? "noresponse" : s === "Scam" ? "scam" : s.toLowerCase()) === stageText);
      
      if (targetStage) {
        setDragOverStage(targetStage);
      }
    }
  };

  const handleTouchEnd = (e, draggedJobId) => {
    // Find which column is currently under the touch point
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const columnElement = element?.closest(".column");
    
    if (columnElement) {
      // Find the stage from the column
      const stageText = columnElement.querySelector(".col-title")?.textContent;
      const allStages = ["Applied", "Interview", "Offer", "Rejected", "No Response", "Scam"];
          const targetStage = allStages.find(s => t(s === "No Response" ? "noresponse" : s === "Scam" ? "scam" : s.toLowerCase()) === stageText);
      
      if (targetStage) {
        onDrop(draggedJobId, targetStage);
      }
    }
    
    setDragOverStage(null);
    setDraggingId(null);
  };

  return (
    <div
      className={`column ${isOver ? "column-over" : ""}`}
      style={{
        "--col-color": STAGE_COLORS[stage],
        background: isOver ? STAGE_BG[stage] : undefined
      }}
      onDragOver={e => { e.preventDefault(); setDragOverStage(stage); }}
      onDragLeave={() => setDragOverStage(null)}
      onDrop={e => {
        e.preventDefault();
        const id = e.dataTransfer.getData("jobId");
        onDrop(id, stage);
        setDragOverStage(null);
      }}
    >
      <div className="col-header">
        <span className="col-dot" style={{ background: STAGE_COLORS[stage] }} />
        <span className="col-title">{t(stageKey)}</span>
        <span className="col-count">{jobs.length}</span>
      </div>
      <div className={`col-body ${isOver ? "col-body-over" : ""}`}>
        {jobs.map(j => (
          <JobCard
            key={j.id}
            job={j}
            onEdit={onEdit}
            onDragStart={() => {}}
            onDragEnd={() => {}}
            isDragging={draggingId === j.id}
            t={t}
            onTouchStart={(jobId) => {
              setDraggingId(jobId);
            }}
            onTouchMove={(clientX, clientY, jobId) => {
              handleTouchMove(clientX, clientY, jobId);
            }}
            onTouchEnd={(e, jobId) => {
              handleTouchEnd(e, jobId);
            }}
          />
        ))}
        {jobs.length === 0 && (
          isOver
            ? <div className="drop-indicator">{t("dropHere")}</div>
            : <div className="col-empty">{t("dropHere")}</div>
        )}
      </div>
    </div>
  );
}