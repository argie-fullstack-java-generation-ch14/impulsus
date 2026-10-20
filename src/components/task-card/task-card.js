const taskCardData = {
  title:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  assignee: {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    name: "Argie Rincón",
  },
  showUnassignSlot: true,
  dueDate: "12/10/2026",
  showDueDateSlot: true,
  status: { status: "in-progress", label: "En Progreso" },
  tags: [
    { label: "Marketing", color: "purple" },
    { label: "Optimization", color: "purple" },
  ],
  comments: 2,
};

const standardTaskCard = { ...taskCardData, showDueDateSlot: false };

const taskColumnIds = [
  "taskColumnPending",
  "taskColumnInProgress",
  "taskColumnBlocked",
  "taskColumnPaused",
  "taskColumnCompleted",
];

const taskColumns = [
  [taskCardData, standardTaskCard],
  [standardTaskCard, standardTaskCard, standardTaskCard],
  [standardTaskCard],
  [standardTaskCard, standardTaskCard],
  [standardTaskCard, standardTaskCard, standardTaskCard, standardTaskCard],
];

function taskCardTemplate(card) {
  const {
    title,
    description,
    assignee,
    showUnassignSlot,
    dueDate,
    showDueDateSlot,
    status,
    tags,
    comments,
  } = card;

  const assigneeHtml = assignee
    ? `
        <div class="avatar-group">
          <img src="${assignee.src}" alt="${assignee.name}" />
          <span class="assignee-name">${assignee.name}</span>
        </div>`
    : "";

  const unassignSlotHtml = showUnassignSlot
    ? `
        <div class="unassign-slot">
          <div class="unassign-slot-avatar"></div>
          <span class="unassign-slot-text">Sin asignar</span>
        </div>`
    : "";

  const dueDateHtml = dueDate
    ? `
        <div class="due-date">
          <i class="ri-calendar-event-line"></i>
          <span>Fecha líminte:</span>
          <span>${dueDate}</span>
        </div>`
    : "";

  const dueDateSlotHtml = showDueDateSlot
    ? `
        <div class="due-date-slot">
          <i class="ri-calendar-event-line"></i>
          <span>Sin fecha límite</span>
        </div>`
    : "";

  return `
    <div class="task-card">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        <button class="options-btn" aria-label="Editar">
          <i class="ri-edit-box-line"></i>
        </button>
      </div>

      <p class="card-desc">${description}</p>

      <div class="card-footer">
        ${assigneeHtml}
        ${unassignSlotHtml}
        ${dueDateHtml}
        ${dueDateSlotHtml}
        ${statusChipTemplate(status)}
        ${tagsRowTemplate(tags)}
        <div class="comments-count">
          <i class="ri-chat-3-line comment-icon"></i>
          <span>${comments} Comments</span>
        </div>
      </div>
    </div>
  `;
}

function renderTaskCards() {
  const mounts = taskColumnIds.map((id) => document.getElementById(id));
  if (!mounts.every(Boolean)) return false;

  mounts.forEach((mount, index) => {
    const tasks = taskColumns[index] || [];
    mount.innerHTML = tasks.map(taskCardTemplate).join("");
  });
  return true;
}

if (!renderTaskCards()) {
  const observer = new MutationObserver(() => {
    if (renderTaskCards()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".due-date-slot")) {
    console.log("Asignar fecha límite");
  }
});
