import { TaskItem } from "../checklist_handler/model";

//Helper
export const calculateCompleteRate = (tasks: TaskItem[]): number => {
  if (tasks.length > 0) {
    const completedTasks = tasks.filter(task => task.completed).length;
    return completedTasks / tasks.length;
  }
  return 0;
}