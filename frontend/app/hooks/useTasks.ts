"use client";

import { useState, useEffect } from "react";
import { MainTask } from "@/app/types";
import { toast } from 'react-toastify';

export interface TaskFilters {
    search: string;
    done: string;
}

export function useTasks() {
    const [tasks, setTasks] = useState<MainTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<TaskFilters>({
        search: "",
        done: "",
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/main-tasks");
            
            if (!response.ok) {
                throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
            }
            
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error('خطا در دریافت تسک‌ها', {
                position: "top-left",
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData: Partial<MainTask>) => {
        try {
            const response = await fetch("http://localhost:8080/api/main-tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`خطا در ایجاد تسک: ${response.status} - ${errorText}`);
            }

            const newTask = await response.json();
            setTasks((prev) => [newTask, ...prev]);
            
            toast.success('تسک جدید با موفقیت ایجاد شد', {
                position: "top-left",
                autoClose: 3000,
            });
            
            return newTask;
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error('خطا در ایجاد تسک', {
                position: "top-left",
                autoClose: 4000,
            });
            throw error;
        }
    };

    const updateTask = async (id: number, updates: Partial<MainTask>) => {
        try {
            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`خطا در ویرایش تسک: ${response.status} - ${errorText}`);
            }

            const updatedTask = await response.json();
            setTasks((prev) =>
                prev.map((task) => (task.id === id ? updatedTask : task)),
            );
            
            toast.success('تسک با موفقیت ویرایش شد', {
                position: "top-left",
                autoClose: 3000,
            });
            
            return updatedTask;
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error('خطا در ویرایش تسک', {
                position: "top-left",
                autoClose: 4000,
            });
            throw error;
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`خطا در حذف تسک: ${response.status}`);
            }

            setTasks((prev) => prev.filter((task) => task.id !== id));
            
            toast.success('تسک با موفقیت حذف شد', {
                position: "top-left",
                autoClose: 3000,
            });
            
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error('خطا در حذف تسک', {
                position: "top-left",
                autoClose: 4000,
            });
            throw error;
        }
    };

    const toggleTaskDone = async (id: number, done: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ done }),
            });

            if (!response.ok) {
                throw new Error(`خطا در تغییر وضعیت تسک: ${response.status}`);
            }

            const updatedTask = await response.json();
            setTasks((prev) =>
                prev.map((task) => (task.id === id ? updatedTask : task)),
            );
            
            toast.success(`تسک ${done ? 'انجام شده' : 'در حال انجام'}标记 شد`, {
                position: "top-left",
                autoClose: 3000,
            });
            
            return updatedTask;
        } catch (error) {
            console.error("Error toggling task:", error);
            toast.error('خطا در تغییر وضعیت تسک', {
                position: "top-left",
                autoClose: 4000,
            });
            throw error;
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = !filters.search ||
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(filters.search.toLowerCase()));

        const matchesDone = filters.done === "" || 
            (filters.done === "done" && task.done) ||
            (filters.done === "pending" && !task.done);

        return matchesSearch && matchesDone;
    });

    return {
        tasks: filteredTasks,
        allTasks: tasks,
        loading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        refetch: fetchTasks,
    };
}