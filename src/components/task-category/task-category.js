const taskCategories = {
  "habito-mentalidad": {
    label: "Hábitos y Mentalidades",
    icon: "fa-solid fa-seedling",
    description:
      "Rutinas ancla y entrenamiento mental diario que construyen disciplina a través de pequeñas acciones constantes.",
  },
  "proposito-carrera": {
    label: "Propósito y Carrera",
    icon: "fa-solid fa-user-tie",
    description:
      "Objetivos profesionales, estudio técnico profundo, bootcamps y desarrollo de habilidades clave.",
  },
  "vitalidad-cuerpo": {
    label: "Vitalidad y Cuerpo",
    icon: "fa-solid fa-dumbbell",
    description:
      "Entrenamiento físico, ejercicio diario, deportes, artes marciales y cuidado activo de la salud corporal.",
  },
  "hitos-vida": {
    label: "Hitos de Vida",
    icon: "fa-solid fa-signs-post",
    description:
      "Metas trascendentales y de largo aliento que marcan un antes y un después personal.",
  },
  "necesidades-inversion": {
    label: "Necesidades e Inversión",
    icon: "fa-solid fa-sack-dollar",
    description:
      "Gastos prioritarios, compras indispensables para el bienestar o herramientas que sostienen tu día a día.",
  },
  "esparcimiento-hobbies": {
    label: "Esparcimiento y Hobbies",
    icon: "fa-solid fa-masks-theater",
    description:
      "Talleres artísticos, actividades creativas y tiempo libre con propósito.",
  },
  "deseos-gustos": {
    label: "Deseos y Gustos",
    icon: "fa-solid fa-gift",
    description:
      "Recompensas y compras no urgentes planificadas para disfrutar sin culpa.",
  },
  "accion-transitoria": {
    label: "Acción Transitoria",
    icon: "fa-solid fa-bolt",
    description:
      "Tareas puntuales, diligencias o imprevistos del día a día que se resuelven una vez y liberan espacio mental.",
  },
};

function taskCategoryAvatarTemplate(categoryKey) {
  const category = taskCategories[categoryKey];
  if (!category) return "";

  return `
    <span class="category-avatar category-${categoryKey}" title="${category.label}">
      <i class="${category.icon}"></i>
    </span>
  `;
}

function taskCategorySlotTemplate(categoryKey) {
  if (!categoryKey || !taskCategories[categoryKey]) {
    return `
      <span class="category-avatar category-avatar--empty">
        <i class="fa-solid fa-plus"></i>
        <span class="category-card-tooltip">
          <span class="category-card-tooltip__name">Sin categoría</span>
          <span class="category-card-tooltip__desc">Haz clic para asignar una categoría.</span>
        </span>
      </span>
    `;
  }

  const category = taskCategories[categoryKey];

  return `
    <span class="category-avatar category-${categoryKey}">
      <i class="${category.icon}"></i>
      <span class="category-card-tooltip">
        <span class="category-card-tooltip__title">Categoría:</span>
        <span class="category-card-tooltip__name">${category.label}</span>
        <span class="category-card-tooltip__desc">${category.description}</span>
      </span>
    </span>
  `;
}
