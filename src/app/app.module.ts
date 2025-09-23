import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';

import { TaskListComponent } from './file-tree/task-list.component';
import { TaskFormComponent } from './file-tree/task-form.component';
import { ToastComponent } from './file-tree/toast.component';
import { ToastService } from './file-tree/toast.service';
import { TaskService } from './file-tree/task.service';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskFormComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ToastService, TaskService],
  bootstrap: [AppComponent],
})
export class AppModule {}
