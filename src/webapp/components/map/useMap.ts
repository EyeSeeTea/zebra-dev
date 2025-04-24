import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import {
    MapKey,
    MapProgramIndicator,
    MapProgramIndicatorsDatastoreKey,
} from "../../../domain/entities/MapConfig";
import i18n from "../../../utils/i18n";
import { Maybe } from "../../../utils/ts-utils";
import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

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
    dashboardDatastoreKey: MapProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts;
    programIndicatorId: string;
    programIndicatorName: string;
    orgUnits: string[];
};

type LoadedState = {
    kind: "loaded";
    data: FilteredMapConfig;
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
    eventHazardCode?: string;
    casesDataSource?: CasesDataSource;
    dateRangeFilter?: string[];
    singleSelectFilters?: Record<string, string>;
    multiSelectFilters?: Record<string, string[]>;
}): MapState {
    const {
        mapKey,
        allOrgUnitsIds,
        eventDiseaseCode,
        eventHazardCode,
        casesDataSource,
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
            const mapProgramIndicator = getFilteredActiveVerifiedMapProgramIndicator(
                mapProgramIndicators,
                singleSelectFilters
            );

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
                !newMapIndicator &&
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
                                programIndicatorId: newMapIndicator
                                    ? newMapIndicator.id
                                    : prevMapConfigState.data.programIndicatorId,
                                programIndicatorName: newMapIndicator
                                    ? newMapIndicator.name
                                    : prevMapConfigState.data.programIndicatorName,
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
            (eventDiseaseCode || eventHazardCode) &&
            (newStartDate !== mapConfigState.data.startDate ||
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
        eventHazardCode,
        mapConfigState,
        mapKey,
        mapProgramIndicators,
        multiSelectFilters,
        singleSelectFilters,
        dateRangeFilter,
        defaultStartDate,
    ]);

    useEffect(() => {
        if (
            mapKey === "event_tracker" &&
            !eventDiseaseCode &&
            !eventHazardCode &&
            !casesDataSource
        ) {
            return;
        }

        compositionRoot.maps.getConfig.execute(mapKey, casesDataSource).run(
            config => {
                setMapProgramIndicators(config.programIndicators);
                setDefaultStartDate(config.startDate);

                const mapProgramIndicator =
                    mapKey === "dashboard"
                        ? getMainActiveVerifiedMapProgramIndicator(config.programIndicators)
                        : getCasesMapProgramIndicator(config.programIndicators, eventDiseaseCode);

                if (!mapProgramIndicator || allOrgUnitsIds.length === 0) {
                    setMapConfigState({
                        kind: "error",
                        message: i18n.t("Map not found."),
                    });
                    return;
                }

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
                        dashboardDatastoreKey: config.dashboardDatastoreKey,
                        programIndicatorId: mapProgramIndicator.id,
                        programIndicatorName: mapProgramIndicator.name,
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
    }, [
        compositionRoot.maps.getConfig,
        mapKey,
        allOrgUnitsIds,
        eventDiseaseCode,
        eventHazardCode,
        casesDataSource,
    ]);

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
    disease: Maybe<string>
): Maybe<MapProgramIndicator> {
    return programIndicators.find(indicator => indicator.disease === disease);
}

function getFilteredActiveVerifiedMapProgramIndicator(
    programIndicators: MapProgramIndicator[],
    singleSelectFilters?: Record<string, string>
): Maybe<MapProgramIndicator> {
    if (!singleSelectFilters || Object.values(singleSelectFilters).every(value => !value)) {
        return getMainActiveVerifiedMapProgramIndicator(programIndicators);
    } else {
        const {
            disease: diseaseFilterValue,
            hazard: hazardFilterValue,
            incidentStatus: incidentStatusFilterValue,
        } = singleSelectFilters;

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
                    (!hazardFilterValue && !diseaseFilterValue && isAllDiseaseIndicator) ||
                    (!hazardFilterValue && !diseaseFilterValue) ||
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
