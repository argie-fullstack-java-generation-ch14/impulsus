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
      return Array.isArray(stored) ? stored : [];
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

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.taskList))
  }
}
