import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriesActions } from '@app/store/tasks/tasks.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-list-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './create-list-dialog.component.html',
  styleUrl: './create-list-dialog.component.scss',
})
export class CreateListDialogComponent {
  listName = '';

  public readonly dialogRef = inject(MatDialogRef<CreateListDialogComponent>);
  private readonly store = inject(Store);

  createNewList() {
    this.store.dispatch(
      CategoriesActions.createCategory({ name: this.listName })
    );

    this.dialogRef.close();
  }
}
