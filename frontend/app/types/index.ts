export interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed" | "cancelled";
    priority: "low" | "medium" | "high";
    dueDate: string;
    letterNumber?: string;
    letterDate?: string;
    assignee: string;
    tags: string[];
    subTasks: SubTask[];
    createdAt: string;
    updatedAt: string;
}

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
}

export interface TaskFilters {
    search: string;
    status: string;
    priority: string;
    assignee: string;
}
