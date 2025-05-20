import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import {
    MapKey,
    MapProgramIndicator,
    MapProgramIndicatorsDatastoreKey,
} from "../../../domain/entities/MapConfig";
import i18n from "../../../utils/i18n";
import { Maybe } from "../../../utils/ts-utils";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type LoadingState = {
    kind: "loading";
};

export type FilteredMapConfig = {
    currentApp: "ZEBRA";
    currentPage: string;
    mapId: string;
    programId: string;
    programName: string;
    startDate: string;
    endDate?: string;
    timeField: string;
    zebraNamespace: "zebra";
    mapProgramIndicatorDatastoreKey: MapProgramIndicatorsDatastoreKey;
    programIndicatorId: string;
    programIndicatorName: string;
    orgUnits: string[];
};

export type EventTrackerFilteredMapConfig = FilteredMapConfig & {
    diseaseCode: string;
};

type LoadedState = {
    kind: "loaded";
    data: FilteredMapConfig | EventTrackerFilteredMapConfig;
};

type ErrorState = {
    kind: "error";
    message: string;
};

type MapConfigState = LoadingState | LoadedState | ErrorState;

type MapState = {
    mapConfigState: MapConfigState;
};

export function useMap(params: {
    mapKey: MapKey;
    allOrgUnitsIds: string[];
    eventDiseaseCode?: string;
    dataSource?: DataSource;
    dateRangeFilter?: string[];
    singleSelectFilters?: Record<string, string>;
    multiSelectFilters?: Record<string, string[]>;
}): MapState {
    const {
        mapKey,
        allOrgUnitsIds,
        eventDiseaseCode,
        dataSource,
        dateRangeFilter,
        singleSelectFilters,
        multiSelectFilters,
    } = params;
    const { compositionRoot } = useAppContext();
    const [mapProgramIndicators, setMapProgramIndicators] = useState<MapProgramIndicator[]>([]);
    const [mapConfigState, setMapConfigState] = useState<MapConfigState>({
        kind: "loading",
    });
    const [defaultStartDate, setDefaultStartDate] = useState<string>("");

    useEffect(() => {
        if (mapConfigState.kind !== "loaded") return;

        const newStartDate =
            dateRangeFilter?.length && dateRangeFilter[0] ? dateRangeFilter[0] : defaultStartDate;

        const newEndDate =
            dateRangeFilter?.length && dateRangeFilter[1] ? dateRangeFilter[1] : undefined;

        const isDashboardMapAndThereAreFilters =
            mapKey === "dashboard" &&
            allOrgUnitsIds.length &&
            (!!singleSelectFilters || !!multiSelectFilters);

        if (isDashboardMapAndThereAreFilters) {
            const newOrgUnits =
                multiSelectFilters &&
                multiSelectFilters?.province?.length &&
                orgUnitsHaveChanged(multiSelectFilters?.province, mapConfigState.data.orgUnits)
                    ? multiSelectFilters.province
                    : !multiSelectFilters?.province?.length &&
                      orgUnitsHaveChanged(allOrgUnitsIds, mapConfigState.data.orgUnits)
                    ? allOrgUnitsIds
                    : null;

            if (
                !newOrgUnits &&
                newStartDate === mapConfigState.data.startDate &&
                newEndDate === mapConfigState.data.endDate
            ) {
                return;
            } else {
                setMapConfigState(prevMapConfigState => {
                    if (prevMapConfigState.kind === "loaded") {
                        return {
                            kind: "loaded",
                            data: {
                                ...prevMapConfigState.data,
                                orgUnits: newOrgUnits
                                    ? newOrgUnits
                                    : prevMapConfigState.data.orgUnits,
                                startDate: newStartDate,
                                endDate: newEndDate,
                            },
                        };
                    } else {
                        return prevMapConfigState;
                    }
                });
            }
        }

        if (
            mapKey === "event_tracker" &&
            (eventDiseaseCode !==
                (mapConfigState.data as EventTrackerFilteredMapConfig).diseaseCode ||
                newStartDate !== mapConfigState.data.startDate ||
                newEndDate !== mapConfigState.data.endDate)
        ) {
            setMapConfigState(prevMapConfigState => {
                if (prevMapConfigState.kind === "loaded") {
                    return {
                        kind: "loaded",
                        data: {
                            ...prevMapConfigState.data,
                            startDate: newStartDate,
                            endDate: newEndDate,
                            diseaseCode: eventDiseaseCode,
                        },
                    };
                } else {
                    return prevMapConfigState;
                }
            });
        }
    }, [
        allOrgUnitsIds,
        eventDiseaseCode,
        mapConfigState,
        mapKey,
        mapProgramIndicators,
        multiSelectFilters,
        singleSelectFilters,
        dateRangeFilter,
        defaultStartDate,
    ]);

    //update indicator based on filter updates
    useEffect(() => {
        if (mapConfigState.kind !== "loaded") return;

        const mapProgramIndicator =
            mapKey === "dashboard"
                ? getFilteredActiveVerifiedMapProgramIndicator(
                      mapProgramIndicators,
                      singleSelectFilters
                  )
                : getCasesMapProgramIndicator(mapProgramIndicators, eventDiseaseCode, dataSource);

        if (!mapProgramIndicator) {
            setMapConfigState({
                kind: "error",
                message: i18n.t("The map with these filters could not be found."),
            });
            return;
        }

        const newMapIndicator =
            mapProgramIndicator?.id !== mapConfigState.data.programIndicatorId
                ? mapProgramIndicator
                : null;

        if (newMapIndicator) {
            setMapConfigState(prevMapConfigState => {
                if (prevMapConfigState.kind === "loaded") {
                    return {
                        kind: "loaded",
                        data: {
                            ...prevMapConfigState.data,
                            programIndicatorId:
                                newMapIndicator?.id || prevMapConfigState.data.programIndicatorId,
                            programIndicatorName:
                                newMapIndicator?.name ||
                                prevMapConfigState.data.programIndicatorName,
                        },
                    };
                } else {
                    return prevMapConfigState;
                }
            });
        }
    }, [
        mapConfigState,
        dataSource,
        mapProgramIndicators,
        singleSelectFilters,
        eventDiseaseCode,
        mapKey,
    ]);

    useEffect(() => {
        if (mapKey === "event_tracker" && !eventDiseaseCode) {
            return;
        }

        compositionRoot.maps.getConfig.execute(mapKey).run(
            config => {
                setMapProgramIndicators(config.programIndicators);
                setDefaultStartDate(config.startDate);

                setMapConfigState({
                    kind: "loaded",
                    data: {
                        currentApp: config.currentApp,
                        currentPage: config.currentPage,
                        mapId: config.mapId,
                        programId: config.programId,
                        programName: config.programName,
                        startDate: config.startDate,
                        timeField: config.timeField,
                        zebraNamespace: config.zebraNamespace,
                        mapProgramIndicatorDatastoreKey: config.mapProgramIndicatorDatastoreKey,
                        programIndicatorId: "",
                        programIndicatorName: "",
                        orgUnits: allOrgUnitsIds,
                    },
                });
            },
            error => {
                console.error({ error });
                setMapConfigState({
                    kind: "error",
                    message: i18n.t(`An error occurred while loading the map: ${error.message}`),
                });
            }
        );
    }, [compositionRoot.maps.getConfig, mapKey, allOrgUnitsIds, eventDiseaseCode]);

    return {
        mapConfigState,
    };
}

