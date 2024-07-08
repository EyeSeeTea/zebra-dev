import { useCallback } from "react";
import { Maybe } from "../../utils/ts-utils";
import _ from "../../domain/entities/generic/Collection";

export const useTableCell = (
    editRiskAssessmentColumns: string[],
    columnRules: { [key: string]: number }
) => {
    const getCellColor = useCallback(
        (cellValue: Maybe<string>, column: string) => {
            if (!cellValue) {
                return editRiskAssessmentColumns.includes(column) ? "orange" : undefined;
            }

            const value = Number(cellValue);

            if (editRiskAssessmentColumns.includes(column)) {
                return columnRules.respond7d && value > columnRules.respond7d ? "red" : undefined;
            }

            const rule = columnRules[column];

            if (rule === undefined) {
                return undefined;
            }

            return value <= rule ? "green" : "red";
        },
        [editRiskAssessmentColumns, columnRules]
    );

    return { getCellColor };
};
