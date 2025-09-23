import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../task.model';
import { TaskService } from '../../task.service';
import { ToastService } from '../../toast.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

type SortField = 'createdDate' | 'title';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  statusFilter: TaskStatus | 'All' = 'All';
  searchControl = new FormControl('');
  sortField: SortField = 'createdDate';
  sortOrder: SortOrder = 'asc';

  isModalOpen = false;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService, private toast: ToastService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.tasks];

    // Filter by status
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(t => t.status === this.statusFilter);
    }

    // Filter by keyword in title or description
    const keyword = this.searchControl.value?.toLowerCase().trim();
    if (keyword) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(keyword) || t.description.toLowerCase().includes(keyword)
      );
    }

    // Sort
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
      // toggle order
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  openAddModal() {
    this.selectedTask = null;
    this.isModalOpen = true;
  }

  openEditModal(task: Task) {
    this.selectedTask = task;
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }

  onSaveTask(task: Task) {
    if (task.id === 0) {
      // New Task
      this.taskService.addTask(task);
      this.toast.show('Task added successfully!');
    } else {
      this.taskService.updateTask(task);
      this.toast.show('Task updated successfully!');
    }
  }

  getStatusIcon(status: TaskStatus) {
    switch (status) {
      case 'To Do': return 'fa-circle-notch text-primary';
      case 'In Progress': return 'fa-spinner text-warning';
      case 'Complete': return 'fa-check-circle text-success';
      default: return '';
    }
  }

  getStatusColor(status: TaskStatus) {
    switch (status) {
      case 'To Do': return '#0d6efd'; // Bootstrap primary blue
      case 'In Progress': return '#ffc107'; // Bootstrap warning yellow
      case 'Complete': return '#198754'; // Bootstrap success green
      default: return '#6c757d'; // Bootstrap secondary gray
    }
  }
}
