const taskColumnIds = [
  "taskColumnPending",
  "taskColumnInProgress",
  "taskColumnInReview",
  "taskColumnBlocked",
  "taskColumnPaused",
  "taskColumnCompleted",
];

const columnStatusKeys = [
  "pending",
  "in-progress",
  "in-review",
  "blocked",
  "paused",
  "done",
];

function taskCardTemplate(card) {
  const {
    id,
    title,
    description,
    assignee,
    dueDate,
    status,
    category = null,
    tags = [],
    comments = [],
  } = card;

  const commentsCount = Array.isArray(comments) ? comments.length : 0;
  const commentsLabel = `${commentsCount} ${commentsCount === 1 ? "comentario" : "comentarios"}`;
  const commentsCountHtml =
    commentsCount > 0
      ? `
            <div class="card-comments-count">
              <i class="fa-solid fa-comment"></i>
              <span>${commentsLabel}</span>
            </div>`
      : "";

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
          <i class="fa-solid fa-calendar-days"></i>
          <span>Fecha límite:</span>
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
          ${optionsTooltipTemplate({ tagsActionLabel })}
        </div>
      </div>

      <p class="card-desc">${description}</p>

      <div class="card-footer">
        ${assigneeHtml}
        ${unassignSlotHtml}
        ${dueDateHtml}
        ${dueDateSlotHtml}
        ${tagsRowTemplate(tags)}
        <div class="card-meta-row">
          ${statusChipTemplate({ status, label: statusLabels[status] })}
          <div class="card-meta-right">
            ${commentsCountHtml}
            ${taskCategorySlotTemplate(category)}
          </div>
        </div>
        </div>
        </div>
        `;
  // ${commentsCountTemplate(comments)}
}

function renderTaskCards() {
  const mounts = taskColumnIds.map((id) => document.getElementById(id));
  if (!mounts.every(Boolean)) return false;

  mounts.forEach((mount, index) => {
    const tasks = taskManager.getTasksWithStatus(columnStatusKeys[index]);
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

taskManager.subscribe(renderTaskCards);

const assigneePicker = document.createElement("div");
assigneePicker.className = "assignee-picker";
assigneePicker.hidden = true;
assigneePicker.innerHTML = `
  <button type="button" class="assignee-picker__item assignee-picker__item--clear" data-user-index="-1">
    <span class="assignee-picker__clear-avatar"></span>
    <span>Sin asignar</span>
  </button>
  <div class="assignee-picker__divider" role="separator"></div>
  ${team
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

const statusPicker = document.createElement("div");
statusPicker.className = "status-picker";
statusPicker.hidden = true;
statusPicker.innerHTML = columnStatusKeys
  .map(
    (statusKey) => `
    <button type="button" class="status-picker__item" data-status="${statusKey}">
      ${statusChipTemplate({ status: statusKey, label: statusLabels[statusKey] })}
    </button>`
  )
  .join("");
document.body.appendChild(statusPicker);

const categoryPicker = document.createElement("div");
categoryPicker.className = "category-picker";
categoryPicker.hidden = true;
categoryPicker.innerHTML = `
  <button type="button" class="category-picker__item" data-category="">
    <span class="category-avatar category-avatar--empty"><i class="fa-solid fa-plus"></i></span>
    <span>Sin categoría</span>
  </button>
  ${Object.entries(taskCategories)
    .map(
      ([categoryKey, category]) => `
    <button type="button" class="category-picker__item" data-category="${categoryKey}">
      ${taskCategoryAvatarTemplate(categoryKey)}
      <span>${category.label}</span>
      <span class="category-picker__tooltip">${category.description}</span>
    </button>`
    )
    .join("")}
`;
document.body.appendChild(categoryPicker);

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

["mousedown", "touchstart"].forEach((eventName) => {
  clearDateBtn.addEventListener(eventName, (event) => {
    event.stopPropagation();
  });
});

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
let activeStatusTaskId = null;
let activeCategoryTaskId = null;
let activeAssigneeAnchor = null;
let activeDueDateAnchor = null;
let activeStatusAnchor = null;
let activeCategoryAnchor = null;

function positionPopup(popup, anchor) {
  const rect = anchor.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;
}

const POPUP_GAP = 6;

function positionCategoryPicker(popup, anchor) {
  const rect = anchor.getBoundingClientRect();
  const popupHeight = popup.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const openAbove = spaceBelow < popupHeight + POPUP_GAP && spaceAbove >= spaceBelow;

  if (openAbove) {
    popup.style.top = `${rect.top + window.scrollY - popupHeight - POPUP_GAP}px`;
  } else {
    popup.style.top = `${rect.bottom + window.scrollY + POPUP_GAP}px`;
  }
  popup.style.left = `${rect.left + window.scrollX}px`;
}

function repositionActivePopups() {
  if (!assigneePicker.hidden && activeAssigneeAnchor) {
    positionPopup(assigneePicker, activeAssigneeAnchor);
  }
  if (!dueDateWrapper.hidden && activeDueDateAnchor) {
    positionPopup(dueDateWrapper, activeDueDateAnchor);
  }
  if (!statusPicker.hidden && activeStatusAnchor) {
    positionPopup(statusPicker, activeStatusAnchor);
  }
  if (!categoryPicker.hidden && activeCategoryAnchor) {
    positionCategoryPicker(categoryPicker, activeCategoryAnchor);
  }
}

window.addEventListener("scroll", repositionActivePopups, true);
window.addEventListener("resize", repositionActivePopups);

function closeAllPopups() {
  document.querySelectorAll(".options-tooltip").forEach((tooltip) => {
    tooltip.hidden = true;
    const btn = tooltip.parentElement.querySelector(".options-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });

  assigneePicker.hidden = true;
  activeAssigneeTaskId = null;
  activeAssigneeAnchor = null;

  $(dueDateInput).datepicker("hide");
  dueDateWrapper.hidden = true;
  activeDueDateTaskId = null;
  activeDueDateAnchor = null;

  statusPicker.hidden = true;
  activeStatusTaskId = null;
  activeStatusAnchor = null;

  categoryPicker.hidden = true;
  activeCategoryTaskId = null;
  activeCategoryAnchor = null;
}

function openAssigneePicker(anchor, task) {
  positionPopup(assigneePicker, anchor);
  assigneePicker.hidden = false;
  activeAssigneeTaskId = task.id;
  activeAssigneeAnchor = anchor;
}

function openStatusPicker(anchor, task) {
  positionPopup(statusPicker, anchor);
  statusPicker.hidden = false;
  activeStatusTaskId = task.id;
  activeStatusAnchor = anchor;
}

function openCategoryPicker(anchor, task) {
  categoryPicker.hidden = false;
  positionCategoryPicker(categoryPicker, anchor);
  activeCategoryTaskId = task.id;
  activeCategoryAnchor = anchor;
}

function openDueDatepicker(anchor, task) {
  positionPopup(dueDateWrapper, anchor);
  dueDateWrapper.hidden = false;
  activeDueDateTaskId = task.id;
  activeDueDateAnchor = anchor;
  clearDateBtn.hidden = !task.dueDate;
  $(dueDateInput).val(task.dueDate || "").datepicker("update");
  $(dueDateInput).datepicker("show");
}

$(dueDateInput).on("changeDate", (event) => {
  const task = taskManager.getTaskById(activeDueDateTaskId);
  if (task) {
    taskManager.updateTask(task.id, { ...task, dueDate: event.format() });
  }
  closeAllPopups();
});

clearDateBtn.addEventListener("click", () => {
  const task = taskManager.getTaskById(activeDueDateTaskId);
  if (task) {
    taskManager.updateTask(task.id, { ...task, dueDate: null });
  }
  closeAllPopups();
});

document.addEventListener("click", (event) => {
  const dueDateTarget = event.target.closest(".due-date-slot, .due-date");
  if (dueDateTarget) {
    const card = dueDateTarget.closest(".task-card");
    const task = taskManager.getTaskById(card?.dataset.taskId);
    if (!task) return;
    const wasOpen = !dueDateWrapper.hidden && activeDueDateTaskId === task.id;
    closeAllPopups();
    if (!wasOpen) openDueDatepicker(dueDateTarget, task);
    return;
  }

  const assigneeTarget = event.target.closest(".unassign-slot, .avatar-group");
  if (assigneeTarget) {
    const card = assigneeTarget.closest(".task-card");
    const task = taskManager.getTaskById(card?.dataset.taskId);
    if (!task) return;
    const wasOpen = !assigneePicker.hidden && activeAssigneeTaskId === task.id;
    closeAllPopups();
    if (!wasOpen) openAssigneePicker(assigneeTarget, task);
    return;
  }

  const pickerItem = event.target.closest(".assignee-picker__item");
  if (pickerItem) {
    const task = taskManager.getTaskById(activeAssigneeTaskId);
    if (task) {
      const userIndex = Number(pickerItem.dataset.userIndex);
      const assignee = userIndex >= 0 ? team[userIndex] || null : null;
      taskManager.updateTask(task.id, { ...task, assignee });
    }
    closeAllPopups();
    return;
  }

  const statusTarget = event.target.closest(".status-badge");
  if (statusTarget && !event.target.closest(".status-picker")) {
    const card = statusTarget.closest(".task-card");
    const task = taskManager.getTaskById(card?.dataset.taskId);
    if (!task) return;
    const wasOpen = !statusPicker.hidden && activeStatusTaskId === task.id;
    closeAllPopups();
    if (!wasOpen) openStatusPicker(statusTarget, task);
    return;
  }

  const statusItem = event.target.closest(".status-picker__item");
  if (statusItem) {
    const task = taskManager.getTaskById(activeStatusTaskId);
    if (task) {
      const newStatus = statusItem.dataset.status;
      if (newStatus && newStatus !== task.status) {
        taskManager.updateTask(task.id, { ...task, status: newStatus });
      }
    }
    closeAllPopups();
    return;
  }

  const categoryItem = event.target.closest(".category-picker__item");
  if (categoryItem) {
    const task = taskManager.getTaskById(activeCategoryTaskId);
    if (task) {
      const newCategory = categoryItem.dataset.category || null;
      if (newCategory !== (task.category || null)) {
        taskManager.updateTask(task.id, { ...task, category: newCategory });
      }
    }
    closeAllPopups();
    return;
  }

  const categoryTarget = event.target.closest(".category-avatar");
  if (categoryTarget && !event.target.closest(".category-picker")) {
    const card = categoryTarget.closest(".task-card");
    const task = taskManager.getTaskById(card?.dataset.taskId);
    if (!task) return;
    const wasOpen = !categoryPicker.hidden && activeCategoryTaskId === task.id;
    closeAllPopups();
    if (!wasOpen) openCategoryPicker(categoryTarget, task);
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
      const task = taskManager.getTaskById(card?.dataset.taskId);
      if (task && typeof window.openEditTaskModal === "function") {
        window.openEditTaskModal(task);
      }
    } else if (action === "tags") {
      const task = taskManager.getTaskById(card?.dataset.taskId);
      const hasTags = task && Array.isArray(task.tags) && task.tags.length > 0;
      console.log(hasTags ? "Editar etiquetas:" : "Agregar etiquetas:", title);
    } else if (action === "delete") {
      const task = taskManager.getTaskById(card?.dataset.taskId);
      if (task) {
        taskManager.deleteTask(task.id);
      }
    }

    closeAllPopups();
    return;
  }

  const cardTarget = event.target.closest(".task-card");
  if (cardTarget) {
    const task = taskManager.getTaskById(cardTarget.dataset.taskId);
    if (task) {
      closeAllPopups();
      if (typeof window.openEditTaskModal === "function") {
        window.openEditTaskModal(task);
      }
    }
    return;
  }

  if (
    !event.target.closest(".assignee-picker") &&
    !event.target.closest(".due-date-picker") &&
    !event.target.closest(".status-picker") &&
    !event.target.closest(".category-picker") &&
    !event.target.closest(".options-tooltip")
  ) {
    closeAllPopups();
  }
});
