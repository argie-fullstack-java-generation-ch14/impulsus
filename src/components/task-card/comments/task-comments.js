function commentsCountTemplate(comments = 0) {
  return `
    <div class="comments-count">
      <i class="fa-regular fa-message"></i>
      <span>${comments} Comments</span>
    </div>
  `;
}
