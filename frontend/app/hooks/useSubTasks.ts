"use client";

import { useState, useEffect } from "react";

export interface SubTask {
  id: number;
  main_task_id: number;
  title: string;
  done: boolean;
  startSubtask: string;
  finishSubtask: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubTaskData {
  title: string;
  done?: boolean;
  startSubtask: string;
  finishSubtask: string;
}

export interface SubTaskFilters {
  search: string;
  done: string;
}

export function useSubTasks(mainTaskId?: number) {
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SubTaskFilters>({
    search: "",
    done: "",
  });

  useEffect(() => {
    if (mainTaskId) {
      fetchSubTasks();
    }
  }, [mainTaskId]);

  const fetchSubTasks = async () => {
    if (!mainTaskId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/main-tasks/${mainTaskId}/subtasks`
      );

      if (!response.ok) {
        throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
      }

      const data = await response.json();
      setSubTasks(data);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSubTask = async (subTaskData: CreateSubTaskData) => {
    if (!mainTaskId) {
      throw new Error("mainTaskId is required to create a subtask");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/main-tasks/${mainTaskId}/subtasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subTaskData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطا در ایجاد ساب‌تسک: ${response.status} - ${errorText}`);
      }

      const newSubTask = await response.json();
      setSubTasks((prev) => [newSubTask, ...prev]);

      return newSubTask;
    } catch (error) {
      console.error("Error creating subtask:", error);
      throw error;
    }
  };

  const updateSubTask = async (id: number, updates: Partial<SubTask>) => {
    try {
      const response = await fetch(`http://localhost:8080/api/subtasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطا در ویرایش ساب‌تسک: ${response.status} - ${errorText}`);
      }

      const updatedSubTask = await response.json();
      setSubTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedSubTask : task))
      );

      return updatedSubTask;
    } catch (error) {
      console.error("Error updating subtask:", error);
      throw error;
    }
  };

  const deleteSubTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/subtasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`خطا در حذف ساب‌تسک: ${response.status}`);
      }

      setSubTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting subtask:", error);
      throw error;
    }
  };

  const toggleSubTaskDone = async (id: number, done: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/api/subtasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done }),
      });

      if (!response.ok) {
        throw new Error(`خطا در تغییر وضعیت ساب‌تسک: ${response.status}`);
      }

      const updatedSubTask = await response.json();
      setSubTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedSubTask : task))
      );

      return updatedSubTask;
    } catch (error) {
      console.error("Error toggling subtask:", error);
      throw error;
    }
  };

  const filteredSubTasks = subTasks.filter((task) => {
    const matchesSearch = !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase());

    const matchesDone = filters.done === "" || 
      (filters.done === "done" && task.done) ||
      (filters.done === "pending" && !task.done);

    return matchesSearch && matchesDone;
  });

  return {
    subTasks: filteredSubTasks,
    allSubTasks: subTasks,
    loading,
    filters,
    setFilters,
    createSubTask,
    updateSubTask,
    deleteSubTask,
    toggleSubTaskDone,
    refetch: fetchSubTasks,
  };
}