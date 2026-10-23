(() => {
  const defaultStatus = "pending";
  const assigneePlaceholderHtml = `
    <span class="assignee-select__placeholder">
      <i class="bi bi-person"></i>
      <span>Selecciona una persona</span>
    </span>
  `;

  const getModalEl = () => document.getElementById("taskFormModal");

  function setStatus(statusKey) {
    const modalEl = getModalEl();
    if (!modalEl) return;

    const item = modalEl.querySelector(`.dropdown-item[data-status="${statusKey}"]`);
    const toggle = modalEl.querySelector("#taskStatusToggle");
    if (!item || !toggle) return;

    toggle.textContent = item.textContent.trim();
    toggle.dataset.status = statusKey;
  }

  function setAssignee(userIndex) {
    const modalEl = getModalEl();
    const toggle = modalEl?.querySelector("#assigneeToggle");
    if (!toggle) return;

    const index = Number(userIndex);
    const user = typeof users !== "undefined" ? users[index] : null;

    if (user) {
      toggle.innerHTML = `
        <span class="assignee-select__value">
          <img src="${user.src}" alt="">
          <span>${user.name}</span>
        </span>
      `;
      toggle.dataset.userIndex = String(index);
    } else {
      toggle.innerHTML = assigneePlaceholderHtml;
      delete toggle.dataset.userIndex;
    }
  }

  function buildAssigneeMenu() {
    const modalEl = getModalEl();
    const menu = modalEl?.querySelector("#assigneeMenu");
    if (!menu || typeof users === "undefined") return;

    menu.innerHTML = `
      <li>
        <button type="button" class="assignee-picker__item assignee-picker__item--clear" data-user-index="-1">
          <span class="assignee-picker__clear-avatar"></span>
          <span>Sin asignar</span>
        </button>
      </li>
      <li><div class="assignee-picker__divider" role="separator"></div></li>
      ${users
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

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".add-task-btn, .add-task-header-btn");
    if (!addBtn) return;

    const modalEl = getModalEl();
    if (!modalEl) return;

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

    const form = modalEl.querySelector("#createTaskForm");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    buildAssigneeMenu();

    const assigneeMenu = modalEl.querySelector("#assigneeMenu");
    assigneeMenu?.addEventListener("click", (event) => {
      const item = event.target.closest(".assignee-picker__item");
      if (!item) return;
      setAssignee(item.dataset.userIndex);
    });

    const deadlineInput = modalEl.querySelector("#deadline");
    if (window.jQuery && jQuery.fn.datepicker && deadlineInput) {
      jQuery(deadlineInput).datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        autoclose: true,
        todayHighlight: true,
      });
    }

    modalEl.addEventListener("hidden.bs.modal", () => {
      form?.reset();
      setStatus(defaultStatus);
      setAssignee(-1);
      if (window.jQuery && jQuery.fn.datepicker && deadlineInput) {
        jQuery(deadlineInput).datepicker("hide");
      }
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
