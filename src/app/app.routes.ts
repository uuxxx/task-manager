import { Routes } from '@angular/router';
import { TasksComponent } from '@app/pages/tasks/tasks.component';

export const routes: Routes = [
  { path: 'tasks', component: TasksComponent },
  {
    path: 'tasks/table',
    loadComponent: () =>
      import('@app/pages/tasks-table/tasks-table.component').then(
        (m) => m.TasksTableComponent
      ),
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('@app/pages/task-details/task-details.component').then(
        (m) => m.TaskDetailsComponent
      ),
  },
  { path: '**', redirectTo: 'tasks' },
];
