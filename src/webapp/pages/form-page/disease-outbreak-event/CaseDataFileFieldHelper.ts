import _ from "../../../../domain/entities/generic/Collection";

import { CaseData } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ValidationError, ValidationErrorKey } from "../../../../domain/entities/ValidationError";
import { FormFileFieldState, SheetData } from "../../../components/form/FormFieldsState";
import { doesColumnExist, formatDateToDateString } from "../utils/FileHelper";
import { diseaseOutbreakEventFieldIds } from "./mapDiseaseOutbreakEventToInitialFormState";
import { OrgUnit } from "../../../../domain/entities/OrgUnit";
import { Username } from "../../../../domain/entities/User";

const REQUIRED_COLUMN_HEADERS = [
    "ORG UNIT",
    "DATE(YYYY-MM-DD)",
    "SUSPECTED",
    "PROBABLE",
    "CONFIRMED",
    "DEATHS",
];

const file_headers_missing: ValidationErrorKey = "file_headers_missing";
const file_dates_missing: ValidationErrorKey = "file_dates_missing";
const file_dates_not_unique: ValidationErrorKey = "file_dates_not_unique";
const file_data_not_number: ValidationErrorKey = "file_data_not_number";
const file_org_units_incorrect: ValidationErrorKey = "file_org_units_incorrect";

export function validateCaseSheetData(
    updatedField: FormFileFieldState,
    orgUnits: OrgUnit[]
): ValidationError {
    if (!updatedField.value || !updatedField.data?.headers || !updatedField.data?.rows)
        return {
            property: diseaseOutbreakEventFieldIds.casesDataFile,
            value: updatedField.value,
            errors: ["file_missing"],
        };

    if (updatedField.data.headers.length === 0 || updatedField.data.rows.length === 0) {
        return {
            property: diseaseOutbreakEventFieldIds.casesDataFile,
            value: updatedField.value,
            errors: ["file_empty"],
        };
    }

    const casesDataHeadersNotPresent = REQUIRED_COLUMN_HEADERS.filter(
        header => !doesColumnExist(updatedField?.data?.headers || [], header)
    );

    const allDatesInColumn = updatedField.data.rows.map(row =>
        row["DATE(YYYY-MM-DD)"] ? formatDateToDateString(row["DATE(YYYY-MM-DD)"]) : undefined
    );

    const allOrgUnitIds = orgUnits.map(orgUnit => orgUnit.id);

    const lineWithErrors = updatedField.data.rows.reduce(
        (errors, row, index): Partial<Record<ValidationErrorKey, number[]>> => {
            const orgUnitIncorrect =
                !row["ORG UNIT"] || !allOrgUnitIds.includes(row["ORG UNIT"] || "");

            const dateString = row["DATE(YYYY-MM-DD)"]
                ? formatDateToDateString(row["DATE(YYYY-MM-DD)"])
                : undefined;

            const dateNotPresent = !dateString;
            const repeatedDate = dateString && allDatesInColumn.indexOf(dateString) !== index;

            const suspectedNotPresent = isNaN(Number(row["SUSPECTED"]));
            const probableNotPresent = isNaN(Number(row["PROBABLE"]));
            const confirmedNotPresent = isNaN(Number(row["CONFIRMED"]));
            const deathsNotPresent = isNaN(Number(row["DEATHS"]));

            return {
                [file_org_units_incorrect]: orgUnitIncorrect
                    ? [...(errors[file_org_units_incorrect] || []), index + 2]
                    : errors[file_org_units_incorrect],
                [file_dates_missing]: dateNotPresent
                    ? [...(errors[file_dates_missing] || []), index + 2]
                    : errors[file_dates_missing],
                [file_dates_not_unique]: repeatedDate
                    ? [...(errors[file_dates_not_unique] || []), index + 2]
                    : errors[file_dates_not_unique],
                [file_data_not_number]:
                    suspectedNotPresent ||
                    probableNotPresent ||
                    confirmedNotPresent ||
                    deathsNotPresent
                        ? [...(errors[file_data_not_number] || []), index + 2]
                        : errors[file_data_not_number],
            };
        },
        {
            [file_org_units_incorrect]: [],
            [file_dates_missing]: [],
            [file_dates_not_unique]: [],
            [file_data_not_number]: [],
        } as Partial<Record<ValidationErrorKey, number[]>>
    );

    return {
        property: diseaseOutbreakEventFieldIds.casesDataFile,
        value: updatedField.value,
        errors: [],
        errorsInFile: {
            [file_headers_missing]: casesDataHeadersNotPresent.length
                ? `${casesDataHeadersNotPresent.join(
                      ", "
                  )} headers in file are missing. Correct headers are: DATE(YYYY-MM-DD), SUSPECTED, PROBABLE, CONFIRMED, DEATHS`
                : undefined,
            [file_org_units_incorrect]: lineWithErrors[file_org_units_incorrect]?.length
                ? `Org unit id is incorrect in row(s): ${lineWithErrors[
                      file_org_units_incorrect
                  ]?.join()}`
                : undefined,
            [file_dates_missing]: lineWithErrors[file_dates_missing]?.length
                ? `Date is missing in row(s): ${lineWithErrors[file_dates_missing]?.join()}`
                : undefined,
            [file_dates_not_unique]: lineWithErrors[file_dates_not_unique]?.length
                ? `Date is repeated in row(s): ${lineWithErrors[file_dates_not_unique]?.join()}`
                : undefined,
            [file_data_not_number]: lineWithErrors[file_data_not_number]?.length
                ? `Data is not a number in row(s): ${lineWithErrors[file_data_not_number]?.join()}`
                : undefined,
        },
    };
}

export function getCaseDataFromField(
    uploadedCasesSheetData: SheetData,
    currentUsername: Username
): CaseData[] {
    if (!uploadedCasesSheetData?.headers || !uploadedCasesSheetData?.rows) {
        throw new Error("Case data file is missing");
    }
    const casesData: CaseData[] = uploadedCasesSheetData.rows
        .map(row => {
            const dateString = row["DATE(YYYY-MM-DD)"]
                ? formatDateToDateString(row["DATE(YYYY-MM-DD)"])
                : undefined;

            if (dateString && row["ORG UNIT"]) {
                return {
                    updatedBy: currentUsername,
                    reportDate: dateString,
                    orgUnit: row["ORG UNIT"],
                    suspectedCases: Number(row["SUSPECTED"]),
                    probableCases: Number(row["PROBABLE"]),
                    confirmedCases: Number(row["CONFIRMED"]),
                    deaths: Number(row["DEATHS"]),
                };
            }
        })
        .filter((caseData): caseData is CaseData => caseData !== undefined);

    return casesData;
}
