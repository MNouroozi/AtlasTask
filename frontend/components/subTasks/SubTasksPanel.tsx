'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as UndoneIcon,
} from '@mui/icons-material';
import { convertToJalali } from '@/lib/dateConverter';
import { SubTask } from '@/app/types';

interface SubTasksPanelProps {
  taskId: number;
  subTasks: SubTask[];
  isOpen: boolean;
  onToggle: () => void;
  onAddSubTask: (taskId: number) => void;
  onDeleteSubTask: (subTaskId: number) => void;
  onToggleSubTaskDone: (subTaskId: number, done: boolean) => void;
}

export default function SubTasksPanel({
  taskId,
  subTasks,
  isOpen,
  onToggle,
  onAddSubTask,
  onDeleteSubTask,
  onToggleSubTaskDone,
}: SubTasksPanelProps) {
  const hasSubTasks = subTasks && subTasks.length > 0;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small">
            {isOpen ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
          <Typography variant="subtitle2" fontWeight={600}>
            زیرکارها
          </Typography>
          {hasSubTasks && (
            <Chip
              label={subTasks.length}
              size="small"
              color="primary"
              variant="outlined"
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
          sx={{ minWidth: 'auto' }}
        >
          افزودن زیرکار
        </Button>
      </Box>

      <Collapse in={isOpen} timeout="auto">
        <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
          {!hasSubTasks ? (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ py: 2 }}
            >
              هیچ زیرکاری وجود ندارد
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {subTasks.map((subTask) => (
                <Paper
                  key={subTask.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: subTask.done ? 'success.light' : 'divider',
                    backgroundColor: subTask.done ? 'success.light + 0.1' : 'background.paper',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    {/* وضعیت */}
                    <IconButton
                      size="small"
                      onClick={() => onToggleSubTaskDone(subTask.id, !subTask.done)}
                      color={subTask.done ? "success" : "default"}
                    >
                      {subTask.done ? <DoneIcon /> : <UndoneIcon />}
                    </IconButton>

                    {/* عنوان */}
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        textDecoration: subTask.done ? 'line-through' : 'none',
                        color: subTask.done ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {subTask.title}
                    </Typography>

                    {/* تاریخ‌ها */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`شروع: ${convertToJalali(subTask.startSubtask)}`}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                      <Chip
                        label={`پایان: ${convertToJalali(subTask.finishSubtask)}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Box>

                  {/* عملیات */}
                  <IconButton
                    size="small"
                    onClick={() => onDeleteSubTask(subTask.id)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </>
  );
}