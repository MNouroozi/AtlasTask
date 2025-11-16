import React from 'react';

interface Task {
  id: number;
  title: string;
  letter_number?: string;
  letter_date?: string;
  due_date?: string;
  description?: string;
}

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'Tahoma',
        backgroundColor: 'white',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '12px', border: '1px solid #ddd' }}>عنوان</th>
          <th style={{ padding: '12px', border: '1px solid #ddd' }}>شماره نامه</th>
          <th style={{ padding: '12px', border: '1px solid #ddd' }}>تاریخ نامه</th>
          <th style={{ padding: '12px', border: '1px solid #ddd' }}>تاریخ سررسید</th>
          <th style={{ padding: '12px', border: '1px solid #ddd' }}>توضیحات</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
              هیچ وظیفه‌ای ثبت نشده است.
            </td>
          </tr>
        ) : (
          tasks.map((t) => (
            <tr key={t.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{t.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{t.letter_number || '—'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{t.letter_date || '—'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{t.due_date || '—'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{t.description || '—'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
