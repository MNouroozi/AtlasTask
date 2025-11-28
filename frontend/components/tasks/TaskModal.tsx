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
    Paper,
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
import { convertToGregorian, formatDateForPicker } from '@/lib/dateConverter';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    task?: MainTask;
    onSave: (taskData: Partial<MainTask>) => Promise<void>;
    loading?: boolean;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

export default function TaskModal({ 
    open, 
    onClose, 
    task, 
    onSave, 
    loading = false,
    primaryColor = '#3b82f6',
    backgroundColor = '#ffffff',
    textColor = '#1e293b'
}: TaskModalProps) {
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
            
            setSelectedDueDate(task.due_date ? formatDateForPicker(task.due_date) : null);
            setSelectedLetterDate(task.letter_date ? formatDateForPicker(task.letter_date) : null);
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

    
    const modalConfig = task ? {
        headerColor: '#f59e0b',
        headerBackground: `linear-gradient(135deg, #f59e0b08 0%, #f59e0b03 100%)`,
        iconBackground: '#f59e0b15',
        borderColor: '#f59e0b15',
        buttonColor: '#f59e0b',
    } : {
        headerColor: '#3b82f6',
        headerBackground: `linear-gradient(135deg, #3b82f608 0%, #3b82f603 100%)`,
        iconBackground: '#3b82f615',
        borderColor: '#3b82f615',
        buttonColor: '#3b82f6',
    };

    
    const dynamicStyles = {
        dialogPaper: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            background: backgroundColor,
            border: `1px solid ${modalConfig.borderColor}`,
        },
        header: {
            background: modalConfig.headerBackground,
            borderBottom: `1px solid ${modalConfig.borderColor}`,
        },
        primaryButton: {
            backgroundColor: modalConfig.buttonColor,
            '&:hover': {
                backgroundColor: `${modalConfig.buttonColor}dd`,
            },
            '&:disabled': {
                backgroundColor: `${modalConfig.buttonColor}40`,
            }
        },
        secondaryButton: {
            color: textColor,
            borderColor: `${textColor}30`,
            '&:hover': {
                backgroundColor: `${textColor}08`,
            }
        },
        inputField: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: `${textColor}03`,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${modalConfig.buttonColor}50`,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: modalConfig.buttonColor,
                    borderWidth: 2,
                },
            }
        },
        sectionTitle: {
            color: modalConfig.buttonColor,
            fontWeight: 700,
        },
        iconBox: {
            backgroundColor: modalConfig.iconBackground,
            color: modalConfig.headerColor,
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
                        <CalendarToday sx={{ color: modalConfig.buttonColor, fontSize: 18 }} />
                    </InputAdornment>
                ),
            }}
            sx={dynamicStyles.inputField}
        />
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: dynamicStyles.dialogPaper,
            }}
        >
            {}
            <DialogTitle sx={{ 
                p: 2.5, 
                pb: 2,
                ...dynamicStyles.header,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...dynamicStyles.iconBox
                    }}>
                        {task ? <EditIcon sx={{ fontSize: 20 }} /> : <AddIcon sx={{ fontSize: 20 }} />}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: textColor, fontSize: '1.1rem' }}>
                            {task ? 'ویرایش تسک' : 'تسک جدید'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: `${textColor}70`, fontSize: '0.75rem' }}>
                            {task ? 'اطلاعات تسک را ویرایش کنید' : 'تسک جدید ایجاد کنید'}
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {task && (
                        <Chip 
                            label={task.done ? 'تکمیل شده' : 'در حال انجام'} 
                            size="small"
                            sx={{ 
                                height: 24,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                backgroundColor: task.done ? '#10b98115' : '#f59e0b15',
                                color: task.done ? '#10b981' : '#f59e0b',
                                border: `1px solid ${task.done ? '#10b98130' : '#f59e0b30'}`,
                            }}
                        />
                    )}
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: `${textColor}60`,
                            '&:hover': {
                                backgroundColor: `${textColor}10`,
                                color: textColor,
                            }
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3, mt: 3.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: textColor }}>
                            <Box sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...dynamicStyles.iconBox
                            }}>
                                <TitleIcon sx={{ fontSize: 16 }} />
                            </Box>
                            عنوان تسک *
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            placeholder="عنوان تسک را وارد کنید"
                            sx={dynamicStyles.inputField}
                        />
                    </Box>

                    {}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: textColor }}>
                            <Box sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...dynamicStyles.iconBox
                            }}>
                                <Description sx={{ fontSize: 16 }} />
                            </Box>
                            توضیحات
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange('description')}
                            placeholder="توضیحات تسک را وارد کنید"
                            sx={dynamicStyles.inputField}
                        />
                    </Box>

                    {}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
                        {}
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: 2, 
                            border: `1px solid ${modalConfig.borderColor}`, 
                            backgroundColor: `${modalConfig.buttonColor}03` 
                        }}>
                            <Typography variant="subtitle2" sx={{ ...dynamicStyles.sectionTitle, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday sx={{ fontSize: 18, color: modalConfig.buttonColor }} />
                                تاریخ‌ها
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: textColor, fontSize: '0.85rem' }}>
                                        تاریخ سررسید
                                    </Typography>
                                    <DatePicker
                                        value={selectedDueDate}
                                        onChange={setSelectedDueDate}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        format="YYYY/MM/DD"
                                        render={<CustomDateInput placeholder="تاریخ سررسید را انتخاب کنید" />}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: textColor, fontSize: '0.85rem' }}>
                                        تاریخ نامه
                                    </Typography>
                                    <DatePicker
                                        value={selectedLetterDate}
                                        onChange={setSelectedLetterDate}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        format="YYYY/MM/DD"
                                        render={<CustomDateInput placeholder="تاریخ نامه را انتخاب کنید" />}
                                    />
                                </Box>
                            </Box>
                        </Paper>

                        {}
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: 2, 
                            border: `1px solid ${modalConfig.borderColor}`, 
                            backgroundColor: `${modalConfig.buttonColor}03` 
                        }}>
                            <Typography variant="subtitle2" sx={{ ...dynamicStyles.sectionTitle, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Numbers sx={{ fontSize: 18, color: modalConfig.buttonColor }} />
                                اطلاعات
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: textColor, fontSize: '0.85rem' }}>
                                        شماره نامه
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={formData.letter_number}
                                        onChange={handleInputChange('letter_number')}
                                        placeholder="شماره نامه"
                                        sx={dynamicStyles.inputField}
                                    />
                                </Box>

                                <Box>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={formData.done}
                                                onChange={handleInputChange('done')}
                                                sx={{
                                                    color: modalConfig.buttonColor,
                                                    '&.Mui-checked': {
                                                        color: modalConfig.buttonColor,
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
                                                وضعیت انجام
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="caption" sx={{ color: `${textColor}60`, display: 'block', mt: 0.5 }}>
                                        در صورت انجام شدن تسک، این گزینه را فعال کنید
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </DialogContent>

            {}
            <Box sx={{ 
                p: 2.5, 
                borderTop: `1px solid ${modalConfig.borderColor}`,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: `${modalConfig.buttonColor}03`,
            }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 0.8,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        gap: 1,
                        backgroundColor: '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                            borderColor: '#cbd5e1',
                        },
                        '&:disabled': {
                            backgroundColor: '#f8fafc',
                            color: '#cbd5e1',
                        }
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
                        borderRadius: 2,
                        px: 3,
                        py: 0.8,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        gap: 1,
                        ...dynamicStyles.primaryButton,
                    }}
                >
                    {loading ? 'در حال ذخیره...' : (task ? 'ذخیره تغییرات' : 'ایجاد تسک')}
                </Button>
            </Box>
        </Dialog>
    );
}