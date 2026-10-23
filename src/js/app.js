document.addEventListener("DOMContentLoaded", async () => {
  await renderPartial("#sidebar", "sidebar/index.html");
  await renderPartial("#header", "header/index.html");
  await renderPartial("#taskColumnsStatus", "task-columns-status/index.html");
  await renderPartial("#taskFormModalMount", "task-form/index.html");
});
