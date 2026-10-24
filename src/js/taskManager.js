class TaskManager {

  constructor() {
    this.taskList = []
    this.idTasks = 0;
  }

  getAllTasks() {
    return this.taskList;
  }

  getTasksWithStatus(status) {
    return this.taskList.filter(task => task.status === status)
  }

  addTask(task) {
    this.taskList.push(task)
  }

  deleteTask(taskId) {
    this.taskList = this.taskList.filter(task => task.id !== taskId)
  }

  updateTask(taskId, newTask) {
    let task = this.taskList.find(task => task.id === taskId);
    task = newTask;
  }
}