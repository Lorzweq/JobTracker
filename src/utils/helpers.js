export const LS_KEY = "jobtracker_v1";
export const LS_LANG_KEY = "jobtracker_lang";
export const LS_THEME_KEY = "jobtracker_theme";

export const load = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
};
export const save = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));

export const STAGES = ["Applied", "Interview", "Offer", "No Response", "Rejected", "Scam"];
export const STAGE_KEYS = ["applied", "interview", "offer", "noresponse", "rejected", "scam"];
export const STAGE_TO_KEY = {
  Applied: "applied",
  Interview: "interview",
  Offer: "offer",
  "No Response": "noresponse",
  Rejected: "rejected",
  Scam: "scam",
};

export const getStageTranslationKey = (stage) => STAGE_TO_KEY[stage] || String(stage || "").toLowerCase();
export const STAGE_COLORS = {
  Applied: "#60a5fa",
  Interview: "#a78bfa",
  Offer: "#34d399",
  "No Response": "#94a3b8",
  Rejected: "#f87171",
  Scam: "#f59e0b",
};
export const STAGE_BG = {
  Applied: "rgba(96,165,250,0.08)",
  Interview: "rgba(167,139,250,0.08)",
  Offer: "rgba(52,211,153,0.08)",
  "No Response": "rgba(148,163,184,0.08)",
  Rejected: "rgba(248,113,113,0.08)",
  Scam: "rgba(245,158,11,0.08)",
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—";

export const emptyJob = () => ({
  id: uid(),
  stage: "Applied",
  company: "",
  role: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  url: "",
  salary: "",
  contact: "",
  location: "",
  notes: "",
});