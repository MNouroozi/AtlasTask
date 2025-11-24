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
} from '@mui/material';
import {
  Title as TitleIcon,
  Numbers as NumbersIcon,
  DateRange as DateIcon,
  Description as DescriptionIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { convertToJalali } from '@/lib/dateConverter';
import { MainTask } from '@/app/types';
import TaskRowMenu from './TaskRowMenu';
import SubTasksPanel from '../subTasks/SubTasksPanel';

interface TaskTableProps {
  tasks: MainTask[];
  onEdit: (task: MainTask) => void;
  onDelete: (taskId: number) => void;
  onToggleDone: (taskId: number, done: boolean) => void;
  onAddSubTask: (taskId: number) => void;
  onDeleteSubTask: (subTaskId: number) => void;
  onToggleSubTaskDone: (subTaskId: number, done: boolean) => void;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof MainTask | 'status';
type HeaderId = 'title' | 'letter_number' | 'letter_date' | 'due_date' | 'description' | 'status' | 'actions';

const headerIcons: Record<HeaderId, React.ReactNode> = {
  title: <TitleIcon fontSize="small" />,
  letter_number: <NumbersIcon fontSize="small" />,
  letter_date: <DateIcon fontSize="small" />,
  due_date: <DateIcon fontSize="small" />,
  description: <DescriptionIcon fontSize="small" />,
  status: <FlagIcon fontSize="small" />,
  actions: <FlagIcon fontSize="small" />,
};

export default function TaskTable({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleDone,
  onAddSubTask,
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

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[orderBy === 'status' ? 'done' : orderBy];
      let bValue: any = b[orderBy === 'status' ? 'done' : orderBy];

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
    { id: 'title', label: 'عنوان تسک', width: '20%', sortable: true },
    { id: 'letter_number', label: 'ش . نامه', width: '12%', sortable: true },
    { id: 'letter_date', label: 'ت . نامه', width: '12%', sortable: true },
    { id: 'due_date', label: 'ت . مهلت', width: '12%', sortable: true },
    { id: 'description', label: 'توضیحات', width: '20%', sortable: true },
    { id: 'status', label: 'وضعیت', width: '10%', sortable: true },
    { id: 'actions', label: 'عملیات', width: '14%', sortable: false },
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
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
                      backgroundColor: 'action.hover',
                    },
                    backgroundColor: task.done ? 'action.selected' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleToggleExpand(task.id)}
                >
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {task.title}
                      </Typography>
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
                    <Tooltip title={task.description || 'بدون توضیح'}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.4,
                        }}
                      >
                        {task.description || '—'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={task.done ? 'انجام شده' : 'در انتظار'}
                      size="small"
                      color={task.done ? "success" : "warning"}
                      variant={task.done ? "filled" : "outlined"}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <TaskRowMenu
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleDone={onToggleDone}
                      onAddSubTask={onAddSubTask}
                      onViewSubTasks={handleToggleExpand}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <SubTasksPanel
                      taskId={task.id}
                      subTasks={task.subtasks || []}
                      isOpen={expandedTask === task.id}
                      onToggle={() => handleToggleExpand(task.id)}
                      onAddSubTask={onAddSubTask}
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