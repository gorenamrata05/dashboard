import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { TaskFormComponent } from '../task-form/task-form.component';
import { Task, TaskStatus } from '../../file-tree/task.model';
import { TaskService } from '../../file-tree/task.service';
import { ToastService } from '../../file-tree/toast.service';

type SortField = 'createdDate' | 'title';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [TaskFormComponent, CommonModule, RouterModule] 
})
export class TaskListComponent implements OnInit {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  filteredTasks: Task[] = [];
  statusFilter: TaskStatus | 'All' = 'All';
  searchControl = new FormControl('');
  sortField: SortField = 'createdDate';
  sortOrder: SortOrder = 'asc';
  isModalOpen = false;
  selectedTask: Task = this.createEmptyTask();
  private tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    let filtered = [...this.tasks];

    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(t => t.status === this.statusFilter);
    }

    const keyword = this.searchControl.value?.toLowerCase().trim();
    if (keyword) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(keyword) ||
        t.description.toLowerCase().includes(keyword)
      );
    }

    filtered.sort((a, b) => {
      let comp = 0;
      if (this.sortField === 'createdDate') {
        comp = a.createdDate.getTime() - b.createdDate.getTime();
      } else if (this.sortField === 'title') {
        comp = a.title.localeCompare(b.title);
      }
      return this.sortOrder === 'asc' ? comp : -comp;
    });
    this.filteredTasks = filtered;
  }

  onStatusFilterChange(status: TaskStatus | 'All') {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSortFieldChange(field: SortField) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  // onAddNewTask() {
  //   this.selectedTask = this.createEmptyTask();
  //   this.isModalOpen = true;
  // }

  // onEditTask(task: Task) {
  //   this.selectedTask = { ...task };
  //   this.isModalOpen = true;
  // }

  // onSaveTask(task: Task) {
  //   if (task.id === 0) {
  //     this.taskService.addTask(task);
  //     this.toast.show('Task added!');
  //   } else {
  //     this.taskService.updateTask(task);
  //     this.toast.show('Task updated!');
  //   }

  //   this.isModalOpen = false;
  //   this.applyFilters();
  // }

  onModalClose() {
    this.isModalOpen = false;
  }

  createEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      status: 'To Do',
      dueDate: new Date(),
      createdDate: new Date()
    };
  }

  getStatusIcon(status: TaskStatus) {
    switch (status) {
      case 'To Do': return 'fa-circle-notch text-primary';
      case 'In Progress': return 'fa-spinner text-warning';
      case 'Complete': return 'fa-check-circle text-success';
      default: return '';
    }
  }

   getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  onAddNewTask(task: Task) {
    task.id = this.tasks.length + 1;
    task.createdDate = new Date();
    this.tasks.push(task);
    this.tasksSubject.next([...this.tasks]); // emit updated tasks
  }

  onEditTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      this.tasks[index] = { ...task };
      this.tasksSubject.next([...this.tasks]); // emit updated tasks
    }
  }
}
