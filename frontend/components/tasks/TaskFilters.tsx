'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Box,
    IconButton,
    Collapse,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { TaskFilters as TaskFiltersType } from '@/app/hooks/useTasks';

interface TaskFiltersProps {
    filters: TaskFiltersType;
    onFiltersChange: (filters: TaskFiltersType) => void;
}

export default function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
    const [filtersOpen, setFiltersOpen] = useState(false);

    const handleFilterChange = (field: keyof TaskFiltersType, value: string) => {
        onFiltersChange({
            ...filters,
            [field]: value,
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            search: '',
            status:'',
            done: '',
        });
    };

    const hasActiveFilters = filters.done;

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: '16px !important' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="جستجو در عنوان و توضیحات..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />,
                        }}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    
                    <IconButton
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        color={filtersOpen ? 'primary' : 'default'}
                        size="small"
                    >
                        <FilterIcon />
                    </IconButton>
                    
                    {hasActiveFilters && (
                        <IconButton onClick={clearFilters} color="error" size="small">
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>

                <Collapse in={filtersOpen}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        <TextField
                            select
                            label="وضعیت"
                            value={filters.done}
                            onChange={(e) => handleFilterChange('done', e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">همه</MenuItem>
                            <MenuItem value="pending">در انتظار</MenuItem>
                            <MenuItem value="done">انجام شده</MenuItem>
                        </TextField>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}