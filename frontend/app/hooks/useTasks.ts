"use client";

import { MainTask, TaskStatus } from "@/app/types";
import { useTasksContext } from "@/app/context/TasksContext";
import { useState, useCallback, useMemo } from "react";

export interface TaskFilters {
    search: string;
    done: string;
    status: string;
}

export function useTasks() {
    const { allTasks, setAllTasks, loading, setLoading } = useTasksContext();

    const [filters, setFilters] = useState<TaskFilters>({
        search: "",
        done: "",
        status: "",
    });

    // محاسبه pendingCount با useMemo
    const pendingCount = useMemo(() => {
        return allTasks.filter(task => !task.done).length;
    }, [allTasks]);

    // محاسبه completedCount با useMemo
    const completedCount = useMemo(() => {
        return allTasks.filter(task => task.done).length;
    }, [allTasks]);

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

            setAllTasks(prevTasks => 
                prevTasks.map(task => task.id === id ? updatedTask : task)
            );

            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }, [setAllTasks]);

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

            setAllTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === id ? { ...task, done: done } : task
                )
            );

            console.log('🟢 Task state updated - taskId:', id, 'new done:', done);

            return updatedTask;
        } catch (error) {
            console.error('Error toggling task done:', error);
            throw error;
        }
    }, [setAllTasks]);

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
            
            return newTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }, [setAllTasks]);

    const deleteTask = useCallback(async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`خطا در حذف تسک: ${response.status}`);
            }

            setAllTasks(prev => prev.filter(task => task.id !== id));
        
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }, [setAllTasks]);

    const filteredTasks = useMemo(() => {
        return allTasks.filter((task) => {
            const matchesSearch = !filters.search ||
                task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(filters.search.toLowerCase()));

            const matchesDone = filters.done === "" || 
                (filters.done === "done" && task.done) ||
                (filters.done === "pending" && !task.done);

            const matchesStatus = filters.status === "" || 
                task.status === filters.status;

            return matchesSearch && matchesDone && matchesStatus;
        });
    }, [allTasks, filters]);

    return {
        tasks: filteredTasks,    
        allTasks: allTasks,      
        pendingCount,
        completedCount,
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