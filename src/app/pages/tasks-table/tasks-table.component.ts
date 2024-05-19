import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Task } from '@app/models/Task';
import { FiltersComponent } from '@app/pages/tasks-table/filters/filters.component';
import { selectAllTasks } from '@app/store/tasks/tasks.selectors';
import { Store } from '@ngrx/store';

type FilterValues = Partial<{
  status: Task['status'] | null;
  deadline: Partial<{ start: Date | null; end: Date | null }>;
  assignee: string | null;
}>;

const STATUSES_MAP: Record<Task['status'], number> = {
  'as planned': 1,
  late: 2,
  done: 3,
};

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [
    DatePipe,
    JsonPipe,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FiltersComponent,
  ],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
})
export class TasksTableComponent implements OnInit {
  private readonly store = inject(Store);

  public readonly displayedColumns: (keyof Task)[] = [
    'title',
    'deadline',
    'priority',
    'status',
    'assignees',
  ];

  public dataSource = new MatTableDataSource<Task>([]);
  private initialSourceDate: Task[] = [];

  ngOnInit(): void {
    this.store.select(selectAllTasks()).subscribe((tasks) => {
      this.dataSource = new MatTableDataSource(tasks);
      this.initialSourceDate = tasks;
    });
  }

  filtersChange(filterValues: FilterValues) {
    this.dataSource.data = this.initialSourceDate.filter((task) => {
      for (const key in filterValues) {
        const filterValue = filterValues[key as keyof FilterValues];
        const taskValue = task[key as keyof Task];

        if (!filterValue || taskValue === filterValue) continue;

        if (key === 'assignee') {
          const hasFilterAssignee = task.assignees.some(
            (assignee) =>
              assignee.toLocaleLowerCase() ===
              (filterValue as string).toLocaleLowerCase()
          );

          if (!hasFilterAssignee) {
            return false;
          }

          continue;
        }

        if (key === 'deadline') {
          const { start, end } = filterValue as {
            start: Date;
            end: Date;
          };

          if (
            (start ? start <= new Date(task.deadline) : true) &&
            (end ? new Date(task.deadline) <= end : true)
          )
            continue;
          return false;
        }

        return false;
      }

      return true;
    });
  }

  sortChange(sort: Sort) {
    const isAsc = sort.direction === 'asc';

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      switch (sort.active) {
        case 'deadline':
          return (
            (new Date(a.deadline) < new Date(b.deadline) ? -1 : 1) *
            (isAsc ? 1 : -1)
          );
        case 'status':
          return (
            (STATUSES_MAP[a.status] - STATUSES_MAP[b.status]) * (isAsc ? 1 : -1)
          );
        default:
          return 0;
      }
    });
  }
}
