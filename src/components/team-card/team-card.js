const teamMembers = [
  {
    avatar: {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      alt: "Theresa Webb",
    },
    name: "Theresa Webb",
    role: "UI Designer",
  },
];

function teamCardTemplate({ avatar, name, role }) {
  return `
    <div class="team-member">
      ${userAvatarTemplate(avatar)}
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

  mount.innerHTML = teamMembers.map(teamCardTemplate).join("");
  return true;
}

if (!renderTeamCards()) {
  const observer = new MutationObserver(() => {
    if (renderTeamCards()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
