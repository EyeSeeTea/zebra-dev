import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import {
    MapKey,
    MapProgramIndicator,
    MapProgramIndicatorsDatastoreKey,
} from "../../../domain/entities/MapConfig";
import i18n from "../../../utils/i18n";
import { Maybe } from "../../../utils/ts-utils";

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
    singleSelectFilters?: Record<string, string>;
    multiSelectFilters?: Record<string, string[]>;
}): MapState {
    const {
        mapKey,
        allOrgUnitsIds,
        eventDiseaseCode,
        eventHazardCode,
        singleSelectFilters,
        multiSelectFilters,
    } = params;
    const { compositionRoot } = useAppContext();
    const [mapProgramIndicators, setMapProgramIndicators] = useState<MapProgramIndicator[]>([]);
    const [mapConfigState, setMapConfigState] = useState<MapConfigState>({
        kind: "loading",
    });

    useEffect(() => {
        if (mapConfigState.kind !== "loaded") return;

        const newStartDate =
            multiSelectFilters?.duration?.length &&
            multiSelectFilters.duration[0] &&
            multiSelectFilters.duration[0] !== mapConfigState.data.startDate
                ? multiSelectFilters.duration[0]
                : null;

        const newEndDate =
            multiSelectFilters?.duration?.length &&
            multiSelectFilters.duration[1] &&
            multiSelectFilters.duration[1] !== mapConfigState.data.endDate
                ? multiSelectFilters.duration[1]
                : null;

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

            if (!newMapIndicator && !newOrgUnits && !newStartDate && !newEndDate) {
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
                                startDate: newStartDate
                                    ? newStartDate
                                    : prevMapConfigState.data.startDate,
                                endDate: newEndDate ? newEndDate : prevMapConfigState.data.endDate,
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
            (newStartDate || newEndDate)
        ) {
            setMapConfigState(prevMapConfigState => {
                if (prevMapConfigState.kind === "loaded") {
                    return {
                        kind: "loaded",
                        data: {
                            ...prevMapConfigState.data,
                            startDate: newStartDate
                                ? newStartDate
                                : prevMapConfigState.data.startDate,
                            endDate: newEndDate ? newEndDate : prevMapConfigState.data.endDate,
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
    ]);

    useEffect(() => {
        if (mapKey === "event_tracker" && !eventDiseaseCode && !eventHazardCode) {
            return;
        }

        compositionRoot.maps.getConfig.execute(mapKey).run(
            config => {
                setMapProgramIndicators(config.programIndicators);

                const mapProgramIndicator =
                    mapKey === "dashboard"
                        ? getMainActiveVerifiedMapProgramIndicator(config.programIndicators)
                        : getCasesMapProgramIndicator(
                              config.programIndicators,
                              eventDiseaseCode,
                              eventHazardCode
                          );

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
    }, [compositionRoot.maps.getConfig, mapKey, allOrgUnitsIds, eventDiseaseCode, eventHazardCode]);

    return {
        mapConfigState,
    };
}

function getMainActiveVerifiedMapProgramIndicator(
    programIndicators: MapProgramIndicator[]
): Maybe<MapProgramIndicator> {
    return programIndicators.find(
        indicator =>
            indicator.disease === "ALL" &&
            indicator.hazardType === "ALL" &&
            indicator.incidentStatus === "ALL"
    );
}

function getCasesMapProgramIndicator(
    programIndicators: MapProgramIndicator[],
    disease: Maybe<string>,
    hazardType: Maybe<string>
): Maybe<MapProgramIndicator> {
    return programIndicators.find(
        indicator => indicator.disease === disease || indicator.hazardType === hazardType
    );
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
            const isIndicatorHazardType =
                hazardFilterValue && indicator.hazardType === hazardFilterValue;
            const isIndicatorIncidentStatus =
                incidentStatusFilterValue && indicator.incidentStatus === incidentStatusFilterValue;

            const isAllIncidentStatusIndicator = indicator.incidentStatus === "ALL";
            const isAllDiseaseIndicator = indicator.disease === "ALL";
            const isAllHazardTypeIndicator = indicator.hazardType === "ALL";

            if (isIndicatorDisease) {
                return (
                    isIndicatorIncidentStatus ||
                    (!incidentStatusFilterValue && isAllIncidentStatusIndicator)
                );
            } else if (isIndicatorHazardType) {
                return (
                    isIndicatorIncidentStatus ||
                    (!incidentStatusFilterValue && isAllIncidentStatusIndicator)
                );
            } else if (isIndicatorIncidentStatus) {
                return (
                    (!hazardFilterValue && !diseaseFilterValue && isAllDiseaseIndicator) ||
                    (!hazardFilterValue && !diseaseFilterValue && isAllHazardTypeIndicator) ||
                    isIndicatorDisease ||
                    isIndicatorHazardType
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
