import moment from "moment";
import { Maybe } from "../../../utils/ts-utils";

export function getCurrentTimeString(): string {
    return new Date().getTime().toString();
}

export function getDateAsIsoString(date: Maybe<Date>): string {
    try {
        return date ? date.toISOString() : "";
    } catch (e) {
        console.debug(e);
        return "";
    }
}

export function getDateAsMonthYearString(date: Date): string {
    try {
        return date.toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch (e) {
        console.debug(e);
        return "";
    }
}

export function getDateAsLocaleDateTimeString(date: string): string {
    try {
        return moment(date).local().toDate().toString();
    } catch (e) {
        console.debug(e);
        return "";
    }
}

export function getDateAsLocaleDateString(date: Date): string {
    try {
        return `${date.toLocaleDateString()}`;
    } catch (e) {
        console.debug(e);
        return "";
    }
}

export function getISODateAsLocaleDateString(date: string): Date {
    return moment.utc(date).local().toDate();
}

const getQuarter = (month: number): number => Math.ceil((month + 1) / 3);

export function formatQuarterString(date: Date): string {
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "short" });
    const quarter = getQuarter(date.getMonth());

    return `Qtr ${quarter}, ${month} ${year}`;
}
