"use client";

import { useEffect, useState } from "react";
import
import TaskModal from "@/components/TaskModal";
import { convertToJalali } from "@/utils/dateConverter";
import {}
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

  // ✅ واکشی داده‌ها از سرور
  useEffect(() => {
    fetch("http://localhost:8080/api/main-tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("❌ خطا در واکشی وظایف:", err));
  }, []);

  // ✅ ذخیره یا ویرایش در State بدون نیاز به رفرش صفحه
  const handleSave = (savedTask: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === savedTask.id);
      if (idx === -1) return [savedTask, ...prev];
      const cloned = [...prev];
      cloned[idx] = savedTask;
      return cloned;
    });
  };

  // ✅ حذف وظیفه با تأیید کاربر
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

  // ===== CSS پایه =====
  const headerCell: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    position: "sticky",
    top: 0,
    zIndex: 2,
  };

  const bodyCell: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    verticalAlign: "middle",
    fontFamily: "Tahoma",
    backgroundColor: "#fff",
  };

  const actionButton: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: "4px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontFamily: "Tahoma",
  };

  // ====== JSX رندر ======
  return (
    <div
      dir="rtl"
      style={{
        height: "100vh",
        overflow: "hidden",
        padding: "20px",
        fontFamily: "Tahoma",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>مدیریت وظایف</h2>

      {/* دکمه افزودن وظیفه جدید */}
      <button
        style={{
          backgroundColor: "#0078d4",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          marginBottom: "12px",
        }}
        onClick={() => {
          setSelectedTask(null);
          setModalOpen(true);
        }}
      >
        ➕ تعریف وظیفه جدید
      </button>

      {/* جدول اصلی */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          height: "70vh",
          overflowY: "auto", // ✅ فقط محتوای جدول اسکرول دارد
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            direction: "rtl",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...headerCell, width: "22%" }}>عملیات</th>
              <th style={{ ...headerCell, width: "18%" }}>عنوان</th>
              <th style={{ ...headerCell, width: "12%" }}>شماره نامه</th>
              <th style={{ ...headerCell, width: "14%" }}>تاریخ نامه</th>
              <th style={{ ...headerCell, width: "14%" }}>تاریخ مهلت</th>
              <th style={{ ...headerCell, width: "20%" }}>توضیحات</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "16px" }}>
                  ⚠️ هیچ وظیفه‌ای یافت نشد.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  {/* ستون عملیات */}
                  <td style={bodyCell}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        style={{ ...actionButton, backgroundColor: "#0078d4" }}
                        onClick={() => {
                          setSelectedTask(task);
                          setModalOpen(true);
                        }}
                      >
                        ✏️ ویرایش
                      </button>

                      <button
                        style={{ ...actionButton, backgroundColor: "#4CAF50" }}
                        onClick={() => console.log("🧩 زیرکارها", task.id)}
                      >
                        🧩 زیرکارها
                      </button>

                      <button
                        style={{ ...actionButton, backgroundColor: "#d32f2f" }}
                        onClick={() => handleDelete(task.id)}
                      >
                        🗑 حذف
                      </button>
                    </div>
                  </td>

                  {/* ستون‌های داده */}
                  <td style={bodyCell}>{task.title}</td>
                  <td style={bodyCell}>{task.letter_number ?? "—"}</td>
                  <td style={bodyCell}>
                    {task.letter_date ? convertToJalali(task.letter_date) : "—"}
                  </td>
                  <td style={bodyCell}>
                    {task.due_date ? convertToJalali(task.due_date) : "—"}
                  </td>
                  <td style={bodyCell}>{task.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مودال */}
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
