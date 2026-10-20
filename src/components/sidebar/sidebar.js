document.addEventListener("click", (event) => {

  if (event.target.closest("#sidebarToggle")) {
    const sidebar = document.getElementById("sidebar");
    const toggleIcon = document.getElementById("toggleIcon");
    if (!sidebar || !toggleIcon) return;

    sidebar.classList.toggle("collapsed");
    if (sidebar.classList.contains("collapsed")) {
      toggleIcon.className = "ri-arrow-right-s-line";
    } else {
      toggleIcon.className = "ri-arrow-left-s-line";
    }
    return;
  }

  if (event.target.closest("#mobileMenuBtn") || event.target.closest("#sidebarOverlay")) {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    if (!sidebar) return;

    sidebar.classList.toggle("mobile-open");
    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle("active");
    }
  }
});
