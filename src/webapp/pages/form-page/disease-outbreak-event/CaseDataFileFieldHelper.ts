import _ from "../../../../domain/entities/generic/Collection";

import { CaseData } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { ValidationError, ValidationErrorKey } from "../../../../domain/entities/ValidationError";
import { FormFileFieldState, Row, SheetData } from "../../../components/form/FormFieldsState";
import { doesColumnExist, formatDateToDateString } from "../utils/FileHelper";
import { diseaseOutbreakEventFieldIds } from "./mapDiseaseOutbreakEventToInitialFormState";
import { OrgUnit } from "../../../../domain/entities/OrgUnit";
import { Username } from "../../../../domain/entities/User";

const REQUIRED_DATA_ENTRY_COLUMN_HEADERS = {
    district: "District",
    reportDate: "Report Date (YYYY-MM-DD)",
    suspectedCases: "NUMBER OF SUSPECTED CASES",
    probableCases: "NUMBER OF PROBABLE CASES",
    confirmedCases: "NUMBER OF CONFIRMED CASES",
    deaths: "NUMBER OF DEATHS",
} as const;

const REQUIRED_METADATA_COLUMN_HEADERS = {
    identifier: "Identifier",
    type: "Type",
    name: "Name",
} as const;

const SHEET_NAMES = {
    dataEntry: "Data entry",
    metadata: "Metadata",
};

const file_headers_missing: ValidationErrorKey = "file_headers_missing";
const file_dates_missing: ValidationErrorKey = "file_dates_missing";
const file_dates_not_unique: ValidationErrorKey = "file_dates_not_unique";
const file_data_not_number: ValidationErrorKey = "file_data_not_number";
const file_org_units_incorrect: ValidationErrorKey = "file_org_units_incorrect";

