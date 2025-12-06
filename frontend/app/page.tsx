// app/page.tsx
import { Suspense } from 'react';
import TasksPageContent from './TasksPageContent';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TasksPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TasksPageContent />
    </Suspense>
  );
}