// lib/api.ts
/**
 * ماژول ارتباط با API بک‌اند Golang
 * شامل توابع CRUD برای MainTask
 */

const BASE_URL = 'http://localhost:8080/api';

// دریافت همه وظایف اصلی
export async function getMainTasks() {
  const res = await fetch(`${BASE_URL}/main-tasks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('خطا در دریافت وظایف');
  return res.json();
}

// ایجاد یک وظیفه جدید
export async function createMainTask(task: {
  title: string;
  letter_number: string;
  letter_date: string;
  due_date: string;
}) {
  const res = await fetch(`${BASE_URL}/main-tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Response Error:', text);
    throw new Error('❌ خطا در ایجاد وظیفه');
  }

  return res.json();
}

// حذف وظیفه (اختیاری برای مراحل بعد)
export async function deleteMainTask(id: number) {
  const res = await fetch(`${BASE_URL}/main-tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('خطا در حذف وظیفه');
  return res.json();
}

// ویرایش وظیفه (اختیاری برای مرحله بعد)
export async function updateMainTask(id: number, updates: any) {
  const res = await fetch(`${BASE_URL}/main-tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('خطا در ویرایش وظیفه');
  return res.json();
}
