function tooltipButtonTemplate({ action, icon, label, danger = false }) {
  const dangerClass = danger ? " tooltip-action--danger" : "";
  return `
    <button type="button" class="tooltip-action${dangerClass}" data-action="${action}">
      <i class="${icon}"></i>
      <span>${label}</span>
    </button>
  `;
}

function optionsTooltipTemplate(params = {}) {
  const tagsActionLabel =
    typeof params === "string"
      ? params
      : params.tagsActionLabel || "Agregar etiquetas";

  const options = [
    {
      action: "edit",
      icon: "fa-regular fa-pen-to-square",
      label: "Editar",
    },
    // {
    //   action: "tags",
    //   icon: "fa-solid fa-tag",
    //   label: tagsActionLabel,
    // },
    {
      action: "delete",
      icon: "fa-solid fa-trash",
      label: "Eliminar",
      danger: true,
    },
  ];

  return `
    <div class="options-tooltip" hidden>
      ${options.map(tooltipButtonTemplate).join("")}
    </div>
  `;
}

const tooltipTemplate = optionsTooltipTemplate;
const tooltipActionButtonTemplate = tooltipButtonTemplate;