export function validateCaseSheetData(
    updatedField: FormFileFieldState,
    orgUnits: OrgUnit[]
): ValidationError {
    if (
        !updatedField.value ||
        updatedField.data?.length === 0 ||
        !updatedField.data?.find(sheetData => sheetData.name === SHEET_NAMES.dataEntry)
    ) {
        return {
            property: diseaseOutbreakEventFieldIds.casesDataFile,
            value: updatedField.value,
            errors: ["file_missing"],
        };
    }

    const dataEntrySheetData = updatedField.data?.find(
        sheetData => sheetData.name === SHEET_NAMES.dataEntry
    );
    const metadataSheetData = updatedField.data?.find(
        sheetData => sheetData.name === SHEET_NAMES.metadata
    );

    if (
        !dataEntrySheetData ||
        !metadataSheetData ||
        dataEntrySheetData.headers.length === 0 ||
        dataEntrySheetData.rows.length === 0 ||
        metadataSheetData.headers.length === 0 ||
        metadataSheetData.rows.length === 0
    ) {
        return {
            property: diseaseOutbreakEventFieldIds.casesDataFile,
            value: updatedField.value,
            errors: ["file_empty"],
        };
    }

    const casesDataEntryHeadersNotPresent = Object.values(
        REQUIRED_DATA_ENTRY_COLUMN_HEADERS
    ).filter(header => !doesColumnExist(dataEntrySheetData.headers || [], header));

    const metadataHeadersNotPresent = Object.values(REQUIRED_METADATA_COLUMN_HEADERS).filter(
        header => !doesColumnExist(metadataSheetData.headers || [], header)
    );

    const casesDataEntryRows = mapDistrictNamesToDistrictIdsInDataEntryRows(
        dataEntrySheetData.rows,
        metadataSheetData.rows
    );

    const allDistrictsAndDatesCombinationsInColumn = casesDataEntryRows.map(row => {
        const reportDate = row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.reportDate];
        const districtId = row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district];
        if (reportDate) {
            return reportDate ? `${districtId}-${formatDateToDateString(reportDate)}` : undefined;
        }
    });

    const allOrgUnitIds = orgUnits.map(orgUnit => orgUnit.id);

    const lineWithErrors = casesDataEntryRows.reduce(
        (errors, row, index): Partial<Record<ValidationErrorKey, number[]>> => {
            const orgUnitIncorrect =
                !row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district] ||
                !allOrgUnitIds.includes(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district] || "");

            const reportDate = row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.reportDate];
            const reportDateString = reportDate ? formatDateToDateString(reportDate) : undefined;
            const dateNotPresent = !reportDateString;

            const districtAndDateCombination = `${
                row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district]
            }-${reportDateString}`;

            const repeatedDistrictDateCombination =
                reportDateString &&
                allDistrictsAndDatesCombinationsInColumn.indexOf(districtAndDateCombination) !==
                    index;

            const suspectedNotPresent = isNaN(
                Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.suspectedCases])
            );
            const probableNotPresent = isNaN(
                Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.probableCases])
            );
            const confirmedNotPresent = isNaN(
                Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.confirmedCases])
            );
            const deathsNotPresent = isNaN(Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.deaths]));

            return {
                [file_org_units_incorrect]: orgUnitIncorrect
                    ? [...(errors[file_org_units_incorrect] || []), index + 2]
                    : errors[file_org_units_incorrect],
                [file_dates_missing]: dateNotPresent
                    ? [...(errors[file_dates_missing] || []), index + 2]
                    : errors[file_dates_missing],
                [file_dates_not_unique]: repeatedDistrictDateCombination
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
            [file_headers_missing]: casesDataEntryHeadersNotPresent.length
                ? `${casesDataEntryHeadersNotPresent.join(
                      ", "
                  )} headers in Data entry sheet are missing. Correct headers are: ${Object.values(
                      REQUIRED_DATA_ENTRY_COLUMN_HEADERS
                  ).join(", ")}`
                : undefined,
            [file_headers_missing]: metadataHeadersNotPresent.length
                ? `${metadataHeadersNotPresent.join(
                      ", "
                  )} headers in Metadata sheet are missing. Correct headers are: ${Object.values(
                      REQUIRED_METADATA_COLUMN_HEADERS
                  ).join(", ")}`
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

export function mapDistrictNamesToDistrictIdsInDataEntryRows(
    dataEntryRows: Row[],
    metadataRows: Row[]
): Row[] {
    return dataEntryRows.map(row => {
        const districtName = row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district];
        const districtId = metadataRows.find(
            metadataRow => metadataRow[REQUIRED_METADATA_COLUMN_HEADERS.name] === districtName
        )?.[REQUIRED_METADATA_COLUMN_HEADERS.identifier];

        return {
            ...row,
            [REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district]: districtId || "",
        };
    });
}

export function getCaseDataFromField(
    uploadedCasesSheetData: SheetData[],
    currentUsername: Username
): CaseData[] {
    const dataEntrySheetData = uploadedCasesSheetData.find(
        sheetData => sheetData.name === SHEET_NAMES.dataEntry
    );
    const metadataSheetData = uploadedCasesSheetData.find(
        sheetData => sheetData.name === SHEET_NAMES.metadata
    );

    if (
        !dataEntrySheetData?.headers ||
        !dataEntrySheetData?.rows ||
        !metadataSheetData?.rows ||
        !metadataSheetData?.headers
    ) {
        throw new Error("Case data file is missing");
    }

    const casesDataEntryRows = mapDistrictNamesToDistrictIdsInDataEntryRows(
        dataEntrySheetData.rows,
        metadataSheetData.rows
    );

    const casesData: CaseData[] = casesDataEntryRows
        .map(row => {
            const reportDate = row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.reportDate];
            const reportDateString = reportDate ? formatDateToDateString(reportDate) : undefined;

            const districtId = row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.district];

            if (reportDateString && districtId) {
                return {
                    updatedBy: currentUsername,
                    reportDate: reportDateString,
                    orgUnit: districtId,
                    suspectedCases:
                        Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.suspectedCases]) || 0,
                    probableCases:
                        Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.probableCases]) || 0,
                    confirmedCases:
                        Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.confirmedCases]) || 0,
                    deaths: Number(row[REQUIRED_DATA_ENTRY_COLUMN_HEADERS.deaths]) || 0,
                };
            }
        })
        .filter((caseData): caseData is CaseData => caseData !== undefined);

    return casesData;
}
