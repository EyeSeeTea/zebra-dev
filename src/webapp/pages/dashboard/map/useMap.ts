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

export function useMap(mapKey: MapKey, filters?: Record<string, string[]>): MapState {
    const { compositionRoot } = useAppContext();
    const [mapProgramIndicators, setMapProgramIndicators] = useState<MapProgramIndicator[]>([]);
    const [mapConfigState, setMapConfigState] = useState<MapConfigState>({
        kind: "loading",
    });

    useEffect(() => {
        if (mapConfigState.kind === "loaded" && !!filters) {
            const mapProgramIndicator = getFilteredMapProgramIndicator(
                mapProgramIndicators,
                filters
            );
            if (mapProgramIndicator?.id === mapConfigState.data.programIndicatorId) {
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
                    },
                });
            }
        }
    }, [filters, mapConfigState, mapProgramIndicators]);

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
                        orgUnits: [
                            "AWn3s2RqgAN",
                            "utIjliUdjp8",
                            "J7PQPWAeRUk",
                            "KozcEjeTyuD",
                            "B1u1bVtIA92",
                            "dbTLdTi7s8F",
                            "SwwuteU1Ajk",
                            "q5hODNmn021",
                            "oPLMrarKeEY",
                            "g1bv2xjtV0w",
                        ],
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
    }, [compositionRoot.maps.getConfig, mapKey]);

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
    filters?: Record<string, string[]>
): Maybe<MapProgramIndicator> {
    if (!filters || Object.values(filters).every(value => value.length === 0)) {
        return getMainMapProgramIndicator(programIndicators);
    } else {
        const { disease, hazardType, incidentStatus } = filters;

        return programIndicators.find(indicator => {
            if (disease && indicator.disease === disease[0]) {
                return (
                    (incidentStatus && indicator.incidentStatus === incidentStatus[0]) ||
                    (!incidentStatus && indicator.incidentStatus === "ALL")
                );
            } else if (hazardType && indicator.hazardType === hazardType[0]) {
                return (
                    (incidentStatus && indicator.incidentStatus === incidentStatus[0]) ||
                    (!incidentStatus && indicator.incidentStatus === "ALL")
                );
            }
            return (
                ((incidentStatus && indicator.incidentStatus === incidentStatus[0]) ||
                    (!incidentStatus && indicator.incidentStatus === "ALL")) &&
                indicator.disease === "ALL" &&
                indicator.hazardType === "ALL"
            );
        });
    }
}
