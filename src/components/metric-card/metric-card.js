const metrics = [
  { icon: "ri-line-chart-line", title: "To Do", value: 4 },
  { icon: "ri-line-chart-line", title: "En Progreso", value: 2 },
  { icon: "ri-line-chart-line", title: "Completado", value: 7 },
];

function metricCardTemplate({ icon, title, value }) {
  return `
    <div class="metric-card">
      <div class="metric-info">
        <i class="${icon} metric-icon"></i>
        <span class="metric-title">${title}</span>
      </div>
      <div class="metric-value">${value}</div>
    </div>
  `;
}

function renderMetricCards() {
  const mount = document.getElementById("metricCards");
  if (!mount) return false;

  mount.innerHTML = metrics.map(metricCardTemplate).join("");
  return true;
}

if (!renderMetricCards()) {
  const observer = new MutationObserver(() => {
    if (renderMetricCards()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
