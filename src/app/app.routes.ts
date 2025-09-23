import { Routes } from '@angular/router';
import { FileTreeComponent } from './file-tree/file-tree.component';

export const routes: Routes = [
    {
        path: '', 
        component: FileTreeComponent
    },{
        path: 'fileTree', 
        component: FileTreeComponent
    },{
        path: '**', 
        component: FileTreeComponent
    }
];
