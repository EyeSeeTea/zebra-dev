import { useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";
import {
    MapKey,
    MapProgramIndicator,
    MapProgramIndicatorsDatastoreKey,
} from "../../../../domain/entities/MapConfig";
import i18n from "../../../../utils/i18n";
import { Maybe } from "../../../../utils/ts-utils";

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

export function useMap(
    mapKey: MapKey,
    allOrgUnitsIds: Maybe<string[]>,
    singleSelectFilters?: Record<string, string>,
    multiSelectFilters?: Record<string, string[]>
): MapState {
    const { compositionRoot } = useAppContext();
    const [mapProgramIndicators, setMapProgramIndicators] = useState<MapProgramIndicator[]>([]);
    const [mapConfigState, setMapConfigState] = useState<MapConfigState>({
        kind: "loading",
    });

    useEffect(() => {
        if (
            mapConfigState.kind === "loaded" &&
            allOrgUnitsIds?.length &&
            (!!singleSelectFilters || !!multiSelectFilters)
        ) {
            const mapProgramIndicator = getFilteredMapProgramIndicator(
                mapProgramIndicators,
                singleSelectFilters
            );

            if (mapProgramIndicator?.id === mapConfigState.data.programIndicatorId) {
                if (
                    multiSelectFilters &&
                    multiSelectFilters?.province?.length &&
                    provincesHaveChanged(multiSelectFilters?.province, mapConfigState.data.orgUnits)
                ) {
                    setMapConfigState({ kind: "loading" });

                    setMapConfigState({
                        kind: "loaded",
                        data: {
                            ...mapConfigState.data,
                            orgUnits: multiSelectFilters.province,
                        },
                    });
                    return;
                } else if (
                    !multiSelectFilters?.province?.length &&
                    provincesHaveChanged(allOrgUnitsIds, mapConfigState.data.orgUnits)
                ) {
                    setMapConfigState({ kind: "loading" });

                    setMapConfigState({
                        kind: "loaded",
                        data: {
                            ...mapConfigState.data,
                            orgUnits: allOrgUnitsIds,
                        },
                    });
                    return;
                }
                return;
            }
            setMapConfigState({ kind: "loading" });

            if (!mapProgramIndicator) {
                setMapConfigState({
                    kind: "error",
                    message: i18n.t("Map not found."),
                });
                return;
            } else {
                setMapConfigState({
                    kind: "loaded",
                    data: {
                        ...mapConfigState.data,
                        programIndicatorId: mapProgramIndicator.id,
                        programIndicatorName: mapProgramIndicator.name,
                        orgUnits:
                            multiSelectFilters && multiSelectFilters?.province?.length
                                ? multiSelectFilters?.province
                                : allOrgUnitsIds,
                    },
                });
            }
        }
    }, [
        allOrgUnitsIds,
        mapConfigState,
        mapProgramIndicators,
        multiSelectFilters,
        singleSelectFilters,
    ]);

    useEffect(() => {
        compositionRoot.maps.getConfig.execute(mapKey).run(
            config => {
                setMapProgramIndicators(config.programIndicators);

                const mapProgramIndicator = getMainMapProgramIndicator(config.programIndicators);

                if (!mapProgramIndicator) {
                    setMapConfigState({
                        kind: "error",
                        message: i18n.t("Map not found."),
                    });
                    return;
                }

                if (!allOrgUnitsIds || allOrgUnitsIds.length === 0) {
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
    }, [compositionRoot.maps.getConfig, mapKey, allOrgUnitsIds]);

    return {
        mapConfigState,
    };
}

function getMainMapProgramIndicator(
    programIndicators: MapProgramIndicator[]
): Maybe<MapProgramIndicator> {
    return programIndicators.find(
        indicator =>
            indicator.disease === "ALL" &&
            indicator.hazardType === "ALL" &&
            indicator.incidentStatus === "ALL"
    );
}

function getFilteredMapProgramIndicator(
    programIndicators: MapProgramIndicator[],
    singleSelectFilters?: Record<string, string>
): Maybe<MapProgramIndicator> {
    if (!singleSelectFilters || Object.values(singleSelectFilters).every(value => !value)) {
        return getMainMapProgramIndicator(programIndicators);
    } else {
        const { disease, hazardType, incidentStatus } = singleSelectFilters;

        return programIndicators.find(indicator => {
            if (disease && indicator.disease === disease) {
                return (
                    (incidentStatus && indicator.incidentStatus === incidentStatus) ||
                    (!incidentStatus && indicator.incidentStatus === "ALL")
                );
            } else if (hazardType && indicator.hazardType === hazardType) {
                return (
                    (incidentStatus && indicator.incidentStatus === incidentStatus) ||
                    (!incidentStatus && indicator.incidentStatus === "ALL")
                );
            }
            return (
                ((incidentStatus && indicator.incidentStatus === incidentStatus) ||
                    (!incidentStatus && indicator.incidentStatus === "ALL")) &&
                indicator.disease === "ALL" &&
                indicator.hazardType === "ALL"
            );
        });
    }
}

function provincesHaveChanged(provincesFilter: string[], currentOrgUnits: string[]): boolean {
    if (provincesFilter.length !== currentOrgUnits.length) {
        return true;
    }

    return !provincesFilter.every((value, index) => value === currentOrgUnits[index]);
}
