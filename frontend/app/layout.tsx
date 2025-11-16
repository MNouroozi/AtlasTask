import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
    import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
    
    // 2. استایل‌های سفارشی شما (مهم: باید بعد از اصلی باشد)
    import '@/styles/calendar-override.css';

// 📦 استایل‌های سراسری پروژه (اول)
// import "@/styles/globals.css";

// 📅 CSS مخصوص تقویم شمسی (پس از استایل عمومی، یک‌بار ایمپورت شود)


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AtlasTask",
  description: "مدیریت وظایف و زیرکارها - نسخه Next + Golang",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // 🔑 جهت راست‌به‌چپ برای فارسی
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          fontFamily: "Tahoma, sans-serif",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
