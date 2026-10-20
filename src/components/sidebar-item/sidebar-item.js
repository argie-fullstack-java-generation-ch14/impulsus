const navItems = [
  { icon: "ri-dashboard-horizontal-line", label: "Tablero", href: "impulsus/dashboard/" },
  // { icon: "ri-settings-4-line", label: "Configuración", href: "impulsus/configuracion/" },
];

function normalizePathname(pathname) {
  return pathname.replace(/index\.html$/, "").replace(/\/+$/, "/");
}

function isNavActive(href) {
  if (!href || href === "#") return false;
  const target = new URL(href, appBase);
  if (target.origin !== window.location.origin) return false;
  return normalizePathname(target.pathname) === normalizePathname(window.location.pathname);
}

function navItemTemplate({ icon, label, href = "#" }) {
  const resolvedHref = href === "#" ? "#" : new URL(href, appBase).href;
  const classes = isNavActive(href) ? "nav-item active" : "nav-item";
  return `
    <a href="${resolvedHref}" class="${classes}">
      <i class="${icon}"></i>
      <span>${label}</span>
    </a>
  `;
}

function renderNavItems() {
  const mount = document.getElementById("navItems");
  if (!mount) return false;

  mount.innerHTML = navItems.map(navItemTemplate).join("");
  return true;
}

if (!renderNavItems()) {
  const observer = new MutationObserver(() => {
    if (renderNavItems()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
