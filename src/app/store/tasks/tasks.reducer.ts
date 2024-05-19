import { Task } from '@app/models/Task';
import { TasksCategory } from '@app/models/TasksCategory';
import {
  CategoriesActions,
  TasksActions,
} from '@app/store/tasks/tasks.actions';
import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';

export interface InitialState {
  taskMap: Record<string, Task>;
  categoryMap: Record<string, TasksCategory>;
  categories: string[];
}

export const initialState: InitialState = {
  taskMap: {},
  categoryMap: {},
  categories: [],
};

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.createTask, (state, { categoryID, taskData }) => {
    const creationTS = Date.now();
    const id = crypto.randomUUID();

    const task = { creationTS, id, ...taskData, categoryID };

    return produce(state, (draft) => {
      draft.taskMap[id] = task;
      draft.categoryMap[categoryID].taskIDs.push(id);
    });
  }),
  on(TasksActions.removeTask, (state, { taskID }) => {
    return produce(state, (draft) => {
      const categoryID = draft.taskMap[taskID].categoryID;
      draft.categoryMap[categoryID].taskIDs = draft.categoryMap[
        categoryID
      ].taskIDs.filter((id) => id !== taskID);

      delete draft.taskMap[taskID];
    });
  }),
  on(TasksActions.updateTask, (state, { taskID, newData }) => {
    return produce(state, (draft) => {
      Object.assign(draft.taskMap[taskID], newData);
    });
  }),
  on(CategoriesActions.createCategory, (state, { name }) => {
    const creationTS = Date.now();
    const id = crypto.randomUUID();

    const category: TasksCategory = { creationTS, id, taskIDs: [], name };

    return produce(state, (draft) => {
      draft.categoryMap[id] = category;
      draft.categories.push(id);
    });
  })
);
