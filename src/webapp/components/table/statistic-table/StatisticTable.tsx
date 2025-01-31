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
import { useTableCell } from "./useTableCell";
import { useStatisticCalculations } from "./useStatisticCalculations";
import { ColoredCell } from "./ColoredCell";
import { CalculationRow } from "./CalculationRow";
import { Option } from "../../utils/option";
import { Maybe } from "../../../../utils/ts-utils";
import { Link } from "react-router-dom";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { DateRangePicker } from "../../date-picker/DateRangePicker";
import { useAppContext } from "../../../contexts/app-context";
import { Selector } from "../../selector/Selector";
import { DataSource } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

export type Order<T> = {
    name: keyof T;
    direction: "asc" | "desc";
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

type Row = { [key: TableColumn["value"]]: string };

export type StatisticTableProps = {
    columns: TableColumn[];
    columnRules: {
        [key: TableColumn["value"]]: number;
    };
    editRiskAssessmentColumns?: TableColumn["value"][];
    rows: Row[];
    paginatedRows?: Row[];
    filtersConfig: FiltersConfig[];
    order: Maybe<Order<Row>>;
    onOrderBy: (columnValue: string) => void;
    isPaginated?: boolean;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filters: FiltersValuesType;
    setFilters: Dispatch<SetStateAction<FiltersValuesType>>;
    filterOptions: (column: string, dataSource?: DataSource) => { value: string; label: string }[];
    allowGoToEventOnClick?: boolean;
    eventSourceOptions: Option[];
    eventSourceSelected: string;
    setEventSourceSelected: (selection: string) => void;
    hasEventSourceFilter?: boolean;
};

const DEFAULT_ARRAY_VALUE: string[] = [];

export const StatisticTable: React.FC<StatisticTableProps> = React.memo(
    ({
        rows,
        paginatedRows,
        columns,
        columnRules,
        editRiskAssessmentColumns = DEFAULT_ARRAY_VALUE,
        filtersConfig,
        order,
        onOrderBy,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        filterOptions,
        eventSourceOptions,
        eventSourceSelected,
        setEventSourceSelected,
        allowGoToEventOnClick = false,
        hasEventSourceFilter = false,
    }) => {
        const { generatePath } = useRoutes();
        const { currentUser } = useAppContext();

        const calculateColumns = [...editRiskAssessmentColumns, ...Object.keys(columnRules)];
        const { getCellColor } = useTableCell(editRiskAssessmentColumns, columnRules);
        const { calculateMedian, calculatePercentTargetMet } = useStatisticCalculations(
            rows,
            columnRules
        );

        const isCurrentUserIncidentManager = useCallback(
            (username: string) => {
                return currentUser.username === username;
            },
            [currentUser.username]
        );

        return (
            <React.Fragment>
                <Container>
                    {hasEventSourceFilter && (
                        <Selector
                            id={`filters-event-source`}
                            options={eventSourceOptions}
                            placeholder={i18n.t("Event Source")}
                            selected={eventSourceSelected}
                            onChange={setEventSourceSelected}
                            allowClear
                        />
                    )}
                    {filtersConfig.map(({ value, label, type }) => {
                        switch (type) {
                            case "multiselector":
                                return (
                                    <MultipleSelector
                                        id={`filters-${label}-${value}`}
                                        key={`filters-${label}-${value}`}
                                        selected={filters[value] || []}
                                        placeholder={i18n.t(label)}
                                        options={filterOptions(
                                            value,
                                            eventSourceSelected as DataSource
                                        )}
                                        onChange={(values: string[]) => {
                                            setFilters({ ...filters, [value]: values });
                                        }}
                                    />
                                );
                            case "datepicker":
                                return (
                                    <DurationFilterContainer>
                                        <DateRangePicker
                                            key={`filters-${label}-${value}`}
                                            value={filters[value] || []}
                                            onChange={(values: string[]) => {
                                                setFilters({ ...filters, [value]: values });
                                            }}
                                            placeholder={i18n.t(label)}
                                        />
                                    </DurationFilterContainer>
                                );
                            default:
                                return null;
                        }
                    })}
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
                            {(paginatedRows || rows).map((row, rowIndex) => (
                                <StyledTableRow
                                    key={rowIndex}
                                    $isHighlighted={isCurrentUserIncidentManager(
                                        row.incidentManagerUsername || ""
                                    )}
                                >
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
                                                $link={columnIndex === 0 && allowGoToEventOnClick}
                                            >
                                                {row.id && allowGoToEventOnClick ? (
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
                                </StyledTableRow>
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

const StyledTableRow = styled(TableRow)<{ $isHighlighted?: boolean }>`
    background-color: ${props =>
        props.$isHighlighted ? props.theme.palette.common.green100 : "initial"};
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
    width: 100%;
    gap: 1rem;
`;

const DurationFilterContainer = styled.div`
    max-width: 250px;
    width: 100%;
`;
