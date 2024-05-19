import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '@app/models/Task';
import { Subscription } from 'rxjs';

const STATUSES: Task['status'][] = ['as planned', 'late', 'done'];

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() submitEvent = new EventEmitter<typeof this.formGroup.value>();

  formGroup = new FormGroup({
    status: new FormControl<Task['status'] | null>(null),
    deadline: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
    assignee: new FormControl(''),
  });

  private FormChangeSub!: Subscription;

  ngOnInit(): void {
    this.FormChangeSub = this.formGroup.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.isApplyDisabled = false;
      } else {
        this.isApplyDisabled = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.FormChangeSub.unsubscribe();
  }

  submitForm() {
    this.submitEvent.emit(this.formGroup.value);
  }

  public isApplyDisabled = true;

  public readonly statuses = STATUSES;
}
