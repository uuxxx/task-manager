import { Task } from '@app/models/Task';
import { AppState } from '@app/store/types';
import { createSelector } from '@ngrx/store';

const tasksFeature = (state: AppState) => state.tasks;

export const selectAllCategories = () =>
  createSelector(tasksFeature, (state) => {
    return state.categories.map((categoryID) => state.categoryMap[categoryID]);
  });

export const selectAllTasks = () => {
  return createSelector(tasksFeature, (state) => {
    return state.categories.reduce<Task[]>((acc, categoryID) => {
      const curCategory = state.categoryMap[categoryID];
      for (const taskID of curCategory.taskIDs) {
        acc.push(state.taskMap[taskID]);
      }
      return acc;
    }, []);
  });
};

export const selectTasksOfCategory = (categoryID: string) => {
  return createSelector(tasksFeature, (state) => {
    return state.categoryMap[categoryID].taskIDs.map(
      (taskID) => state.taskMap[taskID]
    );
  });
};

export const selectTaskByID = (taskID: string) => {
  return createSelector(tasksFeature, (state) => {
    return state.taskMap[taskID] as Task | undefined;
  });
};
