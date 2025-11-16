"use client";
import React, { useState } from "react";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import "@/styles/calendar-override.css"; // اگر override داری، بیاور

const CalendarStandaloneTest = () => {
  const [selectedDate, setSelectedDate] = useState<any>(null);

  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        direction: "rtl",
        fontFamily: "Tahoma",
      }}
    >
      <h2>🗓 تست نمایش تقویم شمسی</h2>

      <div
        style={{
          width: "260px",
          textAlign: "center",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <label>تاریخ مورد نظر:</label>
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          locale="fa"
          inputPlaceholder="انتخاب کنید"
          shouldHighlightWeekends
          wrapperClassName="calendar-wrapper"
          calendarPopperPosition="bottom"
          portalContainer={typeof document !== "undefined" ? document.body : undefined}
        />

        <p style={{ marginTop: "10px" }}>
          انتخاب شما:{" "}
          {selectedDate
            ? `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`
            : "هیچ تاریخی انتخاب نشده"}
        </p>
      </div>
    </div>
  );
};

export default CalendarStandaloneTest;
