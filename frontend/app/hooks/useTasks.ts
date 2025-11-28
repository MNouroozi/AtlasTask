"use client";

import { useState, useEffect, useCallback } from "react";
import { MainTask } from "@/app/types";

export interface TaskFilters {
    search: string;
    done: string;
}

export function useTasks() {
    const [allTasks, setAllTasks] = useState<MainTask[]>([]);
    const [pendingTasks, setPendingTasks] = useState<MainTask[]>([]);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [pendingLoading, setPendingLoading] = useState(false);
    const [filters, setFilters] = useState<TaskFilters>({
        search: "",
        done: "",
    });

    // تابع برای محاسبه pendingCount از allTasks
    const calculatePendingCount = useCallback((tasks: MainTask[]) => {
        return tasks.filter(task => !task.done).length;
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/main-tasks");
            
            if (!response.ok) {
                throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
            }
            
            const data = await response.json();
            setAllTasks(data);
            // محاسبه pendingCount از داده‌های دریافت شده
            setPendingCount(calculatePendingCount(data));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateTask = useCallback(async (id: number, updates: Partial<MainTask>) => {
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

            // فقط یک بار setAllTasks فراخوانی شود
            setAllTasks(prevTasks => {
                const newTasks = prevTasks.map(task => 
                    task.id === id ? updatedTask : task
                );
                // محاسبه pendingCount جدید
                const newPendingCount = calculatePendingCount(newTasks);
                setPendingCount(newPendingCount);
                return newTasks;
            });

            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }, [calculatePendingCount]);

    const toggleTaskDone = useCallback(async (id: number, done: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ done }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`خطا در تغییر وضعیت تسک: ${response.status} - ${errorText}`);
            }

            const updatedTask = await response.json();

            // به‌روزرسانی state
            setAllTasks(prevTasks => {
                const newTasks = prevTasks.map(task => 
                    task.id === id ? updatedTask : task
                );
                const newPendingCount = calculatePendingCount(newTasks);
                setPendingCount(newPendingCount);
                return newTasks;
            });

            return updatedTask;
        } catch (error) {
            console.error('Error toggling task done:', error);
            throw error;
        }
    }, [calculatePendingCount]);

    const createTask = useCallback(async (taskData: Partial<MainTask>) => {
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
            
            // به‌روزرسانی allTasks و pendingCount
            setAllTasks(prev => {
                const newTasks = [newTask, ...prev];
                const newPendingCount = calculatePendingCount(newTasks);
                setPendingCount(newPendingCount);
                return newTasks;
            });
            
            return newTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }, [calculatePendingCount]);

    const deleteTask = useCallback(async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`خطا در حذف تسک: ${response.status}`);
            }

            // به‌روزرسانی allTasks و pendingCount
            setAllTasks(prev => {
                const newTasks = prev.filter(task => task.id !== id);
                const newPendingCount = calculatePendingCount(newTasks);
                setPendingCount(newPendingCount);
                return newTasks;
            });
        
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }, [calculatePendingCount]);

    const filteredTasks = allTasks.filter((task) => {
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
        allTasks: allTasks,      
        pendingTasks,
        pendingCount,
        loading,
        pendingLoading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        refetch: fetchTasks,
    };
}