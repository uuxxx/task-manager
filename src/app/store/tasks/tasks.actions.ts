import { Task } from '@app/models/Task';
import { createActionGroup, props } from '@ngrx/store';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Create Task': props<{
      categoryID: string;
      taskData: Omit<Task, 'id' | 'creationTS' | 'categoryID'>;
    }>(),
    'Remove Task': props<{ taskID: string }>(),
    'Update Task': props<{
      taskID: string;
      newData: Partial<Omit<Task, 'id' | 'creationTS'>>;
    }>(),
  },
});

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    'Create Category': props<{
      name: string;
    }>(),
    'Delete Category': props<{ categoryID: string }>(),
  },
});
