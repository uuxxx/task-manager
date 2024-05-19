import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '@app/models/Task';

const PRIORITIES: Task['priority'][] = ['low', 'mid', 'high'];
const STATUSES: Task['status'][] = ['as planned', 'late', 'done'];

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  @Input() task: Omit<Task, 'id' | 'creationTS' | 'categoryID'> = {
    title: '',
    description: '',
    deadline: null as unknown as Date,
    priority: null as unknown as Task['priority'],
    status: null as unknown as Task['status'],
    assignees: [],
  };

  @Output() submitEvent = new EventEmitter<
    ReturnType<typeof this.formGroup.getRawValue>
  >();

  ngOnInit(): void {
    Object.keys(this.task).forEach((key) => {
      if (key === 'assignees') return;
      this.formGroup.patchValue({
        [key]: this.task[key as keyof typeof this.task],
      });
    });

    this.assignees = this.task.assignees.slice();
    this.formGroup.patchValue({ assignees: this.assignees });
  }

  public readonly today = new Date();
  public readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly priorities = PRIORITIES;
  public readonly statuses = STATUSES;
  public assignees: string[] = [];

  formGroup = new FormGroup({
    title: new FormControl(this.task.title, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl(this.task.description, { nonNullable: true }),
    deadline: new FormControl(this.task.deadline, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl(this.task.priority, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl(this.task.status, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assignees: new FormControl(this.task.assignees, { nonNullable: true }),
  });

  formSubmit() {
    this.submitEvent.emit(this.formGroup.getRawValue());
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    if (this.assignees.indexOf(value) >= 0) {
      return;
    }

    if (value) {
      this.assignees.push(value);
      this.formGroup.patchValue({ assignees: this.assignees });
    }

    event.chipInput.clear();
  }

  remove(assignee: string) {
    const index = this.assignees.indexOf(assignee);

    if (index >= 0) {
      this.assignees.splice(index, 1);
      this.formGroup.patchValue({ assignees: this.assignees });
    }
  }

  edit(assignee: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(assignee);
    } else {
      const index = this.assignees.indexOf(assignee);
      if (index >= 0) {
        this.assignees[index] = value;
      }
    }
    this.formGroup.patchValue({ assignees: this.assignees });
  }
}
