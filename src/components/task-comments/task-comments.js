(() => {
  let activeTaskId = null;
  let editingCommentId = null;

  const getModal = () => document.getElementById("taskFormModal");
  const getList = () => getModal()?.querySelector("#taskCommentsList");
  const getInput = () => getModal()?.querySelector("#newCommentInput");
  const getComposerActions = () => getModal()?.querySelector("#commentComposerActions");
  const getSaveBtn = () => getModal()?.querySelector("#saveCommentBtn");

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  function formatRelativeDate(isoDate) {
    const date = isoDate ? new Date(isoDate) : null;
    if (!date || Number.isNaN(date.getTime())) return "hace un momento";

    const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "hace un momento";
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `hace ${diffHours} h`;

    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `hace ${diffDays} d`;

    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getCommentAuthor(comment) {
    if (comment.author && comment.author.name) return comment.author;
    if (typeof user !== "undefined" && user) {
      return { name: user.name, src: user.src };
    }
    return {
      name: "Usuario",
      src: "https://ui-avatars.com/api/?name=Usuario&background=6366f1&color=fff",
    };
  }

  function commentItemTemplate(comment) {
    const author = getCommentAuthor(comment);
    const avatarSrc =
      author.src ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=6366f1&color=fff`;
    const displayDate = comment.updatedAt || comment.createdAt;

    return `
      <div class="task-comment-item d-flex gap-2" data-comment-id="${comment.id}">
        <img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(author.name)}" class="task-comment-item__avatar">

        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-baseline gap-2 mb-1">
            <span class="fw-bold text-dark task-comment-item__author">${escapeHtml(author.name)}</span>
            <span class="task-comment-item__time">${formatRelativeDate(displayDate)}</span>
          </div>

          <div class="task-comment-item__bubble">${escapeHtml(comment.text)}</div>

          <div class="task-comment-item__actions d-flex align-items-center gap-2 mt-1">
            <div class="task-comment-item__action-group d-flex align-items-center gap-1">
              <span class="text-muted">•</span>
              <button type="button" class="task-comment-item__action-link" data-comment-action="edit">Editar</button>
            </div>
            <div class="task-comment-item__action-group d-flex align-items-center gap-1">
              <span class="text-muted">•</span>
              <button type="button" class="task-comment-item__action-link" data-comment-action="delete">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function emptyStateTemplate(message) {
    return `
      <div class="task-comments__empty">
        <i class="fa-regular fa-message"></i>
        <span>${message}</span>
      </div>
    `;
  }

  function setComposerActionsVisible(visible) {
    const actions = getComposerActions();
    if (!actions) return;

    actions.classList.toggle("d-none", !visible);
    actions.classList.toggle("d-flex", visible);
  }

  function autoGrowInput(input) {
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  }

  function resetComposer() {
    const input = getInput();
    if (input) {
      input.value = "";
      autoGrowInput(input);
    }

    editingCommentId = null;

    const saveBtn = getSaveBtn();
    if (saveBtn) saveBtn.textContent = "Guardar";

    setComposerActionsVisible(false);
  }

  function renderTaskComments(task) {
    const list = getList();
    if (!list) return;

    const taskChanged = (task ? task.id : null) !== activeTaskId;
    activeTaskId = task ? task.id : null;
    if (taskChanged) resetComposer();

    if (!task) {
      list.innerHTML = emptyStateTemplate("Guarda la tarea para poder comentar.");
      return;
    }

    const comments = Array.isArray(task.comments) ? task.comments : [];
    list.innerHTML = comments.length
      ? comments.map(commentItemTemplate).join("")
      : emptyStateTemplate("Aún no hay comentarios. ¡Sé el primero en comentar!");
  }

  window.renderTaskComments = renderTaskComments;

  function saveComment() {
    const input = getInput();
    const text = input?.value.trim() || "";
    if (!text || activeTaskId == null) return;

    if (editingCommentId) {
      taskManager.updateComment(activeTaskId, editingCommentId, text);
    } else {
      taskManager.addComment(activeTaskId, text);
    }

    resetComposer();
  }

  document.addEventListener("input", (event) => {
    if (!event.target.matches("#newCommentInput")) return;
    autoGrowInput(event.target);
    setComposerActionsVisible(true);
  });

  document.addEventListener("focusin", (event) => {
    if (!event.target.matches("#newCommentInput")) return;
    setComposerActionsVisible(true);
  });

  document.addEventListener("keydown", (event) => {
    if (!event.target.matches("#newCommentInput")) return;
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveComment();
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("#saveCommentBtn")) {
      event.preventDefault();
      saveComment();
      return;
    }

    if (event.target.closest("#cancelCommentBtn")) {
      event.preventDefault();
      resetComposer();
      return;
    }

    const actionBtn = event.target.closest("[data-comment-action]");
    if (actionBtn) {
      event.preventDefault();
      const item = actionBtn.closest("[data-comment-id]");
      const commentId = item?.dataset.commentId;
      if (!commentId || activeTaskId == null) return;

      if (actionBtn.dataset.commentAction === "delete") {
        taskManager.deleteComment(activeTaskId, commentId);
        return;
      }

      if (actionBtn.dataset.commentAction === "edit") {
        const task = taskManager.getTaskById(activeTaskId);
        const comment = (task?.comments || []).find((c) => c.id === commentId);
        const input = getInput();
        if (!comment || !input) return;

        input.value = comment.text;
        autoGrowInput(input);
        editingCommentId = commentId;
        setComposerActionsVisible(true);

        const saveBtn = getSaveBtn();
        if (saveBtn) saveBtn.textContent = "Actualizar";

        input.focus();
      }
    }
  });

  if (typeof taskManager !== "undefined" && typeof taskManager.subscribe === "function") {
    taskManager.subscribe(() => {
      if (activeTaskId == null) return;
      const task = taskManager.getTaskById(activeTaskId);
      renderTaskComments(task);
    });
  }
})();
