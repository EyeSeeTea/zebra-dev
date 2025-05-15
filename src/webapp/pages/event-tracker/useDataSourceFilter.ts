import { Maybe } from "../../../utils/ts-utils";
import { Option } from "../../components/utils/option";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";

export type DataSourceFiltersState = {
    onChange: (value: string) => void;
    value: Maybe<string>;
    options: Option[];
    dataSource: Maybe<DataSource>;
};

export function useDataSourceFilter(isCasesDataUserDefined: boolean) {
    const { configurations } = useAppContext();
    const [dataSourceFilter, setDataSourceFilter] = useState(DataSource.ND1 as string);

    const dataSourceOptions = useMemo(
        () =>
            configurations.selectableOptions.eventTrackerConfigurations.dataSources.map(
                dataSource => ({
                    value: dataSource.id,
                    label: dataSource.name,
                })
            ),
        [configurations]
    );

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

    return {
        onChange: setDataSourceFilter,
        value: dataSourceValue.value,
        options: dataSourceOptions,
        dataSource: dataSourceValue.dataSource,
    };
}
