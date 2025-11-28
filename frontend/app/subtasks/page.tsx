'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTasks } from '@/app/hooks/useTasks';
import TaskTable from '@/components/tasks/TaskTable';
import SubTaskModal from '@/components/subTasks/SubTaskModal';
import { CreateSubTaskData, SubTask } from '@/app/types';

export default function SubtasksPage() {
    const { tasks, loading, filters, setFilters, refetch: refetchTasks } = useTasks();

    const [subTaskModalOpen, setSubTaskModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(undefined);
    const [editingSubTask, setEditingSubTask] = useState<SubTask | undefined>(undefined);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleAddSubTask = (taskId: number) => {
        setEditingSubTask(undefined);
        setSelectedTaskId(taskId);
        setSubTaskModalOpen(true);
    };

    const handleEditSubTask = (subTask: SubTask) => {
        setEditingSubTask(subTask);
        setSelectedTaskId(subTask.main_task_id);
        setSubTaskModalOpen(true);
    };

    const handleSaveSubTask = async (data: CreateSubTaskData) => {
        setSaveLoading(true);
        try {
            if (!selectedTaskId) throw new Error('شناسه تسک اصلی مشخص نیست');

            const requestBody = {
                ...data,
                main_task_id: selectedTaskId,
            };

            const url = editingSubTask
                ? `http://localhost:8080/api/subtasks/${editingSubTask.id}`
                : `http://localhost:8080/api/main-tasks/${selectedTaskId}/subtasks`;

            const method = editingSubTask ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error('خطا در ذخیره ساب‌تسک');

            await response.json();
            refetchTasks();

            setSubTaskModalOpen(false);
            setEditingSubTask(undefined);
            setSelectedTaskId(undefined);
        } catch (error) {
            
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    مدیریت ساب تسک‌ها
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                    onClick={() => handleAddSubTask(tasks[0]?.id || 0)}
                >
                    ایجاد ساب تسک جدید
                </Button>
            </Box>

            <TaskTable
                tasks={tasks}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleDone={() => {}}
                onAddSubTask={handleAddSubTask}
                onEditSubTask={handleEditSubTask}
                onDeleteSubTask={() => {}}
                onToggleSubTaskDone={() => {}}
            />

            <SubTaskModal
                open={subTaskModalOpen}
                onClose={() => {
                    setSubTaskModalOpen(false);
                    setEditingSubTask(undefined);
                    setSelectedTaskId(undefined);
                }}
                onSave={handleSaveSubTask}
                loading={saveLoading}
                mainTaskId={selectedTaskId}
                subTask={editingSubTask}
            />
        </Box>
    );
}
