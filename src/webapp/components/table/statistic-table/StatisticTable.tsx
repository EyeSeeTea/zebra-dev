import React, { Dispatch, SetStateAction, useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../../utils/i18n";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    TableSortLabel,
} from "@material-ui/core";
import { SearchInput } from "../../search-input/SearchInput";
import { MultipleSelector } from "../../selector/MultipleSelector";
import { useTableFilters } from "./useTableFilters";
import { useTableCell } from "./useTableCell";
import { useStatisticCalculations } from "./useStatisticCalculations";
import { ColoredCell } from "./ColoredCell";
import { CalculationRow } from "./CalculationRow";
import { Order } from "../../../pages/dashboard/usePerformanceOverview";
import { Option } from "../../utils/option";
import { Maybe } from "../../../../utils/ts-utils";
import { PerformanceOverviewMetrics } from "../../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Link } from "react-router-dom";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

export type FiltersConfig = {
    value: TableColumn["value"];
    label: TableColumn["label"];
    type: "multiselector" | "datepicker";
    options?: Option<string>[];
    disabled?: boolean;
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
    filters: FiltersConfig[];
    order: Maybe<Order>;
    setOrder: Dispatch<SetStateAction<Maybe<Order>>>;
};

export const StatisticTable: React.FC<StatisticTableProps> = React.memo(
    ({
        rows,
        columns,
        columnRules,
        editRiskAssessmentColumns,
        filters: filtersConfig,
        order,
        setOrder,
    }) => {
        const { generatePath } = useRoutes();

        const calculateColumns = [...editRiskAssessmentColumns, ...Object.keys(columnRules)];

        const { searchTerm, setSearchTerm, filters, setFilters, filteredRows, filterOptions } =
            useTableFilters(rows, filtersConfig);
        const { getCellColor } = useTableCell(editRiskAssessmentColumns, columnRules);
        const { calculateMedian, calculatePercentTargetMet } = useStatisticCalculations(
            filteredRows,
            columnRules
        );

        const onOrderBy = useCallback(
            (value: string) => {
                setOrder(prevOrder => {
                    return {
                        name: value as keyof PerformanceOverviewMetrics,
                        direction:
                            prevOrder?.name === value
                                ? order?.direction === "asc"
                                    ? "desc"
                                    : "asc"
                                : "asc",
                    };
                });
            },
            [order, setOrder]
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map(({ value, label, dark = false }) => (
                                    <HeadTableCell
                                        key={value}
                                        $dark={dark}
                                        sortDirection={
                                            order?.name === value ? order.direction : false
                                        }
                                    >
                                        <TableSortLabel
                                            active={order?.name === value}
                                            direction={
                                                order?.name === value ? order?.direction : "asc"
                                            }
                                            onClick={() => onOrderBy(value)}
                                        >
                                            {label}
                                        </TableSortLabel>
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
                                                $link={columnIndex === 0}
                                            >
                                                {row.id ? (
                                                    <StyledLink
                                                        to={generatePath(RouteName.EVENT_TRACKER, {
                                                            id: row.id,
                                                        })}
                                                        $link={columnIndex === 0}
                                                    >
                                                        {row[column.value]}
                                                    </StyledLink>
                                                ) : (
                                                    row[column.value]
                                                )}
                                            </StyledTableCell>
                                        )
                                    )}
                                </TableRow>
                            ))}
                            <CalculationRow
                                columns={columns}
                                calculateColumns={calculateColumns}
                                label={i18n.t("Median")}
                                calculate={calculateMedian}
                            />
                            <CalculationRow
                                columns={columns}
                                calculateColumns={calculateColumns}
                                label={i18n.t("% Target Met")}
                                calculate={calculatePercentTargetMet}
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
        background-color: ${props => props.theme.palette.common.white};
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

const StyledTableCell = styled(TableCell)<{ $link?: boolean }>`
    text-decoration: ${props => (props.$link ? "underline" : "none")};
    cursor: ${props => (props.$link ? "pointer" : "initial")};
    font-weight: ${props => (props.$link ? "600" : "initial")};
`;

const StyledLink = styled(Link)<{ $link?: boolean }>`
    text-decoration: ${props => (props.$link ? "underline" : "none")};
    cursor: ${props => (props.$link ? "pointer" : "initial")};
    font-weight: ${props => (props.$link ? "600" : "initial")};
    color: ${props => props.theme.palette.text.primary};
    width: 100%;
    height: 100%;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;
    gap: 1rem;
`;
