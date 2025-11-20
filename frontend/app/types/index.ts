export interface MainTask {
  id: number;
  title: string;
  description: string;
  done: boolean;
  letter_number: string;
  letter_date: string | null;
  due_date: string | null;
  subtasks: SubTask[];
  created_at: string;
  updated_at: string;
}

export interface SubTask {
  id: number;
  main_task_id: number;
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export interface TaskFilters {
  search: string;
  status: string;
}