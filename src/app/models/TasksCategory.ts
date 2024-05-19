export interface TasksCategory {
  readonly id: string;
  readonly creationTS: number;
  name: string;
  taskIDs: string[];
}
