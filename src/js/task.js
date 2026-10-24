class Task {

  constructor(id, name, description, assigned, deadline, status) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.assigned = assigned;
    this.deadline = deadline;
    this.status = status;
  }

  getTask() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      assigned: this.assigned,
      deadline: this.deadline,
      status: this.status,
    }
  }
}