import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Task } from '@app/models/Task';
import { TaskFormComponent } from '@app/shared/task-form/task-form.component';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButtonModule,
    TaskFormComponent,
  ],
  templateUrl: './create-task-dialog.component.html',
  styleUrl: './create-task-dialog.component.scss',
})
export class CreateTaskDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { categoryID: string },
    public readonly dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    private readonly store: Store
  ) {}

  createTask(taskData: Omit<Task, 'id' | 'creationTS' | 'categoryID'>) {
    this.store.dispatch(
      TasksActions.createTask({ categoryID: this.data.categoryID, taskData })
    );

    this.dialogRef.close();
  }
}
