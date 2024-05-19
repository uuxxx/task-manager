import { InitialState as TasksInitialState } from '@app/store/tasks/tasks.reducer';

export type AppState = {
  tasks: TasksInitialState;
};
