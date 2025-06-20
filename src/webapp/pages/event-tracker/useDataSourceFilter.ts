import { Option } from "../../components/utils/option";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";

export type DataSourceFiltersState = {
    onChange: (value: string) => void;
    value: string;
    options: Option[];
    dataSource: DataSource;
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

        return {
            value: dataSource || DataSource.ND1.toString(),
            dataSource: Object.values(DataSource).find(v => v === dataSource) || DataSource.ND1,
        };
    }, [dataSourceFilter, currentEventTracker]);

    return {
        onChange: setDataSourceFilter,
        value: dataSourceValue.value,
        options: dataSourceOptions,
        dataSource: dataSourceValue.dataSource,
    };
}
