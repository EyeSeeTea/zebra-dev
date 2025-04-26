import { useMemo, useState } from "react";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/utils/option";

const dataSourceValues = Object.values(DataSource);

export type MapFiltersState = {
    dateRangeFilter: {
        onChange: (value: string[]) => void;
        value: string[];
    };
    dataSourceFilter: {
        onChange: (value: string) => void;
        value: string;
        options: Option[];
    };
    multipleSelectFilters: {
        dataSource: string[];
    };
};

export function useMapFilters(): MapFiltersState {
    const { configurations } = useAppContext();

    const [selectedRangeDateFilter, setSelectedRangeDateFilter] = useState<string[]>([]);
    const [dataSourceFilter, setDataSourceFilter] = useState<string>("");

    const multipleSelectFilters = useMemo(() => {
        const newFilters = dataSourceFilter ? [dataSourceFilter] : dataSourceValues;
        return { dataSource: newFilters };
    }, [dataSourceFilter]);

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
            value: dataSourceFilter,
            options: dataSouceOptions,
        },
        multipleSelectFilters: multipleSelectFilters,
    };
}
