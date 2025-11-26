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

    useEffect(() => {
        fetchTasks();
        fetchPendingTasks();
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
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingTasks = async () => {
        try {
            setPendingLoading(true);
            const response = await fetch("http://localhost:8080/api/main-tasks/pending");
            
            if (!response.ok) {
                throw new Error(`خطا در دریافت تسک‌های در انتظار: ${response.status}`);
            }
            
            const data = await response.json();
            setPendingTasks(data.tasks || []);
            setPendingCount(data.pending_count || 0);
        } catch (error) {
            console.error("Error fetching pending tasks:", error);
        } finally {
            setPendingLoading(false);
        }
    };

    const updateTask = useCallback(async (id: number, updates: Partial<MainTask>) => {
        try {
            console.log("🔄 Updating task:", id, updates);
            
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
            console.log("✅ Updated task received:", updatedTask);

            // آپدیت allTasks
            setAllTasks(prevTasks => {
                const newTasks = prevTasks.map(task => 
                    task.id === id ? updatedTask : task
                );
                console.log("📝 New allTasks:", newTasks);
                return newTasks;
            });

            // آپدیت pending tasks
            setPendingTasks(prevPending => {
                if (updatedTask.done) {
                    const newPending = prevPending.filter(task => task.id !== id);
                    console.log("❌ Removed from pending:", newPending);
                    return newPending;
                } else {
                    const existingIndex = prevPending.findIndex(task => task.id === id);
                    if (existingIndex >= 0) {
                        const newPending = [...prevPending];
                        newPending[existingIndex] = updatedTask;
                        console.log("✏️ Updated in pending:", newPending);
                        return newPending;
                    } else {
                        const newPending = [updatedTask, ...prevPending];
                        console.log("➕ Added to pending:", newPending);
                        return newPending;
                    }
                }
            });

            // آپدیت pending count
            setPendingCount(prevCount => {
                const currentTask = allTasks.find(task => task.id === id);
                let newCount = prevCount;
                
                if (currentTask && currentTask.done !== updatedTask.done) {
                    newCount = updatedTask.done ? Math.max(0, prevCount - 1) : prevCount + 1;
                    console.log("🔢 New pending count:", newCount);
                }
                
                return newCount;
            });

            return updatedTask;
        } catch (error) {
            console.error("❌ Error updating task:", error);
            throw error;
        }
    }, [allTasks]);

    const toggleTaskDone = useCallback(async (id: number, done: boolean) => {
        console.log("🎯 Toggle task:", id, "to:", done);
        return updateTask(id, { done });
    }, [updateTask]);

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
            
            setAllTasks(prev => [newTask, ...prev]);
            
            if (!newTask.done) {
                setPendingTasks(prev => [newTask, ...prev]);
                setPendingCount(prev => prev + 1);
            }
            
            return newTask;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    }, []);

    const deleteTask = useCallback(async (id: number) => {
        try {
            const taskToDelete = allTasks.find(task => task.id === id);
            const wasPending = taskToDelete && !taskToDelete.done;

            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`خطا در حذف تسک: ${response.status}`);
            }

            setAllTasks(prev => prev.filter(task => task.id !== id));
            
            if (wasPending) {
                setPendingTasks(prev => prev.filter(task => task.id !== id));
                setPendingCount(prev => Math.max(0, prev - 1));
            }
        
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    }, [allTasks]);

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
        tasks: filteredTasks,    // تسک‌های فیلتر شده برای جدول
        allTasks: allTasks,      // همه تسک‌ها برای سایدبار
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
        refetchPending: fetchPendingTasks,
    };
}