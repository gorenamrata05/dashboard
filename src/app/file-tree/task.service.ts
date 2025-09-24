import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Setup Angular Project',
      description: 'Initialize Angular 19+ project using CLI',
      status: 'Complete',
      createdDate: new Date('2025-01-10'),
      dueDate: new Date('2025-01-12')
    },
    {
      id: 2,
      title: 'Design Task Model',
      description: 'Define interface for Task entity',
      status: 'In Progress',
      createdDate: new Date('2025-01-11'),
      dueDate: new Date('2025-01-15')
    },
    {
      id: 3,
      title: 'Implement Task List',
      description: 'Create component to list tasks with filters',
      status: 'To Do',
      createdDate: new Date('2025-01-12'),
      dueDate: new Date('2025-01-20')
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task) {
    task.id = this.generateId();
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks);
  }

  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = {...updatedTask};
      this.tasksSubject.next(this.tasks);
    }
  }

  private generateId(): number {
    return this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
  }
}
