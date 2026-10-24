class TaskManager {

  constructor() {
    this.taskList = []
    this.idTask = 0;
    this.listeners = new Set();
  }

  getAllTasks() {
    return this.taskList;
  }

  getTasksWithStatus(status) {
    return this.taskList.filter(task => task.status === status)
  }

  addTask(task) {
    this.idTask += 1;
    task.id = this.idTask;
    this.taskList.push(task);
    this.notify();
    return task;
  }

  deleteTask(taskId) {
    this.taskList = this.taskList.filter(task => task.id !== taskId);
    this.notify();
  }

  updateTask(taskId, newTask) {
    let task = this.taskList.findIndex(task => task.id === taskId);
    if (task === -1) return;
    newTask.id = taskId;
    this.taskList[task] = newTask;
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
