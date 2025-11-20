import { format, parse } from "date-fns";
import { faIR } from "date-fns-jalali/locale";

export const convertToJalali = (gregorianDate: string): string => {
    try {
        const date = parse(gregorianDate, "yyyy-MM-dd", new Date());
        return format(date, "yyyy/MM/dd", { locale: faIR });
    } catch (error) {
        return gregorianDate;
    }
};

export const convertToGregorian = (jalaliDate: string): string => {
    try {
        return format(new Date(jalaliDate), "yyyy-MM-dd");
    } catch (error) {
        return jalaliDate;
    }
};
