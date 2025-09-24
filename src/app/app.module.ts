import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { TaskListComponent } from './file-tree/components/task-list/task-list.component';
import { TaskFormComponent } from './file-tree/components/task-form/task-form.component';
import { ToastComponent } from './file-tree/toast.component';
import { ToastService } from './file-tree/toast.service';
import { TaskService } from './file-tree/task.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
     AppComponent,
    TaskListComponent,
    TaskFormComponent,
    ToastComponent,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ToastrModule.forRoot(), 
  ],
  providers: [ToastService, TaskService],
  bootstrap: [AppComponent],
})
export class AppModule {}
