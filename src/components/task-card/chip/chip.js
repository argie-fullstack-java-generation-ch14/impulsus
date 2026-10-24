const chipStatusClasses = {
  pending: "status-pending",
  "in-progress": "status-in-progress",
  paused: "status-paused",
  blocked: "status-blocked",
  done: "status-done",
};

const statusLabels = {
  pending: "Pendiente",
  "in-progress": "En progreso",
  blocked: "Bloqueado",
  paused: "En pausa",
  done: "Completada",
};

function statusChipTemplate({ status = "in-progress", label }) {
  const statusClass = chipStatusClasses[status] || chipStatusClasses["in-progress"];
  return `
    <div class="status-badge ${statusClass}">
      <span class="status-dot"></span>
      <span class="status-text">${label}</span>
    </div>
  `;
}

function tagChipTemplate({ label, color = "purple" }) {
  return `<span class="tag tag-${color}">${label}</span>`;
}

function tagsRowTemplate(tags = []) {
  return `<div class="tags-row">${tags.map(tagChipTemplate).join("")}</div>`;
}
