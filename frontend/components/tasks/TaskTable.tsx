"use client";

import { useState, useMemo } from "react";
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
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Subtitles as SubtasksIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import StatusBadge from "@/components/ui/StatusBadge";
import { Task } from "@/types";

interface TaskTableProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onViewSubtasks: (taskId: string) => void;
}

type Order = "asc" | "desc";
type OrderBy = keyof Task;

export default function TaskTable({
    tasks,
    onEdit,
    onDelete,
    onViewSubtasks,
}: TaskTableProps) {
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<OrderBy>("title");

    const handleRequestSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedTasks = useMemo(() => {
        return tasks.sort((a, b) => {
            let aValue = a[orderBy];
            let bValue = b[orderBy];

            if (typeof aValue === "string" && typeof bValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (order === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }, [tasks, order, orderBy]);

    const priorityLabels = {
        low: { label: "پایین", color: "success" as const },
        medium: { label: "متوسط", color: "warning" as const },
        high: { label: "بالا", color: "error" as const },
    };

    const headers = [
        { id: "title" as OrderBy, label: "عنوان تسک", width: "20%" },
        { id: "status" as OrderBy, label: "وضعیت", width: "12%" },
        { id: "priority" as OrderBy, label: "اولویت", width: "12%" },
        { id: "assignee" as OrderBy, label: "مسئول", width: "15%" },
        { id: "dueDate" as OrderBy, label: "تاریخ مهلت", width: "12%" },
        { id: "description" as OrderBy, label: "توضیحات", width: "19%" },
        { id: "actions" as OrderBy, label: "عملیات", width: "10%" },
    ];

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Table sx={{ minWidth: 800 }}>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell
                                key={header.id}
                                align="center"
                                sx={{
                                    width: header.width,
                                    fontWeight: 600,
                                    backgroundColor: "grey.50",
                                }}
                            >
                                {header.id !== "actions" ? (
                                    <TableSortLabel
                                        active={orderBy === header.id}
                                        direction={
                                            orderBy === header.id
                                                ? order
                                                : "asc"
                                        }
                                        onClick={() =>
                                            handleRequestSort(header.id)
                                        }
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
                    {sortedTasks.map((task) => (
                        <TableRow
                            key={task.id}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                    cursor: "pointer",
                                },
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell align="center" sx={{ fontWeight: 500 }}>
                                {task.title}
                            </TableCell>

                            <TableCell align="center">
                                <StatusBadge status={task.status} />
                            </TableCell>

                            <TableCell align="center">
                                <Chip
                                    label={priorityLabels[task.priority].label}
                                    color={priorityLabels[task.priority].color}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>

                            <TableCell align="center">
                                <Chip
                                    label={task.assignee}
                                    size="small"
                                    variant="filled"
                                    sx={{ backgroundColor: "primary.50" }}
                                />
                            </TableCell>

                            <TableCell align="center">
                                {task.dueDate ? (
                                    <Typography variant="body2">
                                        {new Date(
                                            task.dueDate,
                                        ).toLocaleDateString("fa-IR")}
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        —
                                    </Typography>
                                )}
                            </TableCell>

                            <TableCell align="center">
                                <Tooltip title={task.description}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {task.description}
                                    </Typography>
                                </Tooltip>
                            </TableCell>

                            <TableCell align="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 0.5,
                                    }}
                                >
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
                                            onClick={() =>
                                                onViewSubtasks(task.id)
                                            }
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
