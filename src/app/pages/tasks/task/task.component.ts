import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Task } from '@app/models/Task';
import { EditTaskDialogComponent } from '@app/pages/tasks/dialogs/edit-task-dialog/edit-task-dialog.component';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tasks-task',
  standalone: true,
  imports: [
    MatListItem,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;

  public dialog = inject(MatDialog);
  private readonly store = inject(Store);

  openEditTaskDialog(e: MouseEvent) {
    e.stopPropagation();
    this.dialog.open(EditTaskDialogComponent, {
      data: { task: this.task },
    });
  }

  deleteTask(e: MouseEvent) {
    e.stopPropagation();
    this.store.dispatch(TasksActions.removeTask({ taskID: this.task.id }));
  }
}
