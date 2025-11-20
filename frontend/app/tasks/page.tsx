"use client";

import { useEffect, useState } from "react";
import TaskModal from "@/components/TaskModal";
import { convertToJalali } from "@/utils/dateConverter";
import styles from "./TasksPage.module.css";

interface Task {
    id: number;
    title: string;
    description: string;
    letter_number: string | null;
    letter_date: string | null;
    due_date: string | null;
    created_at?: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/main-tasks");
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error("خطا در واکشی وظایف:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = (savedTask: Task) => {
        setTasks((prev) => {
            const idx = prev.findIndex((t) => t.id === savedTask.id);
            if (idx === -1) return [savedTask, ...prev];
            const cloned = [...prev];
            cloned[idx] = savedTask;
            return cloned;
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("آیا از حذف این وظیفه مطمئن هستید؟")) return;
        try {
            await fetch(`http://localhost:8080/api/main-tasks/${id}`, {
                method: "DELETE",
            });
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error("خطا در حذف:", err);
        }
    };

    if (loading) {
        return <div className={styles.loading}>در حال بارگذاری...</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>مدیریت وظایف</h2>

            <button
                className={styles.addButton}
                onClick={() => {
                    setSelectedTask(null);
                    setModalOpen(true);
                }}
            >
                ➕ تعریف وظیفه جدید
            </button>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th
                                className={styles.headerCell}
                                style={{ width: "22%" }}
                            >
                                عملیات
                            </th>
                            <th
                                className={styles.headerCell}
                                style={{ width: "18%" }}
                            >
                                عنوان
                            </th>
                            <th
                                className={styles.headerCell}
                                style={{ width: "12%" }}
                            >
                                شماره نامه
                            </th>
                            <th
                                className={styles.headerCell}
                                style={{ width: "14%" }}
                            >
                                تاریخ نامه
                            </th>
                            <th
                                className={styles.headerCell}
                                style={{ width: "14%" }}
                            >
                                تاریخ مهلت
                            </th>
                            <th
                                className={styles.headerCell}
                                style={{ width: "20%" }}
                            >
                                توضیحات
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.noData}>
                                    ⚠️ هیچ وظیفه‌ای یافت نشد.
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id} className={styles.tableRow}>
                                    <td className={styles.bodyCell}>
                                        <div className={styles.actions}>
                                            <button
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setModalOpen(true);
                                                }}
                                            >
                                                ✏️ ویرایش
                                            </button>

                                            <button
                                                className={`${styles.actionButton} ${styles.subtaskButton}`}
                                                onClick={() =>
                                                    console.log(
                                                        "🧩 زیرکارها",
                                                        task.id,
                                                    )
                                                }
                                            >
                                                🧩 زیرکارها
                                            </button>

                                            <button
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                            >
                                                🗑 حذف
                                            </button>
                                        </div>
                                    </td>

                                    <td className={styles.bodyCell}>
                                        {task.title}
                                    </td>
                                    <td className={styles.bodyCell}>
                                        {task.letter_number ?? "—"}
                                    </td>
                                    <td className={styles.bodyCell}>
                                        {task.letter_date
                                            ? convertToJalali(task.letter_date)
                                            : "—"}
                                    </td>
                                    <td className={styles.bodyCell}>
                                        {task.due_date
                                            ? convertToJalali(task.due_date)
                                            : "—"}
                                    </td>
                                    <td className={styles.bodyCell}>
                                        {task.description}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <TaskModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    editTask={selectedTask}
                    onSaved={handleSave}
                />
            )}
        </div>
    );
}
