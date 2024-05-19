import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Task } from '@app/models/Task';
import { selectTaskByID } from '@app/store/tasks/tasks.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    DatePipe,
    TitleCasePipe,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  task: Task | undefined;

  private routeSub!: Subscription;
  private taskSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((map) => {
      const id = map['id'];
      if (id) {
        this.taskSub = this.store
          .select(selectTaskByID(id))
          .subscribe((task) => {
            if (task) {
              this.task = task;
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.taskSub.unsubscribe();
  }
}
