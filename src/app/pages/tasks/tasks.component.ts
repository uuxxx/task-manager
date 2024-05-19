import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { CreateListDialogComponent } from '@app/pages/tasks/dialogs/create-list-dialog/create-list-dialog.component';
import { CreateTaskDialogComponent } from '@app/pages/tasks/dialogs/create-task-dialog/create-task-dialog.component';
import { TaskComponent } from '@app/pages/tasks/task/task.component';
import {
  selectAllCategories,
  selectAllTasks,
  selectTasksOfCategory,
} from '@app/store/tasks/tasks.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    AsyncPipe,
    MatSidenavModule,
    MatListModule,
    MatDivider,
    MatButtonModule,
    MatIconModule,
    TaskComponent,
    RouterLink,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  private readonly store = inject(Store);
  public dialog = inject(MatDialog);

  public readonly lists = this.store.select(selectAllCategories());

  openedCategoryID: string | null = null;

  tasks = this.store.select(
    this.openedCategoryID
      ? selectTasksOfCategory(this.openedCategoryID)
      : selectAllTasks()
  );

  changeOpenedCategory(categoryID: string | null) {
    if (this.openedCategoryID === categoryID) return;
    this.openedCategoryID = categoryID;
    this.tasks = this.store.select(
      this.openedCategoryID
        ? selectTasksOfCategory(this.openedCategoryID)
        : selectAllTasks()
    );
  }

  openCreateListDialog() {
    this.dialog.open(CreateListDialogComponent);
  }

  openCreateTaskDialog() {
    this.dialog.open(CreateTaskDialogComponent, {
      data: { categoryID: this.openedCategoryID },
    });
  }
}
