import { toGregorian, toJalaali } from 'jalaali-js';
import type { Value } from 'react-multi-date-picker';

// تبدیل تاریخ میلادی به شمسی (برای نمایش)
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

// تبدیل تاریخ شمسی به میلادی (برای ارسال به بک‌اند) - پشتیبانی از تمام انواع Value
export const convertToGregorian = (jalaaliDate: Value): string | null => {
    if (!jalaaliDate) return null;
    
    try {
        let jYear: number, jMonth: number, jDay: number;

        // اگر تاریخ از DatePicker به صورت آبجکت آمده
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
        // اگر تاریخ به صورت آرایه هست (ممکنه DatePicker آرایه برگردونه)
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
        // اگر تاریخ به صورت رشته هست (مثل "1403/08/27")
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
        // اگر عدد هست (نباید اتفاق بیفته اما برای ایمنی)
        else if (typeof jalaaliDate === 'number') {
            console.error('Date as number is not supported:', jalaaliDate);
            return null;
        }
        else {
            console.error('Unsupported date type:', typeof jalaaliDate, jalaaliDate);
            return null;
        }

        // تبدیل شمسی به میلادی
        const gregorian = toGregorian(jYear, jMonth, jDay);
        
        // ایجاد تاریخ میلادی
        const gregorianDate = new Date(
            gregorian.gy,
            gregorian.gm - 1, // ماه در جاوااسکریپت از 0 شروع میشه
            gregorian.gd
        );

        // بررسی معتبر بودن تاریخ
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

// فرمت تاریخ برای نمایش در inputهای DatePicker
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

// تابع کمکی برای دیباگ - مشاهده ساختار Value
export const debugDateValue = (value: Value): void => {
    console.log('Date Value Debug:', {
        type: typeof value,
        value: value,
        isArray: Array.isArray(value),
        structure: value && typeof value === 'object' ? Object.keys(value) : 'not object'
    });
};