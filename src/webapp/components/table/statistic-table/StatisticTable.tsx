import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from "@material-ui/core";
import { SearchInput } from "../../search-input/SearchInput";
import i18n from "../../../../utils/i18n";
import { MedianRow } from "./MedianRow";
import { PercentTargetMetRow } from "./PercentTargetMetRow";
import { MultipleSelector } from "../../selector/MultipleSelector";
import { useTableFilters } from "../../../hooks/useTableFilters";
import { useTableCell } from "../../../hooks/useTableCell";
import { ColoredCell } from "./ColoredCell";
import _ from "../../../../domain/entities/generic/Collection";

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

export type FilterType = {
    value: TableColumn["value"];
    label: TableColumn["label"];
    type: "multiselector" | "datepicker";
};

export type FiltersValuesType = {
    [key: TableColumn["value"]]: string[];
};

export type StatisticTableProps = {
    columns: TableColumn[];
    columnRules: {
        [key: TableColumn["value"]]: number;
    };
    editRiskAssessmentColumns: TableColumn["value"][];
    rows: {
        [key: TableColumn["value"]]: string;
    }[];
    filters: FilterType[];
};

export const StatisticTable: React.FC<StatisticTableProps> = React.memo(
    ({ rows, columns, columnRules, editRiskAssessmentColumns, filters: filtersConfig }) => {
        const [searchTerm, setSearchTerm] = useState<string>("");

        const [filters, setFilters] = useState<FiltersValuesType>(
            filtersConfig.reduce((acc: FiltersValuesType, filter) => {
                acc[filter.value] = [];
                return acc;
            }, {})
        );

        const calculateColumns = [...editRiskAssessmentColumns, ...Object.keys(columnRules)];

        const filteredRows = useTableFilters(rows, searchTerm, filters);
        const { getCellColor } = useTableCell(editRiskAssessmentColumns, columnRules);

        const filterOptions = useCallback(
            (column: TableColumn["value"]) => {
                return _(rows)
                    .map(row => ({
                        value: row[column] || "",
                        label: row[column] || "",
                    }))
                    .uniqBy(filter => filter.value)
                    .value();
            },
            [rows]
        );

        return (
            <React.Fragment>
                <Container>
                    {filtersConfig.map(({ value, label }) => (
                        <MultipleSelector
                            id={`filters-${value}`}
                            key={`filters-${value}`}
                            selected={filters[value] || []}
                            placeholder={i18n.t(label)}
                            options={filterOptions(value)}
                            onChange={(values: string[]) => {
                                setFilters({ ...filters, [value]: values });
                            }}
                        />
                    ))}
                    <SearchInput value={searchTerm} onChange={value => setSearchTerm(value)} />
                </Container>
                <StyledTableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map(({ value, label, dark = false }) => (
                                    <HeadTableCell key={value} $dark={dark}>
                                        {label}
                                    </HeadTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((column, columnIndex) =>
                                        calculateColumns.includes(column.value) ? (
                                            <ColoredCell
                                                key={`${rowIndex}-${column.value}`}
                                                value={row[column.value] || ""}
                                                color={getCellColor(
                                                    row[column.value],
                                                    column.value
                                                )}
                                            />
                                        ) : (
                                            <StyledTableCell
                                                key={`${rowIndex}-${column.value}`}
                                                boldUnderline={columnIndex === 0}
                                            >
                                                {row[column.value] || ""}
                                            </StyledTableCell>
                                        )
                                    )}
                                </TableRow>
                            ))}
                            <MedianRow
                                columns={columns}
                                rows={filteredRows}
                                calculateColumns={calculateColumns}
                            />
                            <PercentTargetMetRow
                                columns={columns}
                                rows={filteredRows}
                                calculateColumns={calculateColumns}
                                columnRules={columnRules}
                            />
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </React.Fragment>
        );
    }
);

const StyledTableContainer = styled(TableContainer)`
    border-radius: 4px;
    border: 1px solid ${props => props.theme.palette.common.grey1};

    & .MuiTable-root {
        border-collapse: collapse;
        border-style: hidden;
    }
    & .MuiTableHead-root {
        color: ${props => props.theme.palette.common.greyBlack};
        background-color: ${props => props.theme.palette.common.grey4};
    }
    & .MuiTableBody-root {
        color: ${props => props.theme.palette.common.grey};
    }
    & .MuiTableCell-root {
        min-width: 2rem;
        font-size: 0.75rem;
        white-space: nowrap;
        border: 1px solid ${props => props.theme.palette.common.grey};
        padding-inline: 0.5rem;
        padding-block: 0.625rem;
    }
`;

const HeadTableCell = styled(TableCell)<{ $dark?: boolean }>`
    background-color: ${props => (props.$dark ? props.theme.palette.common.grey2 : "initial")};
    color: ${props => (props.$dark ? props.theme.palette.common.white : "initial")};
    font-weight: 600;
`;

const StyledTableCell = styled(TableCell)<{ boldUnderline?: boolean }>`
    text-decoration: ${props => (props.boldUnderline ? "underline" : "none")};
    font-weight: ${props => (props.boldUnderline ? "600" : "initial")};
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;
    gap: 1rem;
`;
