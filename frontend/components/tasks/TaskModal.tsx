'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    IconButton,
    TextField,
    InputAdornment,
    Typography,
    FormControlLabel,
    Checkbox,
    Chip,
} from '@mui/material';
import { 
    Close as CloseIcon, 
    CalendarToday,
    Description,
    Title as TitleIcon,
    Numbers,
    Edit as EditIcon,
    Save as SaveIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import DatePicker from 'react-multi-date-picker';
import type { Value } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { MainTask } from '@/app/types';
import { toast } from 'react-toastify';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    task?: MainTask;
    onSave: (taskData: Partial<MainTask>) => Promise<void>;
    loading?: boolean;
}

export default function TaskModal({ open, onClose, task, onSave, loading = false }: TaskModalProps) {
    const [selectedDueDate, setSelectedDueDate] = useState<Value>(null);
    const [selectedLetterDate, setSelectedLetterDate] = useState<Value>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        letter_number: '',
        done: false,
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                letter_number: task.letter_number || '',
                done: task.done || false,
            });
            setSelectedDueDate(task.due_date ? new Date(task.due_date) : null);
            setSelectedLetterDate(task.letter_date ? new Date(task.letter_date) : null);
        } else {
            setFormData({
                title: '',
                description: '',
                letter_number: '',
                done: false,
            });
            setSelectedDueDate(null);
            setSelectedLetterDate(null);
        }
    }, [task, open]);

    const convertToGregorian = (date: Value): string | null => {
        if (!date) return null;
        try {
            const persianDate = new Date(date.toString());
            const gregorianDate = new Date(persianDate);
            return !isNaN(gregorianDate.getTime()) ? gregorianDate.toISOString() : null;
        } catch (error) {
            console.error('Error converting date:', error);
            return null;
        }
    };

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.error('عنوان تسک الزامی است');
            return;
        }

        try {
            const taskData: Partial<MainTask> = {
                ...formData,
                due_date: convertToGregorian(selectedDueDate),
                letter_date: convertToGregorian(selectedLetterDate),
            };
            
            if (task?.id) {
                taskData.id = task.id;
            }
            
            await onSave(taskData);
            
            toast.success(task ? 'تسک با موفقیت ویرایش شد' : 'تسک جدید ایجاد شد');
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error('خطا در ذخیره تسک');
        }
    };

    const CustomDateInput = ({ value, onChange, onFocus, onBlur, placeholder }: any) => (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'primary.main', fontSize: 18 }} />
                    </InputAdornment>
                ),
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                }
            }}
        />
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                },
            }}
        >
            {/* هدر مودال - کوچک‌تر */}
            <DialogTitle sx={{ 
                p: 2, 
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditIcon color="primary" sx={{ fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {task ? 'ویرایش تسک' : 'تسک جدید'}
                    </Typography>
                    {task && (
                        <Chip 
                            label={task.done ? 'تکمیل شده' : 'در حال انجام'} 
                            color={task.done ? 'success' : 'warning'}
                            size="small"
                        />
                    )}
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* عنوان */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TitleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            عنوان تسک *
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            placeholder="عنوان تسک را وارد کنید"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                }
                            }}
                        />
                    </Box>

                    {/* توضیحات */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Description sx={{ fontSize: 18, color: 'primary.main' }} />
                            توضیحات
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={handleInputChange('description')}
                            placeholder="توضیحات تسک"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                }
                            }}
                        />
                    </Box>

                    {/* بخش تاریخ‌ها و اطلاعات */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* تاریخ‌ها */}
                        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                تاریخ‌ها
                            </Typography>
                            
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                    تاریخ سررسید
                                </Typography>
                                <DatePicker
                                    value={selectedDueDate}
                                    onChange={setSelectedDueDate}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    format="YYYY/MM/DD"
                                    render={<CustomDateInput placeholder="تاریخ سررسید" />}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                                    تاریخ نامه
                                </Typography>
                                <DatePicker
                                    value={selectedLetterDate}
                                    onChange={setSelectedLetterDate}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    format="YYYY/MM/DD"
                                    render={<CustomDateInput placeholder="تاریخ نامه" />}
                                />
                            </Box>
                        </Box>

                        {/* اطلاعات جانبی */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Numbers sx={{ fontSize: 18, color: 'primary.main' }} />
                                    شماره نامه
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={formData.letter_number}
                                    onChange={handleInputChange('letter_number')}
                                    placeholder="شماره نامه"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1.5,
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={formData.done}
                                            onChange={handleInputChange('done')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            انجام شده
                                        </Typography>
                                    }
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            {/* فوتر مودال */}
            <Box sx={{ 
                p: 2, 
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
            }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={loading}
                    sx={{
                        borderRadius: 1.5,
                        px: 3,
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    انصراف
                </Button>
                
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.title.trim()}
                    startIcon={task ? <SaveIcon /> : <AddIcon />}
                    sx={{
                        borderRadius: 1.5,
                        px: 3,
                        fontWeight: 600,
                    }}
                >
                    {loading ? 'در حال ذخیره...' : (task ? 'ذخیره' : 'ایجاد')}
                </Button>
            </Box>
        </Dialog>
    );
}