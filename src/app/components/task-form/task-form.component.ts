import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Task, TaskStatus } from '../../../app/file-tree/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'], 
  imports: [CommonModule]
})
export class TaskFormComponent implements OnChanges {
  @Input() task?: Task | null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();

  statuses: TaskStatus[] = ['To Do', 'In Progress', 'Complete'];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['To Do', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        dueDate: this.formatDateInput(this.task.dueDate)
      });
    } else if (!this.task) {
      this.form.reset({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: ''
      });
    }
  }

  formatDateInput(date: Date): string {
    return new Date(date).toISOString().substring(0, 10);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;
    const taskToSave: Task = {
      id: this.task?.id ?? 0,
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      status: formValue.status,
      createdDate: this.task?.createdDate ?? new Date(),
      dueDate: new Date(formValue.dueDate)
    };
    this.save.emit(taskToSave);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
