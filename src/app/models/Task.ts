export interface Task {
  readonly id: string;
  readonly creationTS: number;
  categoryID: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'high' | 'mid' | 'low';
  status: 'done' | 'as planned' | 'late';
  assignees: string[];
}
