import { useState, useEffect } from "react";
import { STAGES, getStageTranslationKey } from "../utils/helpers";

export default function JobModal({ job, onSave, onClose, onDelete, t, anchorRect }) {
  const [form, setForm] = useState(job);
  const [position, setPosition] = useState(null);
  const isEditing = Boolean(onDelete);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (anchorRect) {
      const modalWidth = 500;
      let left = anchorRect.left + anchorRect.width / 2 - modalWidth / 2;
      left = Math.max(10, Math.min(left, window.innerWidth - modalWidth - 10));
      setPosition({
        top: anchorRect.bottom + 10,
        left,
      });
    } else {
      setPosition(null);
    }
  }, [anchorRect]);

  const modalStyle = position
    ? { position: "fixed", top: position.top, left: position.left, zIndex: 1050 }
    : {};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={modalStyle}>
        <div className="modal-header">
          <h2>{job.id && form.company ? form.company : t("newApplication")}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-grid">
          <div className="input-group"><label>{t("company")}</label><input value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g., Google" /></div>
          <div className="input-group"><label>{t("role")}</label><input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g., Senior Developer" /></div>
          {isEditing && <div className="input-group"><label>{t("stage")}</label><select value={form.stage} onChange={e => set("stage", e.target.value)}>{STAGES.map(s => <option key={s} value={s}>{t(getStageTranslationKey(s))}</option>)}</select></div>}
          <div className="input-group"><label>{t("dateApplied")}</label><input type="date" value={form.dateApplied} onChange={e => set("dateApplied", e.target.value)} /></div>
          <div className="input-group full-width"><label>{t("jobUrl")}</label><input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." /></div>
          <div className="input-group"><label>{t("salaryRange")}</label><input value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="€60k–€80k" /></div>
          <div className="input-group"><label>{t("contactPerson")}</label><input value={form.contact} onChange={e => set("contact", e.target.value)} placeholder="Recruiter name" /></div>
          <div className="input-group"><label>{t("locationRemote")}</label><input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Helsinki / Remote" /></div>
          <div className="input-group full-width"><label>{t("notes")}</label><textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder={t("notesPlaceholder")} /></div>
        </div>
        <div className="modal-footer">
          {onDelete && <button className="btn-delete" onClick={onDelete}>{t("delete")}</button>}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>{t("cancel")}</button>
            <button className="btn-save" onClick={() => { if (!form.company || !form.role) return; onSave(form); }}>{t("save")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}