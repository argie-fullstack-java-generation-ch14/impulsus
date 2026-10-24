function optionsTooltipTemplate(params = {}) {
  const tagsActionLabel =
    typeof params === "string"
      ? params
      : params.tagsActionLabel || "Agregar etiquetas";

  return `
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
  `;
}

const tooltipTemplate = optionsTooltipTemplate;
