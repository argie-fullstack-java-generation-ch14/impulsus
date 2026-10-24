function teamCardTemplate({ name, src, role }) {
  return `
    <div class="team-member">
      ${userAvatarTemplate({ src, alt: name })}
      <div class="member-info">
        <div class="name">${name}</div>
        <div class="role">${role}</div>
      </div>
    </div>
  `;
}

function renderTeamCards() {
  const mount = document.getElementById("teamList");
  if (!mount) return false;

  mount.innerHTML = team.map(teamCardTemplate).join("");
  return true;
}

if (!renderTeamCards()) {
  const observer = new MutationObserver(() => {
    if (renderTeamCards()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
