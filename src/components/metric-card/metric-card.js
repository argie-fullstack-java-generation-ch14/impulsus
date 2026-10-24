function getMetricsData() {
  const pendingCount =
    typeof taskManager !== "undefined"
      ? taskManager.getTasksWithStatus("pending").length
      : 0;

  const inProgressCount =
    typeof taskManager !== "undefined"
      ? taskManager.getTasksWithStatus("in-progress").length
      : 0;

  const completedCount =
    typeof taskManager !== "undefined"
      ? taskManager.getTasksWithStatus("done").length
      : 0;

  return [
    { icon: "fa-solid fa-chart-line", title: "To Do", value: pendingCount },
    { icon: "fa-solid fa-chart-line", title: "En Progreso", value: inProgressCount },
    { icon: "fa-solid fa-chart-line", title: "Completado", value: completedCount },
  ];
}

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

  const metrics = getMetricsData();
  mount.innerHTML = metrics.map(metricCardTemplate).join("");
  return true;
}

if (!renderMetricCards()) {
  const observer = new MutationObserver(() => {
    if (renderMetricCards()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (typeof taskManager !== "undefined") {
  taskManager.subscribe(renderMetricCards);
}
