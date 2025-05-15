import { useState } from "react";

import { DataSourceFiltersState, useDataSourceFilter } from "./useDataSourceFilter";

export type MapFiltersState = {
    dateRangeFilter: {
        onChange: (value: string[]) => void;
        value: string[];
    };
    dataSourceFilter: DataSourceFiltersState;
};

export function useMapFilters(isCasesDataUserDefined: boolean): MapFiltersState {
    const [selectedRangeDateFilter, setSelectedRangeDateFilter] = useState<string[]>([]);
    const dataSourceFilter = useDataSourceFilter(isCasesDataUserDefined);

    return {
        dateRangeFilter: {
            onChange: setSelectedRangeDateFilter,
            value: selectedRangeDateFilter,
        },
        dataSourceFilter: dataSourceFilter,
    };
}
