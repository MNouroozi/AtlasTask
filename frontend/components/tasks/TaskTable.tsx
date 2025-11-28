'use client';

import { useState, useMemo } from 'react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Chip,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Title as TitleIcon,
  Numbers as NumbersIcon,
  DateRange as DateIcon,
  Description as DescriptionIcon,
  Flag as FlagIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { convertToJalali } from '@/lib/dateConverter';
import { MainTask, SubTask } from '@/app/types';
import SubTasksPanel from '@/components/subTasks/SubTasksPanel';

interface TaskTableProps {
  tasks: MainTask[];
  onEdit: (task: MainTask) => void;
  onDelete: (taskId: number) => void;
  onToggleDone: (taskId: number, done: boolean) => void;
  onAddSubTask: (taskId: number) => void;
  onEditSubTask: (subTask: SubTask) => void;
  onDeleteSubTask: (subTaskId: number) => void;
  onToggleSubTaskDone: (subTaskId: number, done: boolean) => void;
  expandedTaskId?: number | null; // اضافه کردن این خط
}

type Order = 'asc' | 'desc';
type OrderBy = keyof MainTask;
type HeaderId = 'title' | 'letter_number' | 'letter_date' | 'description' | 'due_date' | 'actions';

const headerIcons: Record<HeaderId, React.ReactNode> = {
  title: <TitleIcon fontSize="small" />,
  letter_number: <NumbersIcon fontSize="small" />,
  letter_date: <DateIcon fontSize="small" />,
  description: <DescriptionIcon fontSize="small" />,
  due_date: <DateIcon fontSize="small" />,
  actions: <FlagIcon fontSize="small" />,
};

export default function TaskTable({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleDone,
  onAddSubTask,
  onEditSubTask,
  onDeleteSubTask,
  onToggleSubTaskDone,
}: TaskTableProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('title');
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleToggleExpand = (taskId: number) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const isTaskExpanded = (taskId: number) => {
    return expandedTask === taskId;
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === 'created_at' || orderBy === 'updated_at' || orderBy === 'due_date' || orderBy === 'letter_date') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [tasks, order, orderBy]);

  const headers: { id: HeaderId; label: string; width: string; sortable?: boolean }[] = [
    { id: 'title', label: 'عنوان تسک', width: '18%', sortable: true },
    { id: 'letter_number', label: 'ش . نامه', width: '12%', sortable: true },
    { id: 'letter_date', label: 'ت . نامه', width: '12%', sortable: true },
    { id: 'description', label: 'توضیحات', width: '28%', sortable: true },
    { id: 'due_date', label: 'ت . مهلت', width: '12%', sortable: true },
    { id: 'actions', label: 'عملیات', width: '18%', sortable: false },
  ];

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={String(header.id)}
                align="center"
                sx={{ 
                  width: header.width,
                  fontWeight: 600,
                  backgroundColor: 'grey.50',
                  fontSize: '0.875rem',
                  py: 1,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                {header.sortable && header.id !== 'actions' ? (
                  <TableSortLabel
                    active={orderBy === header.id}
                    direction={orderBy === header.id ? order : 'asc'}
                    onClick={() => handleRequestSort(header.id as OrderBy)}
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {header.label}
                      {headerIcons[header.id]}
                    </Box>
                  </TableSortLabel>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {header.label}
                    {headerIcons[header.id]}
                  </Box>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {sortedTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  هیچ تسکی یافت نشد
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedTasks.map((task) => (
              <React.Fragment key={task.id}>
                <TableRow 
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: task.done ? '#e8f5e8' : '#fff3e0',
                    },
                    backgroundColor: task.done ? '#e8f5e8' : '#fff3e0',
                    cursor: 'pointer',
                    borderLeft: task.done ? '4px solid #22c55e' : '4px solid #f59e0b',
                  }}
                  onClick={() => handleToggleExpand(task.id)}
                >
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {task.title}
                      </Typography>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <Chip
                          label={task.subtasks.length}
                          size="small"
                          color="info"
                          variant="outlined"
                          sx={{ height: 24, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={task.letter_number || '—'}
                      size="small"
                      variant={task.letter_number ? "filled" : "outlined"}
                      color={task.letter_number ? "primary" : "default"}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    {task.letter_date ? (
                      <Chip
                        label={convertToJalali(task.letter_date)}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title={task.description || 'بدون توضیح'}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.4,
                          maxHeight: '4.2em',
                        }}
                      >
                        {task.description || '—'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell align="center">
                    {task.due_date ? (
                      <Chip
                        label={convertToJalali(task.due_date)}
                        size="small"
                        variant="outlined"
                        color={new Date(task.due_date) < new Date() ? "error" : "success"}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={task.done ? 'انجام شده - کلیک برای تغییر به در حال انجام' : 'در حال انجام - کلیک برای تغییر به انجام شده'}>
                      <Chip
                        label={task.done ? 'انجام شده' : 'در حال انجام'}
                        size="small"
                        color={task.done ? "success" : "warning"}
                        variant={task.done ? "filled" : "outlined"}
                        onClick={async (e) => {
                          e.stopPropagation();
                          console.log('شروع تغییر وضعیت تسک:', task.id, 'به:', !task.done);
                          try {
                            await onToggleDone(task.id, !task.done);
                            console.log('تغییر وضعیت تسک با موفقیت انجام شد');
                          } catch (error) {
                            console.error('خطا در تغییر وضعیت تسک:', error);
                          }
                        }}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                          }
                        }}
                      />
                    </Tooltip>

                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="ویرایش">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(task);
                            }}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="حذف">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(task.id);
                            }}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                    <SubTasksPanel
                      taskId={task.id}
                      subTasks={task.subtasks || []}
                      isOpen={isTaskExpanded(task.id)}
                      onToggle={() => handleToggleExpand(task.id)}
                      onAddSubTask={onAddSubTask}
                      onEditSubTask={onEditSubTask}
                      onDeleteSubTask={onDeleteSubTask}
                      onToggleSubTaskDone={onToggleSubTaskDone}
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}