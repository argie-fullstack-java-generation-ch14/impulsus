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
