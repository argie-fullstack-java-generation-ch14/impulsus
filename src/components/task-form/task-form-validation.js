(() => {
  const getModalEl = () => document.getElementById("taskFormModal");

  function setCustomValidity(el, message) {
    if (typeof el?.setCustomValidity === "function") {
      el.setCustomValidity(message);
    }
  }

  function clearFieldError(el, wrapper = null) {
    if (!el) return;
    (wrapper || el).classList.remove("is-invalid");
    setCustomValidity(el, "");
  }

  function clearModalErrors(modalEl) {
    if (!modalEl) return;

    ["#taskName", "#taskDescriptionWrapper", ".assignee-select", "#assigneeToggle", "#dueDate", "#taskStatusToggle"]
      .forEach((selector) => {
        clearFieldError(modalEl.querySelector(selector));
      });
  }

  function validateTaskForm(nombre, descripcion, asignadoA, fechaEntrega, estado) {
    if (typeof nombre === "object" && nombre !== null && !(nombre instanceof String)) {
      const data = nombre;
      nombre = data.nombre || data.name || data.title || "";
      descripcion = data.descripcion || data.description || "";
      asignadoA = data.asignadoA || data.assignedTo || data.assignee || "";
      fechaEntrega = data.fechaEntrega || data.dueDate || "";
      estado = data.estado || data.status || "";
    }

    if (arguments.length === 0) {
      const modalEl = getModalEl();
      if (modalEl) {
        nombre = modalEl.querySelector("#taskName")?.value || "";
        descripcion = modalEl.querySelector("#taskDescription")?.value || "";
        const assigneeToggle = modalEl.querySelector("#assigneeToggle");
        const assigneeIndex = Number(assigneeToggle?.dataset.userIndex);
        const user = typeof team !== "undefined" && assigneeIndex >= 0 ? team[assigneeIndex] : null;
        asignadoA = user ? user.name : (assigneeToggle?.textContent || "");
        fechaEntrega = modalEl.querySelector("#dueDate")?.value || "";
        estado = modalEl.querySelector("#taskStatusToggle")?.dataset.status || "";
      }
    }

    const getStr = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "object" && val.name) return String(val.name).trim();
      return String(val).trim();
    };

    const nameStr = getStr(nombre);
    const descStr = getStr(descripcion);
    const dateStr = getStr(fechaEntrega);
    const statusStr = getStr(estado);

    let isAssigneeValid = false;
    if (typeof asignadoA === "object" && asignadoA !== null) {
      isAssigneeValid = Boolean(asignadoA.name && String(asignadoA.name).trim().length > 0);
    } else if (typeof asignadoA === "number") {
      isAssigneeValid = asignadoA >= 0;
    } else {
      const str = String(asignadoA || "").trim();
      isAssigneeValid = str.length > 0 && str !== "Sin asignar" && !str.includes("Selecciona");
    }

    const isNameValid = nameStr.length > 8;
    const isDescValid = descStr.length > 15;
    const isDateValid = dateStr.length > 0;
    const isStatusValid = statusStr.length > 0;

    const modalEl = getModalEl();
    if (modalEl) {
      const setFieldValidity = (el, isValid, wrapper = null) => {
        if (!el) return;
        const target = wrapper || el;
        if (isValid) {
          target.classList.remove("is-invalid");
          setCustomValidity(el, "");
        } else {
          target.classList.add("is-invalid");
        }
      };

      setFieldValidity(modalEl.querySelector("#taskName"), isNameValid);
      setFieldValidity(
        modalEl.querySelector("#taskDescription"),
        isDescValid,
        modalEl.querySelector("#taskDescriptionWrapper")
      );
      setFieldValidity(
        modalEl.querySelector("#assigneeToggle"),
        isAssigneeValid,
        modalEl.querySelector(".assignee-select")
      );
      setFieldValidity(modalEl.querySelector("#dueDate"), isDateValid);
      setFieldValidity(modalEl.querySelector("#taskStatusToggle"), isStatusValid);
    }

    return isNameValid && isDescValid && isAssigneeValid && isDateValid && isStatusValid;
  }

  window.TaskFormValidation = {
    validateTaskForm,
    clearFieldError,
    clearModalErrors,
  };
  window.validateTaskForm = validateTaskForm;
})();
