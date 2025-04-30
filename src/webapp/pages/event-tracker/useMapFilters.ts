import { useMemo, useState } from "react";

import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/utils/option";
import { Maybe } from "../../../utils/ts-utils";

export type MapFiltersState = {
    dateRangeFilter: {
        onChange: (value: string[]) => void;
        value: string[];
    };
    dataSourceFilter: {
        onChange: (value: string) => void;
        value: Maybe<string>;
        options: Option[];
    };
};

export function useMapFilters(isCasesDataUserDefined: boolean): MapFiltersState {
    const { configurations } = useAppContext();
    const [selectedRangeDateFilter, setSelectedRangeDateFilter] = useState<string[]>([]);
    const [dataSourceFilter, setDataSourceFilter] = useState(DataSource.ND1 as string);

    const dataSourceValue = useMemo(
        () => (isCasesDataUserDefined ? undefined : dataSourceFilter),
        [isCasesDataUserDefined, dataSourceFilter]
    );

    const dataSouceOptions =
        configurations.selectableOptions.eventTrackerConfigurations.dataSources.map(dataSource => ({
            value: dataSource.id,
            label: dataSource.name,
        }));

    return {
        dateRangeFilter: {
            onChange: setSelectedRangeDateFilter,
            value: selectedRangeDateFilter,
        },
        dataSourceFilter: {
            onChange: setDataSourceFilter,
            value: dataSourceValue,
            options: dataSouceOptions,
        },
    };
}
