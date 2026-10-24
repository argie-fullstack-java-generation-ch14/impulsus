function commentsCountTemplate(comments = 0) {
  return `
    <div class="comments-count">
      <i class="ri-chat-3-line comment-icon"></i>
      <span>${comments} Comments</span>
    </div>
  `;
}
