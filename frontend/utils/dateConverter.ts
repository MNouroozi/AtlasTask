// utils/dateConverter.ts
import { toJalaali, toGregorian } from "jalaali-js";

// تبدیل از RFC3339 به جلالی خوانا
export function convertToJalali(rfcDate: string): string {
  if (!rfcDate) return "";
  const date = new Date(rfcDate);
  // اصلاح منطقه زمانی تهران
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const g = { gy: date.getFullYear(), gm: date.getMonth() + 1, gd: date.getDate() };
  const j = toJalaali(g.gy, g.gm, g.gd);
  return `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd.toString().padStart(2, "0")}`;
}

// تبدیل از شمسی به RFC3339 (جهت ارسال به بک‌اند)
export function convertToRFC3339(jalaliDate: string): string {
  if (!jalaliDate) return "";
  const [jy, jm, jd] = jalaliDate.split("/").map(Number);
  const g = toGregorian(jy, jm, jd);
  const isoString = new Date(Date.UTC(g.gy, g.gm - 1, g.gd, 3, 30)).toISOString(); // تنظیم UTC برای تهران
  return isoString;
}
