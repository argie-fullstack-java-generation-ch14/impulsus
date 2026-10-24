(() => {
  let editingTaskId = null;
  const defaultStatus = "pending";
  const assigneePlaceholderHtml = `
    <span class="assignee-select__placeholder">
      <i class="bi bi-person"></i>
      <span>Selecciona una persona</span>
    </span>
  `;

  const getModalEl = () => document.getElementById("taskFormModal");
  let modalTrigger = null;
  const { validateTaskForm, clearFieldError, clearModalErrors } = window.TaskFormValidation;

  function setStatus(statusKey) {
    const modalEl = getModalEl();
    if (!modalEl) return;

    const item = modalEl.querySelector(`.dropdown-item[data-status="${statusKey}"]`);
    const toggle = modalEl.querySelector("#taskStatusToggle");
    if (!item || !toggle) return;

    toggle.textContent = item.textContent.trim();
    toggle.dataset.status = statusKey;
    clearFieldError(toggle);
  }

  function setAssignee(userIndex) {
    const modalEl = getModalEl();
    const toggle = modalEl?.querySelector("#assigneeToggle");
    if (!toggle) return;

    const index = Number(userIndex);
    const user = typeof team !== "undefined" ? team[index] : null;

    if (user) {
      toggle.innerHTML = `
        <span class="assignee-select__value">
          <img src="${user.src}" alt="">
          <span>${user.name}</span>
        </span>
      `;
      toggle.dataset.userIndex = String(index);
      clearFieldError(toggle, modalEl.querySelector(".assignee-select"));
    } else {
      toggle.innerHTML = assigneePlaceholderHtml;
      delete toggle.dataset.userIndex;
    }
  }

  function buildAssigneeMenu() {
    const modalEl = getModalEl();
    const menu = modalEl?.querySelector("#assigneeMenu");
    if (!menu || typeof team === "undefined") return;

    menu.innerHTML = `
      <li>
        <button type="button" class="assignee-picker__item assignee-picker__item--clear" data-user-index="-1">
          <span class="assignee-picker__clear-avatar"></span>
          <span>Sin asignar</span>
        </button>
      </li>
      <li><div class="assignee-picker__divider" role="separator"></div></li>
      ${team
        .map(
          (user, index) => `
        <li>
          <button type="button" class="assignee-picker__item" data-user-index="${index}">
            <img src="${user.src}" alt="${user.name}">
            <span>${user.name}</span>
          </button>
        </li>`
        )
        .join("")}
    `;
  }

  function openEditTaskModal(task) {
    const modalEl = getModalEl();
    if (!modalEl || !task) return;

    modalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    editingTaskId = task.id;

    const modalTitle = modalEl.querySelector("#taskFormModalLabel");
    if (modalTitle) modalTitle.textContent = "Editar tarea";

    const submitBtn = modalEl.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.textContent = "Guardar";

    const nameInput = modalEl.querySelector("#taskName");
    if (nameInput) nameInput.value = task.title || "";

    const descInput = modalEl.querySelector("#taskDescription");
    if (descInput) descInput.value = task.description || "";

    setStatus(task.status || defaultStatus);

    let userIndex = -1;
    if (task.assignee && typeof team !== "undefined") {
      userIndex = team.findIndex(
        (u) => u.name === task.assignee.name || u.src === task.assignee.src
      );
    }
    setAssignee(userIndex);

    const dueDateInput = modalEl.querySelector("#dueDate");
    if (dueDateInput) {
      dueDateInput.value = task.dueDate || "";
      if (window.jQuery && jQuery.fn.datepicker) {
        jQuery(dueDateInput).datepicker("update", task.dueDate || "");
      }
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  window.openEditTaskModal = openEditTaskModal;

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".add-task-btn, .add-task-header-btn");
    if (!addBtn) return;

    const modalEl = getModalEl();
    if (!modalEl) return;

    modalTrigger = addBtn;
    editingTaskId = null;

    const modalTitle = modalEl.querySelector("#taskFormModalLabel");
    if (modalTitle) modalTitle.textContent = "Crear tarea";

    const submitBtn = modalEl.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.textContent = "Crear";

    const column = addBtn.closest(".column-container");
    setStatus(column?.dataset.status || defaultStatus);

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });

  const bindModalEvents = () => {
    const modalEl = getModalEl();
    if (!modalEl || modalEl.dataset.eventsBound === "true") return false;

    modalEl.dataset.eventsBound = "true";

    modalEl.querySelectorAll(".dropdown-item[data-status]").forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        setStatus(item.dataset.status);
      });
    });

    // paso 1 - task 3
    const form = modalEl.querySelector("#createTaskForm");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = modalEl.querySelector("#taskName")?.value.trim() || "";
      const description = modalEl.querySelector("#taskDescription")?.value.trim() || "";
      const status = modalEl.querySelector("#taskStatusToggle")?.dataset.status || defaultStatus;
      const dueDate = modalEl.querySelector("#dueDate")?.value || null;

      const assigneeIndex = Number(modalEl.querySelector("#assigneeToggle")?.dataset.userIndex);
      const assignee = typeof team !== "undefined" && assigneeIndex >= 0 ? team[assigneeIndex] : null;

      if (!validateTaskForm(title, description, assignee, dueDate, status)) {
        form?.reportValidity();
        return;
      }

      if (editingTaskId) {
        const existingTask = taskManager.getAllTasks().find((t) => String(t.id) === String(editingTaskId));
        const updatedTask = new Task(
          Number(editingTaskId) || editingTaskId,
          title,
          description,
          assignee,
          dueDate,
          status
        );
        if (existingTask) {
          updatedTask.tags = existingTask.tags || [];
          updatedTask.comments = existingTask.comments || 0;
        }
        taskManager.updateTask(editingTaskId, updatedTask);

        console.log("Tarea actualizada:", updatedTask.getTask ? updatedTask.getTask() : updatedTask);
      } else {
        const newTask = new Task(null, title, description, assignee, dueDate, status);
        taskManager.addTask(newTask);

        console.log("Nueva tarea:", newTask.getTask());
        console.log("Total tareas:", taskManager.getAllTasks().length);
      }

      bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });



    buildAssigneeMenu();

    const assigneeMenu = modalEl.querySelector("#assigneeMenu");
    assigneeMenu?.addEventListener("click", (event) => {
      const item = event.target.closest(".assignee-picker__item");
      if (!item) return;
      setAssignee(item.dataset.userIndex);
    });

    const dueDateInput = modalEl.querySelector("#dueDate");
    if (window.jQuery && jQuery.fn.datepicker && dueDateInput) {
      jQuery(dueDateInput).datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        autoclose: true,
        todayHighlight: true,
      });
    }

    modalEl.querySelector("#taskName")?.addEventListener("input", (e) => clearFieldError(e.target));
    modalEl.querySelector("#taskDescription")?.addEventListener("input", (e) =>
      clearFieldError(e.target, modalEl.querySelector("#taskDescriptionWrapper"))
    );
    modalEl.querySelector("#dueDate")?.addEventListener("input", (e) => clearFieldError(e.target));
    modalEl.querySelector("#dueDate")?.addEventListener("change", (e) => clearFieldError(e.target));
    if (window.jQuery && jQuery.fn.datepicker && dueDateInput) {
      jQuery(dueDateInput).on("changeDate", () => clearFieldError(dueDateInput));
    }

    modalEl.addEventListener("hide.bs.modal", () => {
      if (modalEl.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
      editingTaskId = null;
      clearModalErrors(modalEl);

      const modalTitle = modalEl.querySelector("#taskFormModalLabel");
      if (modalTitle) modalTitle.textContent = "Crear tarea";

      const submitBtn = modalEl.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.textContent = "Crear";

      form?.reset();
      setStatus(defaultStatus);
      setAssignee(-1);
      if (window.jQuery && jQuery.fn.datepicker && dueDateInput) {
        jQuery(dueDateInput).datepicker("update", "");
        jQuery(dueDateInput).datepicker("hide");
      }

      if (modalTrigger?.isConnected) {
        modalTrigger.focus();
      }
      modalTrigger = null;
    });

    return true;
  };

  if (!bindModalEvents()) {
    const observer = new MutationObserver(() => {
      if (bindModalEvents()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
