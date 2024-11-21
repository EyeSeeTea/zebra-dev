import * as XLSX from "xlsx";

import { Row, SheetData } from "../../../components/form/FormFieldsState";

export async function readFile(file: File): Promise<SheetData[]> {
    const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true });

    return Object.values(workbook.Sheets).map((worksheet): SheetData => {
        const headers =
            XLSX.utils.sheet_to_json<string[]>(worksheet, {
                header: 1,
                defval: "",
            })[0] || [];
        const rows = XLSX.utils.sheet_to_json<Row>(worksheet, {
            raw: true,
            skipHidden: false,
        });

        return {
            headers,
            rows,
        };
    });
}

export function doesColumnExist(header: string[], column: string): boolean {
    return header.find(value => value === column) !== undefined;
}

export function formatDateToDateString(date: Date | string): string | undefined {
    if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    } else {
        return date;
    }
}
