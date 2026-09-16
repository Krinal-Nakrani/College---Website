export default function StatCard({
  variant = "blue",
  icon = "📊",
  value = 0,
  label = "",
}) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}
