const users = [
  {
    name: "Argie Rincón",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "María Gómez",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Carlos Pérez",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

const baseTask = {
  title:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  assignee: null,
  dueDate: null,
  status: { status: "in-progress", label: "En Progreso" },
  tags: [
    { label: "Marketing", color: "purple" },
    { label: "Optimization", color: "purple" },
  ],
  comments: 2,
};

let taskCounter = 0;

function createTask(overrides = {}) {
  taskCounter += 1;
  return {
    ...baseTask,
    id: `task-${taskCounter}`,
    ...overrides,
  };
}

const taskColumnIds = [
  "taskColumnPending",
  "taskColumnInProgress",
  "taskColumnBlocked",
  "taskColumnPaused",
  "taskColumnCompleted",
];

const taskColumns = [
  [
    createTask({ assignee: users[0], dueDate: "12/10/2026" }),
    createTask({ tags: [] }),
  ],
  [createTask(), createTask(), createTask()],
  [createTask()],
  [createTask(), createTask()],
  [createTask(), createTask(), createTask(), createTask()],
];

function findTask(taskId) {
  for (const column of taskColumns) {
    const task = column.find((item) => item.id === taskId);
    if (task) return task;
  }
  return null;
}

function taskCardTemplate(card) {
  const {
    id,
    title,
    description,
    assignee,
    dueDate,
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

  const unassignSlotHtml = !assignee
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

  const dueDateSlotHtml = !dueDate
    ? `
        <div class="due-date-slot">
          <i class="ri-calendar-event-line"></i>
          <span>Sin fecha límite</span>
        </div>`
    : "";

  const tagsActionLabel =
    Array.isArray(tags) && tags.length > 0 ? "Editar etiquetas" : "Agregar etiquetas";

  return `
    <div class="task-card" data-task-id="${id}">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        <div class="card-options">
          <button type="button" class="options-btn" aria-label="Opciones" aria-haspopup="true" aria-expanded="false">
            <i class="ri-more-2-fill"></i>
          </button>
          <div class="options-tooltip" hidden>
            <button type="button" class="tooltip-action" data-action="edit">
              <i class="ri-edit-box-line"></i>
              <span>Editar</span>
            </button>
            <button type="button" class="tooltip-action" data-action="tags">
              <i class="ri-price-tag-line"></i>
              <span>${tagsActionLabel}</span>
            </button>
            <button type="button" class="tooltip-action tooltip-action--danger" data-action="delete">
              <i class="ri-delete-bin-line"></i>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
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

const assigneePicker = document.createElement("div");
assigneePicker.className = "assignee-picker";
assigneePicker.hidden = true;
assigneePicker.innerHTML = `
  <button type="button" class="assignee-picker__item assignee-picker__item--clear" data-user-index="-1">
    <span class="assignee-picker__clear-avatar"></span>
    <span>Sin asignar</span>
  </button>
  <div class="assignee-picker__divider" role="separator"></div>
  ${users
    .map(
      (user, index) => `
      <button type="button" class="assignee-picker__item" data-user-index="${index}">
        <img src="${user.src}" alt="${user.name}" />
        <span>${user.name}</span>
      </button>`
    )
    .join("")}
`;
document.body.appendChild(assigneePicker);

const dueDateWrapper = document.createElement("div");
dueDateWrapper.className = "due-date-picker";
dueDateWrapper.hidden = true;

const dueDateInput = document.createElement("input");
dueDateInput.type = "text";
dueDateInput.className = "due-date-input";
dueDateInput.placeholder = "dd/mm/aaaa";
dueDateWrapper.appendChild(dueDateInput);

const clearDateBtn = document.createElement("button");
clearDateBtn.type = "button";
clearDateBtn.className = "clear-date-btn";
clearDateBtn.textContent = "Quitar fecha";
dueDateWrapper.appendChild(clearDateBtn);

document.body.appendChild(dueDateWrapper);

$(dueDateInput).datepicker({
  format: "dd/mm/yyyy",
  language: "es",
  autoclose: true,
  todayHighlight: true,
  container: dueDateWrapper,
});

let activeAssigneeTaskId = null;
let activeDueDateTaskId = null;

function positionPopup(popup, anchor) {
  const rect = anchor.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;
}

function closeAllPopups() {
  document.querySelectorAll(".options-tooltip").forEach((tooltip) => {
    tooltip.hidden = true;
    const btn = tooltip.parentElement.querySelector(".options-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });

  assigneePicker.hidden = true;
  activeAssigneeTaskId = null;

  $(dueDateInput).datepicker("hide");
  dueDateWrapper.hidden = true;
  activeDueDateTaskId = null;
}

function openAssigneePicker(anchor, task) {
  positionPopup(assigneePicker, anchor);
  assigneePicker.hidden = false;
  activeAssigneeTaskId = task.id;
}

function openDueDatepicker(anchor, task) {
  positionPopup(dueDateWrapper, anchor);
  dueDateWrapper.hidden = false;
  activeDueDateTaskId = task.id;
  clearDateBtn.hidden = !task.dueDate;
  $(dueDateInput).val(task.dueDate || "").datepicker("update");
  $(dueDateInput).datepicker("show");
}

function refreshTaskCard(task) {
  const cardEl = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
  if (cardEl) cardEl.outerHTML = taskCardTemplate(task);
}

$(dueDateInput).on("changeDate", (event) => {
  const task = findTask(activeDueDateTaskId);
  if (task) {
    task.dueDate = event.format();
    refreshTaskCard(task);
  }
  closeAllPopups();
});

clearDateBtn.addEventListener("click", () => {
  const task = findTask(activeDueDateTaskId);
  if (task) {
    task.dueDate = null;
    refreshTaskCard(task);
  }
  closeAllPopups();
});

document.addEventListener("click", (event) => {
  const dueDateTarget = event.target.closest(".due-date-slot, .due-date");
  if (dueDateTarget) {
    const card = dueDateTarget.closest(".task-card");
    const task = findTask(card?.dataset.taskId);
    if (!task) return;
    const wasOpen = !dueDateWrapper.hidden && activeDueDateTaskId === task.id;
    closeAllPopups();
    if (!wasOpen) openDueDatepicker(dueDateTarget, task);
    return;
  }

  const assigneeTarget = event.target.closest(".unassign-slot, .avatar-group");
  if (assigneeTarget) {
    const card = assigneeTarget.closest(".task-card");
    const task = findTask(card?.dataset.taskId);
    if (!task) return;
    const wasOpen = !assigneePicker.hidden && activeAssigneeTaskId === task.id;
    closeAllPopups();
    if (!wasOpen) openAssigneePicker(assigneeTarget, task);
    return;
  }

  const pickerItem = event.target.closest(".assignee-picker__item");
  if (pickerItem) {
    const task = findTask(activeAssigneeTaskId);
    if (task) {
      const userIndex = Number(pickerItem.dataset.userIndex);
      task.assignee = userIndex >= 0 ? users[userIndex] || null : null;
      refreshTaskCard(task);
    }
    closeAllPopups();
    return;
  }

  const optionsBtn = event.target.closest(".options-btn");
  if (optionsBtn) {
    const tooltip = optionsBtn.parentElement.querySelector(".options-tooltip");
    if (!tooltip) return;

    const willOpen = tooltip.hidden;
    closeAllPopups();
    tooltip.hidden = !willOpen;
    optionsBtn.setAttribute("aria-expanded", String(willOpen));
    return;
  }

  const tooltipAction = event.target.closest(".tooltip-action");
  if (tooltipAction) {
    const action = tooltipAction.dataset.action;
    const card = tooltipAction.closest(".task-card");
    const title = card?.querySelector(".card-title")?.textContent?.trim();

    if (action === "edit") {
      console.log("Editar tarea:", title);
    } else if (action === "tags") {
      const task = findTask(card?.dataset.taskId);
      const hasTags = task && Array.isArray(task.tags) && task.tags.length > 0;
      console.log(hasTags ? "Editar etiquetas:" : "Agregar etiquetas:", title);
    } else if (action === "delete") {
      console.log("Eliminar tarea:", title);
    }

    closeAllPopups();
    return;
  }

  if (
    !event.target.closest(".assignee-picker") &&
    !event.target.closest(".due-date-picker") &&
    !event.target.closest(".options-tooltip")
  ) {
    closeAllPopups();
  }
});
