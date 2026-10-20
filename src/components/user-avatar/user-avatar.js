function userAvatarTemplate({ src, alt, size = "sm" }) {
  return `<img src="${src}" alt="${alt}" class="avatar-${size}" />`;
}
