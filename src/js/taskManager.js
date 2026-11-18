const STORAGE_KEY = "impulsus.tasks";

class TaskManager {

  constructor() {
    this.listeners = new Set();
    this.taskList = this.loadFromStorage();
    this.idTask = this.taskList.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0);
  }

  loadFromStorage() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(stored)) return [];
      return stored.map((task) =>
        Array.isArray(task?.comments) ? task : { ...task, comments: [] }
      );
    } catch {
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.taskList));
    } catch {
      console.error("No se pudieron guardar las tareas en localStorage");
    }
  }

  getAllTasks() {
    return this.taskList;
  }

  getTasksWithStatus(status) {
    return this.taskList.filter(task => task.status === status)
  }

  getTaskById(taskId) {
    return this.taskList.find(task => String(task.id) === String(taskId)) || null;
  }

  addTask(task) {
    this.idTask += 1;
    task.id = this.idTask;
    this.taskList.push(task);
    this.saveToStorage();
    this.notify();
    return task;
  }

  deleteTask(taskId) {
    this.taskList = this.taskList.filter(task => String(task.id) !== String(taskId));
    this.saveToStorage();
    this.notify();
  }

  updateTask(taskId, newTask) {
    let task = this.taskList.findIndex(task => String(task.id) === String(taskId));
    if (task === -1) return;
    newTask.id = this.taskList[task].id;
    this.taskList[task] = newTask;
    this.saveToStorage();
    this.notify();
  }

  addComment(taskId, text) {
    const task = this.getTaskById(taskId);
    if (!task) return null;

    const comments = Array.isArray(task.comments) ? task.comments : [];
    const author =
      typeof user !== "undefined" && user
        ? { name: user.name, src: user.src }
        : { name: "Usuario", src: "" };

    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      author,
      createdAt: new Date().toISOString(),
    };

    this.updateTask(task.id, { ...task, comments: [...comments, comment] });
    return comment;
  }

  updateComment(taskId, commentId, text) {
    const task = this.getTaskById(taskId);
    if (!task) return null;

    const comments = Array.isArray(task.comments) ? task.comments : [];
    let updatedComment = null;

    const nextComments = comments.map((comment) => {
      if (comment.id !== commentId) return comment;
      updatedComment = { ...comment, text, updatedAt: new Date().toISOString() };
      return updatedComment;
    });

    if (!updatedComment) return null;

    this.updateTask(task.id, { ...task, comments: nextComments });
    return updatedComment;
  }

  deleteComment(taskId, commentId) {
    const task = this.getTaskById(taskId);
    if (!task) return;

    const comments = Array.isArray(task.comments) ? task.comments : [];
    this.updateTask(task.id, {
      ...task,
      comments: comments.filter((comment) => comment.id !== commentId),
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.taskList))
  }
}
