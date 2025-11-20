"use client";

import { useState, useEffect } from "react";
import { Task, TaskFilters } from "@/types";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<TaskFilters>({
        search: "",
        status: "",
        priority: "",
        assignee: "",
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:8080/api/main-tasks",
            );
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData: Partial<Task>) => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/main-tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(taskData),
                },
            );

            if (!response.ok) throw new Error("خطا در ایجاد تسک");

            const newTask = await response.json();
            setTasks((prev) => [newTask, ...prev]);
            return newTask;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/main-tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updates),
                },
            );

            if (!response.ok) throw new Error("خطا در ویرایش تسک");

            const updatedTask = await response.json();
            setTasks((prev) =>
                prev.map((task) => (task.id === id ? updatedTask : task)),
            );
            return updatedTask;
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/main-tasks/${id}`,
                {
                    method: "DELETE",
                },
            );

            if (!response.ok) throw new Error("خطا در حذف تسک");

            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            !filters.search ||
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.description
                .toLowerCase()
                .includes(filters.search.toLowerCase());

        const matchesStatus = !filters.status || task.status === filters.status;
        const matchesPriority =
            !filters.priority || task.priority === filters.priority;
        const matchesAssignee =
            !filters.assignee || task.assignee.includes(filters.assignee);

        return (
            matchesSearch && matchesStatus && matchesPriority && matchesAssignee
        );
    });

    return {
        tasks: filteredTasks,
        loading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        refetch: fetchTasks,
    };
}
