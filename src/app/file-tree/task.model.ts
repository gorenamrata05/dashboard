export type TaskStatus = 'To Do' | 'In Progress' | 'Complete';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdDate: Date;
  dueDate: Date;
}
