'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as UndoneIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Task as TaskIcon,
  PlaylistAddCheck as SubtaskIcon,
} from '@mui/icons-material';
import { convertToJalali } from '@/lib/dateConverter';
import { SubTask } from '@/app/types';

interface SubTasksPanelProps {
  taskId: number;
  subTasks: SubTask[];
  isOpen: boolean;
  onToggle: () => void;
  onAddSubTask: (taskId: number) => void;
  onEditSubTask?: (subTask: SubTask) => void;
  onDeleteSubTask: (subTaskId: number) => void;
  onToggleSubTaskDone: (subTaskId: number, done: boolean) => void;
}

export default function SubTasksPanel({
  taskId,
  subTasks,
  isOpen,
  onToggle,
  onAddSubTask,
  onEditSubTask,
  onDeleteSubTask,
  onToggleSubTaskDone,
}: SubTasksPanelProps) {
  const [confirmDialog, setConfirmDialog] = useState<number | null>(null);

  const hasSubTasks = subTasks && subTasks.length > 0;
  const completedCount = subTasks.filter(st => st.done).length;
  const totalCount = subTasks.length;

  const handleDelete = () => {
    if (confirmDialog) {
      onDeleteSubTask(confirmDialog);
      setConfirmDialog(null);
    }
  };

  return (
    <>
      {/* هدر پنل زیرکارها */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'grey.50',
          borderTop: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small" color="primary">
            {isOpen ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
          <SubtaskIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            زیرکارها
          </Typography>
          {hasSubTasks && (
            <Chip
              label={`${completedCount}/${totalCount}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onAddSubTask(taskId);
          }}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          زیرکار جدید
        </Button>
      </Box>

      {/* محتوای پنل زیرکارها */}
      <Collapse in={isOpen} timeout="auto">
        <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
          {!hasSubTasks ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TaskIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                هیچ زیرکاری وجود ندارد
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {subTasks.map((subTask) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={subTask.id}>
                  <Card 
                    variant="outlined"
                    sx={{
                      height: '100%',
                      border: '2px solid',
                      borderColor: subTask.done ? 'success.light' : 'primary.light',
                      backgroundColor: 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: 4,
                        borderColor: subTask.done ? 'success.main' : 'primary.main',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      {/* هدر کارت - عنوان با آیکون */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 1, 
                        mb: 2,
                        p: 1.5,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'grey.50'
                      }}>
                        <TaskIcon 
                          fontSize="small" 
                          color={subTask.done ? "success" : "primary"}
                          sx={{ mt: 0.2 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            textDecoration: subTask.done ? 'line-through' : 'none',
                            color: subTask.done ? 'text.secondary' : 'text.primary',
                            flex: 1,
                            lineHeight: 1.4,
                          }}
                        >
                          {subTask.title}
                        </Typography>
                      </Box>

                      {/* تاریخ‌ها */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            شروع: {convertToJalali(subTask.startSubtask)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            پایان: {convertToJalali(subTask.finishSubtask)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* وضعیت و دکمه‌ها */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        pt: 1.5
                      }}>
                        {/* وضعیت */}
                        <Tooltip title={subTask.done ? 'انجام شده - کلیک برای تغییر' : 'در حال انجام - کلیک برای تغییر'}>
                          <Chip
                            icon={subTask.done ? 
                              <DoneIcon fontSize="small" /> : 
                              <UndoneIcon fontSize="small" />
                            }
                            label={subTask.done ? 'انجام شده' : 'در حال انجام'}
                            size="small"
                            color={subTask.done ? "success" : "warning"}
                            variant={subTask.done ? "filled" : "outlined"}
                            onClick={() => onToggleSubTaskDone(subTask.id, !subTask.done)}
                            sx={{ 
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              height: '24px'
                            }}
                          />
                        </Tooltip>

                        {/* دکمه‌های عملیات */}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {onEditSubTask && (
                            <Tooltip title="ویرایش زیرکار">
                              <IconButton
                                size="small"
                                onClick={() => onEditSubTask(subTask)}
                                color="primary"
                                sx={{
                                  backgroundColor: 'primary.50',
                                  '&:hover': {
                                    backgroundColor: 'primary.100',
                                  },
                                  width: '32px',
                                  height: '32px'
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="حذف زیرکار">
                            <IconButton
                              size="small"
                              onClick={() => setConfirmDialog(subTask.id)}
                              color="error"
                              sx={{
                                backgroundColor: 'error.50',
                                '&:hover': {
                                  backgroundColor: 'error.100',
                                },
                                width: '32px',
                                height: '32px'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Collapse>

      {/* دیالوگ تایید حذف */}
      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          حذف زیرکار
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body2">
            آیا از حذف این زیرکار اطمینان دارید؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setConfirmDialog(null)} size="small">
            انصراف
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}