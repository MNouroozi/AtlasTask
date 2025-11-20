'use client';

import { useState, useEffect } from 'react';
import {
    TextField,
    Box,
} from '@mui/material';
import { MainTask } from '@/app/types';

interface TaskFormProps {
    task?: MainTask;
    onSubmit: (data: Partial<MainTask>) => void;
    onCancel: () => void;
}

interface FormData {
    title: string;
    description: string;
    letter_number: string;
    letter_date: string | null;
    due_date: string | null;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        letter_number: '',
        letter_date: null,
        due_date: null,
    });

    useEffect(() => {
        const initializeForm = () => {
            if (task) {
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    letter_number: task.letter_number || '',
                    letter_date: task.letter_date,
                    due_date: task.due_date,
                });
            }
        };

        const timer = setTimeout(initializeForm, 0);
        return () => clearTimeout(timer);
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData: Partial<MainTask> = {
            title: formData.title,
            description: formData.description,
            letter_number: formData.letter_number,
            letter_date: formData.letter_date,
            due_date: formData.due_date,
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} id="task-form">
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
            }}>
                {/* عنوان تسک */}
                <TextField
                    label="عنوان تسک *"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />

                {/* توضیحات */}
                <TextField
                    label="توضیحات"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />

                {/* شماره نامه و تاریخ نامه */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="شماره نامه"
                        value={formData.letter_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, letter_number: e.target.value }))}
                        size="small"
                        sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                        placeholder="شماره نامه ارجاع"
                    />

                    <TextField
                        label="تاریخ نامه"
                        type="date"
                        value={formData.letter_date || ''}
                        onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            letter_date: e.target.value || null 
                        }))}
                        size="small"
                        sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                {/* تاریخ مهلت اقدام */}
                <TextField
                    label="تاریخ مهلت اقدام"
                    type="date"
                    value={formData.due_date || ''}
                    onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        due_date: e.target.value || null 
                    }))}
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
        </form>
    );
}