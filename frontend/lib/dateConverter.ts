import { toGregorian, toJalaali } from 'jalaali-js';
import type { Value } from 'react-multi-date-picker';

export const convertToJalali = (gregorianDate: string | null): string => {
    if (!gregorianDate) return '-';
    
    try {
        const date = new Date(gregorianDate);
        if (isNaN(date.getTime())) return '-';
        
        const jalaali = toJalaali(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );
        
        return `${jalaali.jy}/${String(jalaali.jm).padStart(2, '0')}/${String(jalaali.jd).padStart(2, '0')}`;
    } catch (error) {
        console.error('Error converting to Jalali:', error);
        return '-';
    }
};

export const convertToGregorian = (jalaaliDate: Value): string | null => {
    if (!jalaaliDate) return null;
    
    try {
        let jYear: number, jMonth: number, jDay: number;

        if (typeof jalaaliDate === 'object' && jalaaliDate !== null && !Array.isArray(jalaaliDate)) {
            const dateObj = jalaaliDate as any;
            if (dateObj.year && dateObj.month && dateObj.day) {
                jYear = dateObj.year;
                jMonth = dateObj.month;
                jDay = dateObj.day;
            } else {
                console.error('Invalid date object:', dateObj);
                return null;
            }
        }
        else if (Array.isArray(jalaaliDate)) {
            if (jalaaliDate.length === 0) return null;
            const firstDate = jalaaliDate[0];
            if (firstDate && typeof firstDate === 'object' && 'year' in firstDate) {
                jYear = firstDate.year;
                jMonth = firstDate.month;
                jDay = firstDate.day;
            } else {
                console.error('Invalid date array:', jalaaliDate);
                return null;
            }
        }
        else if (typeof jalaaliDate === 'string') {
            const parts = jalaaliDate.split('/');
            
            if (parts.length !== 3) {
                console.error('Invalid date format:', jalaaliDate);
                return null;
            }
            
            jYear = parseInt(parts[0]);
            jMonth = parseInt(parts[1]);
            jDay = parseInt(parts[2]);
            
            if (isNaN(jYear) || isNaN(jMonth) || isNaN(jDay)) {
                console.error('Invalid date numbers:', jalaaliDate);
                return null;
            }
        }
        else if (typeof jalaaliDate === 'number') {
            console.error('Date as number is not supported:', jalaaliDate);
            return null;
        }
        else {
            console.error('Unsupported date type:', typeof jalaaliDate, jalaaliDate);
            return null;
        }

        const gregorian = toGregorian(jYear, jMonth, jDay);
        
        const gregorianDate = new Date(
            gregorian.gy,
            gregorian.gm - 1,
            gregorian.gd
        );

        if (isNaN(gregorianDate.getTime())) {
            console.error('Invalid converted date:', { jYear, jMonth, jDay, gregorian });
            return null;
        }

        return gregorianDate.toISOString();
    } catch (error) {
        console.error('Error converting to Gregorian:', error);
        return null;
    }
};

export const formatDateForPicker = (gregorianDate: string | null): string => {
    if (!gregorianDate) return '';
    
    try {
        const date = new Date(gregorianDate);
        if (isNaN(date.getTime())) return '';
        
        const jalaali = toJalaali(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );
        
        return `${jalaali.jy}/${String(jalaali.jm).padStart(2, '0')}/${String(jalaali.jd).padStart(2, '0')}`;
    } catch (error) {
        console.error('Error formatting date for picker:', error);
        return '';
    }
};

export const debugDateValue = (value: Value): void => {
    console.log('Date Value Debug:', {
        type: typeof value,
        value: value,
        isArray: Array.isArray(value),
        structure: value && typeof value === 'object' ? Object.keys(value) : 'not object'
    });
};