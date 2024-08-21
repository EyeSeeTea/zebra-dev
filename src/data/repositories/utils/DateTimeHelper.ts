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
