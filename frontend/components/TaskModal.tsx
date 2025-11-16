"use client";

import React, { useEffect, useState } from "react";
import { toGregorian, toJalaali } from "jalaali-js";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

interface Task {
  id?: number;
  title: string;
  description: string;
  letter_number: string | null;
  letter_date: string | null;
  due_date: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  editTask: Task | null;
  onSaved: (task: Task) => void;
}

const TaskModal: React.FC<Props> = ({ open, onClose, editTask, onSaved }) => {
  const [title, setTitle] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [description, setDescription] = useState("");
  const [letterDate, setLetterDate] = useState<any>(null);
  const [dueDate, setDueDate] = useState<any>(null);
  const [portalReady, setPortalReady] = useState(false);

  // فعال شدن portal بعد از mount
  useEffect(() => {
    setPortalReady(true);
  }, []);

  // بارگذاری داده‌های هنگام ویرایش
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setLetterNumber(editTask.letter_number ?? "");
      setDescription(editTask.description);
      setLetterDate(editTask.letter_date ? rfcToJalaliObj(editTask.letter_date) : null);
      setDueDate(editTask.due_date ? rfcToJalaliObj(editTask.due_date) : null);
    } else {
      setTitle("");
      setLetterNumber("");
      setDescription("");
      setLetterDate(null);
      setDueDate(null);
    }
  }, [editTask]);

  /** ✅ تبدیل جلالی ⇢ میلادی ⇢ RFC3339 به وقت تهران (UTC+3:30)
   * با ساعت ثابت "۱۲ ظهر" برای جلوگیری از افتادن به روز قبل */
  const jalaliToRFC = (dateObj: any): string | null => {
    if (!dateObj) return null;
    const g = toGregorian(dateObj.year, dateObj.month, dateObj.day);
    const utcNoon = new Date(Date.UTC(g.gy, g.gm - 1, g.gd, 12, 0, 0)); // ۱۲ ظهر UTC
    return utcNoon.toISOString();
  };

  /** ✅ تبدیل RFC3339 ⇢ جلالی، با تصحیح منطقه زمانی */
  const rfcToJalaliObj = (rfc: string | null): any => {
    if (!rfc) return null;
    const d = new Date(rfc);
    const localTime = new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 3.5 * 3600000); // برای تهران
    const j = toJalaali(localTime.getFullYear(), localTime.getMonth() + 1, localTime.getDate());
    return { year: j.jy, month: j.jm, day: j.jd };
  };

  /** ذخیره وظیفه در سرور */
  const handleSave = async () => {
    const payload = {
      title: title.trim(),
      description: description.trim(),
      letter_number: letterNumber.trim() || null,
      letter_date: jalaliToRFC(letterDate),
      due_date: jalaliToRFC(dueDate),
    };

    const url = editTask
      ? `http://localhost:8080/api/main-tasks/${editTask.id}`
      : "http://localhost:8080/api/main-tasks";

    const method = editTask ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      onSaved(result);
      onClose();
    } catch (err) {
      console.error("❌ خطا در ذخیره وظیفه:", err);
      alert("خطا در ذخیره اطلاعات!");
    }
  };

  if (!open) return null;

  /** 🎨 استایل‌ها */
  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const boxStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "22px",
    width: "460px",
    direction: "rtl",
    fontFamily: "Tahoma",
    overflow: "visible", // اجازه نمایش کامل تقویم
    position: "relative",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    fontFamily: "Tahoma",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  return (
    <div style={backdropStyle}>
      <div style={boxStyle}>
        <h3 style={{ marginBottom: "14px" }}>
          {editTask ? "✏️ ویرایش وظیفه" : "➕ افزودن وظیفه"}
        </h3>

        <label>عنوان:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <label>شماره نامه:</label>
        <input
          value={letterNumber}
          onChange={(e) => setLetterNumber(e.target.value)}
          style={inputStyle}
        />

        {/* 🎯 دو فیلد تاریخ در یک ردیف */}
        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label>تاریخ نامه:</label>
            <DatePicker
              value={letterDate}
              onChange={setLetterDate}
              locale="fa"
              inputPlaceholder="انتخاب کنید"
              shouldHighlightWeekends
              calendarPopperPosition="bottom"
              portalContainer={portalReady ? document.body : null}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>مهلت انجام:</label>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              locale="fa"
              inputPlaceholder="انتخاب کنید"
              shouldHighlightWeekends
              calendarPopperPosition="bottom"
              portalContainer={portalReady ? document.body : null}
            />
          </div>
        </div>

        <label>توضیحات:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "70px" }}
        />

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#0078d4",
              color: "white",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              marginLeft: "8px",
            }}
          >
            💾 ذخیره
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#777",
              color: "white",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ❌ بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
