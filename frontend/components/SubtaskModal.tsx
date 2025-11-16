"use client";
import React from "react";

interface SubtaskModalProps {
  open: boolean;
  onClose: () => void;
  taskId: number | null;
}

const SubtaskModal: React.FC<SubtaskModalProps> = ({ open, onClose, taskId }) => {
  if (!open) return null;

  /** 🎨 Styleها — هماهنگ با TaskModal و ساختار پروژه */
  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9998, // 👈 کمتر از تقویم (در آینده)
    direction: "rtl",
    fontFamily: "Tahoma",
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "440px",
    textAlign: "center",
    boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
    overflow: "visible",
  };

  const closeBtnStyle: React.CSSProperties = {
    marginTop: "22px",
    padding: "8px 16px",
    backgroundColor: "#0078d4",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "Tahoma",
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: "14px", fontSize: "20px" }}>📋 زیرکارهای وظیفه</h2>
        <p>
          آی‌دی وظیفه انتخاب‌شده:{" "}
          <b style={{ color: "#0078d4" }}>{taskId ?? "—"}</b>
        </p>

        <p
          style={{
            marginTop: "16px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          در گام بعد جدول و فرم زیرکارها اضافه خواهد شد.
        </p>

        <button onClick={onClose} style={closeBtnStyle}>
          ❌ بستن
        </button>
      </div>
    </div>
  );
};

export default SubtaskModal;
