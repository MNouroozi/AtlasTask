'use client';

import { useState } from 'react';
import { 
  TextField, 
  IconButton,
  Box
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import fa from 'date-fns/locale/fa';

registerLocale('fa', fa);

interface PersianDatePickerProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  error?: boolean;
  helperText?: string;
}

export default function PersianDatePicker({ 
  label, 
  value, 
  onChange, 
  error = false, 
  helperText 
}: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      onChange(isoDate);
    } else {
      onChange(null);
    }
    setIsOpen(false);
  };

  const selectedDate = value ? new Date(value) : null;

  const CustomInput = ({ value, onClick }: any) => (
    <TextField
      label={label}
      value={value}
      onClick={onClick}
      error={error}
      helperText={helperText}
      fullWidth
      size="small"
      InputProps={{
        readOnly: true,
        endAdornment: (
          <IconButton 
            size="small" 
            sx={{ mr: -1 }}
            onClick={onClick}
          >
            <CalendarIcon fontSize="small" />
          </IconButton>
        ),
      }}
      placeholder="برای انتخاب تاریخ کلیک کنید"
    />
  );

  return (
    <Box>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        customInput={<CustomInput />}
        locale="fa"
        dateFormat="yyyy/MM/dd"
        isClearable
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        popperPlacement="bottom-end"
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClickOutside={() => setIsOpen(false)}
      />
    </Box>
  );
}