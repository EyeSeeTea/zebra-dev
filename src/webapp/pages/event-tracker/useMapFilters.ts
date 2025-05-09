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
        dataSource: Maybe<DataSource>;
    };
};

export function useMapFilters(isCasesDataUserDefined: boolean): MapFiltersState {
    const { configurations } = useAppContext();
    const [selectedRangeDateFilter, setSelectedRangeDateFilter] = useState<string[]>([]);
    const [dataSourceFilter, setDataSourceFilter] = useState(DataSource.ND1 as string);

    const dataSourceValue = useMemo(
        () =>
            isCasesDataUserDefined
                ? {}
                : {
                      value: dataSourceFilter,
                      dataSource:
                          Object.values(DataSource).find(v => v === dataSourceFilter) ||
                          DataSource.ND1,
                  },
        [isCasesDataUserDefined, dataSourceFilter]
    );

    const dataSouceOptions = useMemo(
        () =>
            configurations.selectableOptions.eventTrackerConfigurations.dataSources.map(
                dataSource => ({
                    value: dataSource.id,
                    label: dataSource.name,
                })
            ),
        [configurations]
    );

    return {
        dateRangeFilter: {
            onChange: setSelectedRangeDateFilter,
            value: selectedRangeDateFilter,
        },
        dataSourceFilter: {
            onChange: setDataSourceFilter,
            value: dataSourceValue.value,
            options: dataSouceOptions,
            dataSource: dataSourceValue.dataSource,
        },
    };
}
