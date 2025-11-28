// app/context/TasksContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MainTask } from '@/app/types';

interface TasksContextType {
  allTasks: MainTask[];
  setAllTasks: React.Dispatch<React.SetStateAction<MainTask[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [allTasks, setAllTasks] = useState<MainTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/main-tasks");
        
        if (!response.ok) {
          throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
        }
        
        const data = await response.json();
        setAllTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ allTasks, setAllTasks, loading, setLoading }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
}