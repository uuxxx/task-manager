import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { tasksReducer } from '@app/store/tasks/tasks.reducer';
import {
  Action,
  ActionReducer,
  MetaReducer,
  provideState,
  provideStore,
} from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { merge } from 'lodash-es';
import { routes } from './app.routes';

let onInit = true;

export function tasksMetaReducer<S, A extends Action = Action>(
  reducer: ActionReducer<S, A>
) {
  return function (state: S, action: A): S {
    const nextState = reducer(state, action);

    if (onInit) {
      const savedState = JSON.parse(localStorage.getItem('__storage__')!) || {};
      merge(nextState, savedState);
      onInit = false;
    }

    localStorage.setItem('__storage__', JSON.stringify(nextState));
    return nextState;
  };
}

export const metaReducers: MetaReducer<any>[] = [tasksMetaReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideStore(undefined, { metaReducers }),
    provideState({ name: 'tasks', reducer: tasksReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
