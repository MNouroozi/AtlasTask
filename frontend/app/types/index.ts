export enum TaskStatus {
  FollowUp = "پیگیری",
  Action = "اقدام",
  Reminder = "یادآوری"
}



export interface MainTask {
  id: number;
  title: string;
  description: string;
  done: boolean;
  letter_number: string;
  letter_date: string | null;
  due_date: string | null;
  status: TaskStatus; 
  subtasks: SubTask[];
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  search: string;
  status: string;
}

export interface SubTask {
  id: number;
  main_task_id: number;
  title: string;
  description: string;
  done: boolean;
  startSubtask: string;
  finishSubtask: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubTaskData {
  title: string;
  description?: string;
  done?: boolean;
  startSubtask: string;
  finishSubtask: string;
}

export interface CreateMainTaskData {
  title: string;
  description?: string;
  done?: boolean;
  letter_number?: string;
  letter_date?: string | null;
  due_date?: string | null;
  status?: TaskStatus; 
}

export interface UpdateMainTaskData {
  title?: string;
  description?: string;
  done?: boolean;
  letter_number?: string;
  letter_date?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
}

export interface SubTaskFilters {
  search: string;
  done: string;
}