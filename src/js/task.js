class Task {

  constructor(id, title, description, assignee, dueDate, status, category = null, comments = []) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.dueDate = dueDate;
    this.status = status;
    this.category = category;
    this.comments = comments;
  }

  getTask() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      dueDate: this.dueDate,
      status: this.status,
      category: this.category,
      comments: this.comments,
    }
  }
}