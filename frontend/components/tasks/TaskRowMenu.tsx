'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Add as AddIcon,
  List as ListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as UndoneIcon,
} from '@mui/icons-material';

interface TaskRowMenuProps {
  task: any;
  onEdit: (task: any) => void;
  onDelete: (taskId: number) => void;
  onToggleDone: (taskId: number, done: boolean) => void;
  onAddSubTask: (taskId: number) => void;
  onViewSubTasks: (taskId: number) => void;
}

export default function TaskRowMenu({
  task,
  onEdit,
  onDelete,
  onToggleDone,
  onAddSubTask,
  onViewSubTasks,
}: TaskRowMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {task.subtasks && task.subtasks.length > 0 && (
        <Chip
          label={task.subtasks.length}
          size="small"
          color="info"
          variant="outlined"
          sx={{ height: 24, fontSize: '0.7rem' }}
        />
      )}
      
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'action.hover',
            color: 'text.primary',
          },
        }}
      >
        <MoreIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={() => handleMenuAction(() => onToggleDone(task.id, !task.done))}>
          <ListItemIcon>
            {task.done ? (
              <UndoneIcon fontSize="small" color="warning" />
            ) : (
              <DoneIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {task.done ? 'برگشت به انتظار' : 'علامت به انجام'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction(() => onAddSubTask(task.id))}>
          <ListItemIcon>
            <AddIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>افزودن زیرکار</ListItemText>
        </MenuItem>

        {task.subtasks && task.subtasks.length > 0 && (
          <MenuItem onClick={() => handleMenuAction(() => onViewSubTasks(task.id))}>
            <ListItemIcon>
              <ListIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText>
              مشاهده زیرکارها ({task.subtasks.length})
            </ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleMenuAction(() => onEdit(task))}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>ویرایش تسک</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => handleMenuAction(() => onDelete(task.id))}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>حذف تسک</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}