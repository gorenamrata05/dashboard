import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTreeComponent } from './file-tree.component';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [FileTreeComponent],
  imports: [
    CommonModule, 
    BrowserModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FileTreeModule { }
