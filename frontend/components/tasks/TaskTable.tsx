'use client';

import { useState, useMemo } from 'react';
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
  IconButton,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Subtitles as SubtasksIcon,
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as UndoneIcon,
} from '@mui/icons-material';
import { convertToJalali } from '@/lib/dateConverter';
import { MainTask } from '@/app/types';

interface TaskTableProps {
  tasks: MainTask[];
  onEdit: (task: MainTask) => void;
  onDelete: (taskId: number) => void;
  onViewSubtasks: (taskId: number) => void;
  onToggleDone: (taskId: number, done: boolean) => void;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof MainTask;

export default function TaskTable({ 
  tasks, 
  onEdit, 
  onDelete, 
  onViewSubtasks, 
  onToggleDone 
}: TaskTableProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('title');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const headers: { id: OrderBy | 'actions'; label: string; width: string; sortable?: boolean }[] = [
    { id: 'title', label: 'عنوان تسک', width: '20%', sortable: true },
    { id: 'letter_number', label: 'شماره نامه', width: '12%', sortable: true },
    { id: 'letter_date', label: 'تاریخ نامه', width: '12%', sortable: true },
    { id: 'due_date', label: 'تاریخ مهلت', width: '12%', sortable: true },
    { id: 'description', label: 'توضیحات', width: '20%', sortable: true },
    { id: 'done', label: 'وضعیت', width: '10%', sortable: true },
    { id: 'actions', label: 'عملیات', width: '14%', sortable: false },
  ];

  const handleToggleDone = (task: MainTask) => {
    onToggleDone(task.id, !task.done);
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
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
                }}
              >
                {header.sortable && header.id !== 'actions' ? (
                  <TableSortLabel
                    active={orderBy === header.id}
                    direction={orderBy === header.id ? order : 'asc'}
                    onClick={() => handleRequestSort(header.id as OrderBy)}
                  >
                    {header.label}
                  </TableSortLabel>
                ) : (
                  header.label
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
              <TableRow 
                key={task.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: task.done ? 'action.selected' : 'transparent',
                }}
              >
                {/* عنوان تسک */}
                <TableCell align="center" sx={{ fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleDone(task)}
                      color={task.done ? "success" : "default"}
                    >
                      {task.done ? <DoneIcon /> : <UndoneIcon />}
                    </IconButton>
                    <Typography variant="body2">
                      {task.title}
                    </Typography>
                  </Box>
                </TableCell>
                
                {/* شماره نامه */}
                <TableCell align="center">
                  <Chip
                    label={task.letter_number || '—'}
                    size="small"
                    variant={task.letter_number ? "filled" : "outlined"}
                    color={task.letter_number ? "primary" : "default"}
                  />
                </TableCell>
                
                {/* تاریخ نامه */}
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
                
                {/* تاریخ مهلت */}
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
                
                {/* توضیحات */}
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
                
                {/* وضعیت */}
                <TableCell align="center">
                  <Chip
                    label={task.done ? 'انجام شده' : 'در انتظار'}
                    size="small"
                    color={task.done ? "success" : "warning"}
                    variant={task.done ? "filled" : "outlined"}
                  />
                </TableCell>
                
                {/* عملیات */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="ویرایش">
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(task)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="زیرکارها">
                      <IconButton 
                        size="small" 
                        onClick={() => onViewSubtasks(task.id)}
                        color="info"
                      >
                        <SubtasksIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="حذف">
                      <IconButton 
                        size="small" 
                        onClick={() => onDelete(task.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}