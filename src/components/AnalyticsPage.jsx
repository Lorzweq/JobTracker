import SankeyDiagram from "./SankeyDiagram";

export default function AnalyticsPage({ jobs, t }) {
  return (
    <section className="analytics-page">
      <div className="analytics">
        <div className="analytics-header">
          <h2>{t("applicationFlow")}</h2>
          <p>{jobs.length} {t("totalApplications")}</p>
        </div>
        <SankeyDiagram jobs={jobs} t={t} />
      </div>
    </section>
  );
}
