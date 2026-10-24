class Task {

  constructor(id, title, description, assignee, dueDate, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.dueDate = dueDate;
    this.status = status;
  }

  getTask() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      dueDate: this.dueDate,
      status: this.status,
    }
  }
}