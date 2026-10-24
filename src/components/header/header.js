function renderHeaderAvatar() {
  const mount = document.getElementById("headerAvatar");
  if (!mount) return false;

  const user = users[0];
  mount.innerHTML = userAvatarTemplate({ src: user.src, alt: user.name, size: "lg" });
  return true;
}

if (!renderHeaderAvatar()) {
  const observer = new MutationObserver(() => {
    if (renderHeaderAvatar()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("click", (event) => {
  const searchBox = document.getElementById("searchBox");
  if (!searchBox) return;

  if (event.target.closest("#mobileSearchBtn")) {
    searchBox.classList.toggle("mobile-search-active");

    const input = searchBox.querySelector("input");
    if (searchBox.classList.contains("mobile-search-active") && input) {
      input.focus();
    }
    return;
  }

  if (!searchBox.contains(event.target)) {
    searchBox.classList.remove("mobile-search-active");
  }
});
