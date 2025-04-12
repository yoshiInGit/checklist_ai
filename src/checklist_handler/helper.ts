import { TaskItem } from "./model";

export function parseTaskList(input: string): TaskItem[] {
  return input.split(',').map(item => {
    const trimmedItem = item.trim();
    const completed = trimmedItem.startsWith('[x]');
    const name = completed ? trimmedItem.substring(3).trim() : trimmedItem.substring(2).trim();
    return new TaskItem(name, completed);
  });
}

export function formatTaskList(tasks: TaskItem[]): string {
  return tasks
    .map(task => (task.completed ? '[x] ' : '[] ') + task.name)
    .join(',');
}
