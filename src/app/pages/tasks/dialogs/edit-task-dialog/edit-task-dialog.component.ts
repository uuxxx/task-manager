import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Task } from '@app/models/Task';
import { TaskFormComponent } from '@app/shared/task-form/task-form.component';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [TaskFormComponent, MatDialogContent],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss',
})
export class EditTaskDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    public readonly dialogRef: MatDialogRef<EditTaskDialogComponent>,
    private readonly store: Store
  ) {}

  editTask(taskData: Omit<Task, 'id' | 'creationTS' | 'categoryID'>) {
    this.store.dispatch(
      TasksActions.updateTask({
        taskID: this.data.task.id,
        newData: taskData,
      })
    );

    this.dialogRef.close();
  }
}
