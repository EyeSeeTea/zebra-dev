import { Option } from "../../components/utils/option";
import { useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import {
    DataSourceCode,
    dataSourceCodes,
    isDataSourceCode,
} from "../../../domain/entities/DataSource";
import { Maybe } from "../../../utils/ts-utils";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export type DataSourceFiltersState = {
    onChange: (value: string) => void;
    value: string;
    options: Option[];
    dataSource: Maybe<DataSourceCode>;
};

export function useDataSourceFilter() {
    const { dataSources } = useAppContext();
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();

    const [dataSourceFilter, setDataSourceFilter] = useState("");

    const dataSourceOptions = useMemo(
        () =>
            dataSources.map(dataSource => ({
                value: dataSource.code,
                label: dataSource.name,
            })),
        [dataSources]
    );

    const dataSourceValue = useMemo(() => {
        const dataSource = dataSourceFilter || currentEventTracker?.dataSource;
        const isCasesDataUserDefined =
            currentEventTracker?.casesDataSource ===
            CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

        return {
            value: dataSource || dataSourceCodes.ND1,
            dataSource: isCasesDataUserDefined
                ? undefined
                : isDataSourceCode(dataSource)
                ? dataSourceCodes[dataSource]
                : dataSourceCodes.ND1,
        };
    }, [dataSourceFilter, currentEventTracker]);

    return {
        onChange: setDataSourceFilter,
        value: dataSourceValue.value,
        options: dataSourceOptions,
        dataSource: dataSourceValue.dataSource,
    };
}
