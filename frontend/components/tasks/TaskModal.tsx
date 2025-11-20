'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
} from '@mui/material';
import {
    Close as CloseIcon,
} from '@mui/icons-material';
import TaskForm from './TaskForm';
import { MainTask } from '@/app/types';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    task?: MainTask;
    onSave: (taskData: Partial<MainTask>) => Promise<void>;
    loading?: boolean;
}

export default function TaskModal({ open, onClose, task, onSave, loading = false }: TaskModalProps) {
    const handleSubmit = async (formData: Partial<MainTask>) => {
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh', // محدودیت ارتفاع
                    margin: 2, // فاصله از edge
                },
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ fontWeight: 600 }}>
                    {task ? 'ویرایش تسک' : 'ایجاد تسک جدید'}
                </Box>
                <IconButton 
                    onClick={onClose} 
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ 
                pt: 3, 
                pb: 2,
                overflow: 'hidden', // غیرفعال کردن اسکرول داخلی
            }}>
                <TaskForm
                    task={task}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={loading}
                >
                    انصراف
                </Button>
                <Button
                    type="submit"
                    form="task-form"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'در حال ذخیره...' : (task ? 'ویرایش' : 'ایجاد')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}