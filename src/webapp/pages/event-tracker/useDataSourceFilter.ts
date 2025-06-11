import { Option } from "../../components/utils/option";
import {
    CasesDataSource,
    DataSource,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { Maybe } from "../../../utils/ts-utils";

export type DataSourceFiltersState = {
    onChange: (value: string) => void;
    value: string;
    options: Option[];
    dataSource: Maybe<DataSource>;
};

export function useDataSourceFilter() {
    const { configurations } = useAppContext();
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();

    const [dataSourceFilter, setDataSourceFilter] = useState("");

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

    const dataSourceValue = useMemo(() => {
        const dataSource = dataSourceFilter || currentEventTracker?.dataSource;
        const isCasesDataUserDefined =
            currentEventTracker?.casesDataSource ===
            CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

        return {
            value: dataSource || DataSource.ND1.toString(),
            dataSource: isCasesDataUserDefined
                ? undefined
                : Object.values(DataSource).find(v => v === dataSource) || DataSource.ND1,
        };
    }, [dataSourceFilter, currentEventTracker]);

    return {
        onChange: setDataSourceFilter,
        value: dataSourceValue.value,
        options: dataSourceOptions,
        dataSource: dataSourceValue.dataSource,
    };
}
