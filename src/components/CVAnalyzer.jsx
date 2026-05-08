import { useState, useEffect } from "react";
import { analyzeCV, analyzeMatch } from "../utils/groqClient";

const CV_STORAGE_KEY = "jobtracker_cv_text";
const URL_STORAGE_KEY = "jobtracker_last_url";

// ── Skeleton Components ───────────────────────────────────────────────────
const SkeletonCard = ({ fullWidth = false }) => (
  <div className={`result-card skeleton ${fullWidth ? "full-width" : ""}`}>
    <div className="skeleton-title"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-line short"></div>
    {fullWidth && (
      <>
        <div className="skeleton-line"></div>
        <div className="skeleton-line half"></div>
      </>
    )}
  </div>
);

export default function CVAnalyzer({ t }) {
  const [cvText, setCvText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Load persisted CV text and last URL on mount
  useEffect(() => {
    const savedCv = localStorage.getItem(CV_STORAGE_KEY);
    const savedUrl = localStorage.getItem(URL_STORAGE_KEY);
    if (savedCv) setCvText(savedCv);
    if (savedUrl) setJobUrl(savedUrl);
  }, []);

  // Save CV text to localStorage whenever it changes
  const handleCvChange = (e) => {
    const newText = e.target.value;
    setCvText(newText);
    localStorage.setItem(CV_STORAGE_KEY, newText);
  };

  const clearCv = () => {
    setCvText("");
    localStorage.removeItem(CV_STORAGE_KEY);
    setResult(null);
    setMatchResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeCV(cvText);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(`${t("errorApi")} (${err.message})`);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchCheck = async () => {
    if (!cvText.trim() || !jobUrl.trim()) return;
    setMatchLoading(true);
    setMatchResult(null);
    setError("");
    localStorage.setItem(URL_STORAGE_KEY, jobUrl);
    try {
      const data = await analyzeMatch(cvText, jobUrl);
      setMatchResult(data);
    } catch (err) {
      console.error(err);
      setError(`${t("errorFetchingJob")} (${err.message})`);
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="cv-analyzer-container">
      <div className="analytics-header">
        <h2>{t("cvAnalyzerTitle")}</h2>
        <p>{t("cvDescription")}</p>
        <div className="cv-warning">{t("cvWarning")}</div>
      </div>

      <div className="cv-input-area">
        <textarea
          className="cv-textarea"
          rows={8}
          placeholder={t("cvPlaceholder")}
          value={cvText}
          onChange={handleCvChange}
        />
        <div className="button-group">
          <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
            {loading ? t("analyzing") : t("analyzeButton")}
          </button>
          <button className="btn-clear" onClick={clearCv}>
            {t("clearButton")}
          </button>
        </div>

        {/* Job URL matcher */}
        <div className="job-url-section">
          <label>{t("jobUrlLabel")}</label>
          <div className="url-input-group">
            <input
              type="url"
              className="url-input"
              placeholder={t("jobUrlPlaceholder")}
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
            <button
              className="btn-match"
              onClick={handleMatchCheck}
              disabled={matchLoading || !cvText.trim() || !jobUrl.trim()}
            >
              {matchLoading ? t("fetchingJob") : t("checkMatchButton")}
            </button>
          </div>
        </div>

        {/* AI Disclaimer */}
        <p className="cv-warning">{t("aiDisclaimer")}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* CV Analysis Result with skeleton */}
      {loading ? (
        <div className="cv-result">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard fullWidth />
        </div>
      ) : result && (
        <div className="cv-result">
          <div className="result-card"><h3>{t("skillRating")}</h3><div className="skill-level">{result.skillLevel}</div></div>
          <div className="result-card"><h3>{t("suggestedRoles")}</h3><ul className="roles-list">{result.suggestedRoles.map((role, i) => <li key={i}>{role}</li>)}</ul></div>
          <div className="result-card"><h3>{t("reason")}</h3><ul className="reasons-list">{result.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
          <div className="result-card full-width"><h3>{t("overallAssessment")}</h3><p>{result.overall}</p></div>
        </div>
      )}

      {/* Match Result with skeleton */}
      {matchLoading ? (
        <div className="cv-result match-result">
          <SkeletonCard fullWidth />
        </div>
      ) : matchResult && (
        <div className="cv-result match-result">
          <div className="result-card full-width">
            <h3>{t("matchResultTitle")}</h3>
            <div className="match-score-badge">{matchResult.matchScore}%</div>
            <p>{matchResult.analysis}</p>
          </div>
        </div>
      )}
    </div>
  );
}