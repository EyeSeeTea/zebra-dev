import { Maybe } from "../../../utils/ts-utils";
import { Option } from "../../components/utils/option";
import {
    CasesDataSource,
    DataSource,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";

export type DataSourceFiltersState = {
    onChange: (value: string) => void;
    value: Maybe<string>;
    options: Option[];
    dataSource: Maybe<DataSource>;
};

export function useDataSourceFilter() {
    const { configurations } = useAppContext();
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();

    const isCasesDataUserDefined =
        currentEventTracker?.casesDataSource ===
        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    const defaultDataSource = (currentEventTracker?.dataSource || DataSource.ND1) as string;
    const [dataSourceFilter, setDataSourceFilter] = useState(defaultDataSource);

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
