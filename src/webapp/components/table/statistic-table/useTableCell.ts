import { useCallback } from "react";
import { Maybe } from "../../../../utils/ts-utils";
import _ from "../../../../domain/entities/generic/Collection";

export const enum CellStatus {
    Valid = "valid",
    Alert = "alert",
    Warning = "warning",
}
export type CellStatusValues = `${CellStatus}`;

export const useTableCell = (
    editRiskAssessmentColumns: string[],
    columnRules: { [key: string]: number }
) => {
    const getCellColor = useCallback(
        (cellValue: Maybe<string>, column: string) => {
            if (!cellValue) {
                return editRiskAssessmentColumns.includes(column) ? CellStatus.Warning : undefined;
            }

            const value = Number(cellValue);

            if (editRiskAssessmentColumns.includes(column)) {
                return columnRules.respond7d && value > columnRules.respond7d
                    ? CellStatus.Alert
                    : undefined;
            }

            const rule = columnRules[column];

            if (rule === undefined) {
                return undefined;
            }

            return value <= rule ? CellStatus.Valid : CellStatus.Alert;
        },
        [editRiskAssessmentColumns, columnRules]
    );

    return { getCellColor };
};