function getMainActiveVerifiedMapProgramIndicator(
    programIndicators: MapProgramIndicator[]
): Maybe<MapProgramIndicator> {
    return programIndicators.find(
        indicator => indicator.disease === "ALL" && indicator.incidentStatus === "ALL"
    );
}

function getCasesMapProgramIndicator(
    programIndicators: MapProgramIndicator[],
    disease: Maybe<string>,
    dataSource: Maybe<string>
): Maybe<MapProgramIndicator> {
    return programIndicators.find(
        indicator => indicator.disease === disease && indicator.dataSource === (dataSource || null)
    );
}

function getFilteredActiveVerifiedMapProgramIndicator(
    programIndicators: MapProgramIndicator[],
    singleSelectFilters?: Record<string, string>
): Maybe<MapProgramIndicator> {
    if (!singleSelectFilters || Object.values(singleSelectFilters).every(value => !value)) {
        return getMainActiveVerifiedMapProgramIndicator(programIndicators);
    } else {
        const { disease: diseaseFilterValue, incidentStatus: incidentStatusFilterValue } =
            singleSelectFilters;

        return programIndicators.find(indicator => {
            const isIndicatorDisease =
                diseaseFilterValue && indicator.disease === diseaseFilterValue;
            const isIndicatorIncidentStatus =
                incidentStatusFilterValue && indicator.incidentStatus === incidentStatusFilterValue;

            const isAllIncidentStatusIndicator = indicator.incidentStatus === "ALL";
            const isAllDiseaseIndicator = indicator.disease === "ALL";

            if (isIndicatorDisease) {
                return (
                    isIndicatorIncidentStatus ||
                    (!incidentStatusFilterValue && isAllIncidentStatusIndicator)
                );
            } else if (isIndicatorIncidentStatus) {
                return (
                    (!diseaseFilterValue && isAllDiseaseIndicator) ||
                    !diseaseFilterValue ||
                    isIndicatorDisease
                );
            }

            return false;
        });
    }
}

function orgUnitsHaveChanged(provincesFilter: string[], currentOrgUnits: string[]): boolean {
    if (provincesFilter.length !== currentOrgUnits.length) {
        return true;
    }

    return !provincesFilter.every((value, index) => value === currentOrgUnits[index]);
}
