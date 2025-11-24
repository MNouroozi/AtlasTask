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
    Edit as EditIcon,
    Save as SaveIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import DatePicker from 'react-multi-date-picker';
import type { Value } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { toast } from 'react-toastify';
import { convertToGregorian, formatDateForPicker } from '@/lib/dateConverter';
import { SubTask, CreateSubTaskData } from '@/app/types';

interface SubTaskModalProps {
    open: boolean;
    onClose: () => void;
    subTask?: SubTask;
    onSave: (subTaskData: CreateSubTaskData) => Promise<void>;
    loading?: boolean;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    mainTaskId?: number | null | undefined;
}

export default function SubTaskModal({ 
    open, 
    onClose, 
    subTask, 
    onSave, 
    loading = false,
    primaryColor = '#8b5cf6',
    backgroundColor = '#ffffff',
    textColor = '#1e293b',
    mainTaskId
}: SubTaskModalProps) {
    const [selectedStartDate, setSelectedStartDate] = useState<Value>(null);
    const [selectedFinishDate, setSelectedFinishDate] = useState<Value>(null);
    const [formData, setFormData] = useState({
        title: '',
        done: false,
    });

    useEffect(() => {
        if (subTask) {
            setFormData({
                title: subTask.title || '',
                done: subTask.done || false,
            });
            setSelectedStartDate(subTask.startSubtask ? formatDateForPicker(subTask.startSubtask) : null);
            setSelectedFinishDate(subTask.finishSubtask ? formatDateForPicker(subTask.finishSubtask) : null);
        } else {
            setFormData({
                title: '',
                done: false,
            });
            setSelectedStartDate(null);
            setSelectedFinishDate(null);
        }
    }, [subTask, open]);

    const modalConfig = subTask ? {
        headerColor: '#f59e0b',
        headerBackground: `linear-gradient(135deg, #f59e0b08 0%, #f59e0b03 100%)`,
        iconBackground: '#f59e0b15',
        borderColor: '#f59e0b15',
        buttonColor: '#f59e0b',
    } : {
        headerColor: '#8b5cf6',
        headerBackground: `linear-gradient(135deg, #8b5cf608 0%, #8b5cf603 100%)`,
        iconBackground: '#8b5cf615',
        borderColor: '#8b5cf615',
        buttonColor: '#8b5cf6',
    };

    const dynamicStyles = {
        dialogPaper: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            background: backgroundColor,
            border: `1px solid ${modalConfig.borderColor}`,
            maxWidth: '600px',
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
            toast.error('عنوان ساب‌تسک الزامی است');
            return;
        }

        if (!selectedStartDate || !selectedFinishDate) {
            toast.error('تاریخ شروع و پایان الزامی است');
            return;
        }

        try {
            const startDate = convertToGregorian(selectedStartDate);
            const finishDate = convertToGregorian(selectedFinishDate);

            if (!startDate || !finishDate) {
                toast.error('تاریخ‌های انتخاب شده معتبر نیستند');
                return;
            }

            const subTaskData: CreateSubTaskData = {
                ...formData,
                startSubtask: startDate,
                finishSubtask: finishDate,
            };
            
            console.log('Sending subtask data:', subTaskData);
            
            await onSave(subTaskData);
            
            toast.success(subTask ? 'ساب‌تسک با موفقیت ویرایش شد' : 'ساب‌تسک جدید ایجاد شد');
            onClose();
        } catch (error) {
            console.error('Error saving subtask:', error);
            toast.error('خطا در ذخیره ساب‌تسک');
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
                        {subTask ? <EditIcon sx={{ fontSize: 20 }} /> : <AddIcon sx={{ fontSize: 20 }} />}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: textColor, fontSize: '1.1rem' }}>
                            {subTask ? 'ویرایش ساب‌تسک' : 'ساب‌تسک جدید'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: `${textColor}70`, fontSize: '0.75rem' }}>
                            {subTask ? 'اطلاعات ساب‌تسک را ویرایش کنید' : 'ساب‌تسک جدید ایجاد کنید'}
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {subTask && (
                        <Chip 
                            label={subTask.done ? 'تکمیل شده' : 'در حال انجام'} 
                            size="small"
                            sx={{ 
                                height: 24,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                backgroundColor: subTask.done ? '#10b98115' : '#f59e0b15',
                                color: subTask.done ? '#10b981' : '#f59e0b',
                                border: `1px solid ${subTask.done ? '#10b98130' : '#f59e0b30'}`,
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
                            عنوان ساب‌تسک *
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            placeholder="عنوان ساب‌تسک را وارد کنید"
                            sx={dynamicStyles.inputField}
                        />
                    </Box>

                    <Paper elevation={0} sx={{ 
                        p: 2.5, 
                        borderRadius: 2, 
                        border: `1px solid ${modalConfig.borderColor}`, 
                        backgroundColor: `${modalConfig.buttonColor}03` 
                    }}>
                        <Typography variant="subtitle2" sx={{ ...dynamicStyles.sectionTitle, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: 18, color: modalConfig.buttonColor }} />
                            تاریخ‌های ساب‌تسک
                        </Typography>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: textColor, fontSize: '0.85rem' }}>
                                    تاریخ شروع *
                                </Typography>
                                <DatePicker
                                    value={selectedStartDate}
                                    onChange={setSelectedStartDate}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    format="YYYY/MM/DD"
                                    render={<CustomDateInput placeholder="تاریخ شروع را انتخاب کنید" />}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: textColor, fontSize: '0.85rem' }}>
                                    تاریخ پایان *
                                </Typography>
                                <DatePicker
                                    value={selectedFinishDate}
                                    onChange={setSelectedFinishDate}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    format="YYYY/MM/DD"
                                    render={<CustomDateInput placeholder="تاریخ پایان را انتخاب کنید" />}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    <Paper elevation={0} sx={{ 
                        p: 2.5, 
                        borderRadius: 2, 
                        border: `1px solid ${modalConfig.borderColor}`, 
                        backgroundColor: `${modalConfig.buttonColor}03` 
                    }}>
                        <Typography variant="subtitle2" sx={{ ...dynamicStyles.sectionTitle, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Description sx={{ fontSize: 18, color: modalConfig.buttonColor }} />
                            وضعیت
                        </Typography>
                        
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
                                در صورت انجام شدن ساب‌تسک، این گزینه را فعال کنید
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </DialogContent>

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
                    disabled={loading || !formData.title.trim() || !selectedStartDate || !selectedFinishDate}
                    startIcon={subTask ? <SaveIcon /> : <AddIcon />}
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
                    {loading ? 'در حال ذخیره...' : (subTask ? 'ذخیره تغییرات' : 'ایجاد ساب‌تسک')}
                </Button>
            </Box>
        </Dialog>
    );
}