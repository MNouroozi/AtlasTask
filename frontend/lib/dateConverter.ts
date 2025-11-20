export const convertToJalali = (gregorianDate: string | null): string => {
    if (!gregorianDate) return '-';
    
    try {
        const date = new Date(gregorianDate);
        return date.toLocaleDateString('fa-IR');
    } catch (error) {
        return gregorianDate;
    }
};