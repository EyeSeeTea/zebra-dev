import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import { Visualisation } from "../visualisation/Visualisation";
import { EventTrackerFilteredMapConfig, useMap } from "./useMap";
import { MapKey } from "../../../domain/entities/MapConfig";
import LoaderContainer from "../loader/LoaderContainer";
import { useAppContext } from "../../contexts/app-context";
import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type MapSectionProps = {
    mapKey: MapKey;
    singleSelectFilters?: Record<string, string>;
    multiSelectFilters?: Record<string, string[]>;
    dateRangeFilter?: string[];
    eventDiseaseCode?: string;
    dataSource?: DataSource;
};

export const MapSection: React.FC<MapSectionProps> = React.memo(props => {
    const { api } = useAppContext();
    const {
        mapKey,
        singleSelectFilters,
        multiSelectFilters,
        dateRangeFilter,
        eventDiseaseCode,
        dataSource,
    } = props;
    const { configurations } = useAppContext();
    const snackbar = useSnackbar();

    const allProvincesIds = useMemo(
        () =>
            configurations.orgUnits
                .filter(orgUnit => orgUnit.level === "Province")
                .map(orgUnit => orgUnit.id),
        [configurations.orgUnits]
    );

    const { mapConfigState } = useMap({
        mapKey: mapKey,
        allOrgUnitsIds: allProvincesIds,
        singleSelectFilters: singleSelectFilters,
        multiSelectFilters: multiSelectFilters,
        dateRangeFilter: dateRangeFilter,
        eventDiseaseCode: eventDiseaseCode,
        dataSource: dataSource,
    });

    const baseUrl = `${api.baseUrl}/api/apps/zebra-custom-maps-app/index.html`;
    const [mapUrl, setMapUrl] = React.useState<string>();

    useEffect(() => {
        if (mapConfigState.kind === "error") {
            snackbar.error(mapConfigState.message);
        } else if (mapConfigState.kind === "loaded") {
            const config = mapConfigState.data as EventTrackerFilteredMapConfig;
            const params = {
                currentApp: config.currentApp,
                currentPage: config.currentPage,
                zebraNamespace: config.zebraNamespace,
                mapProgramIndicatorDatastoreKey: config.mapProgramIndicatorDatastoreKey,
                id: config.mapId,
                orgUnits: config.orgUnits.join(","),
                programIndicatorId: config.programIndicatorId,
                programIndicatorName: config.programIndicatorName,
                programId: config.programId,
                programName: config.programName,
                startDate: config.startDate,
                endDate: config.endDate,
                timeField: config.timeField,
                diseaseCode: config?.diseaseCode,
            };
            const srcUrl =
                baseUrl + "?" + new URLSearchParams(removeUndefinedProperties(params)).toString();
            setMapUrl(srcUrl);
        }
    }, [baseUrl, mapConfigState, snackbar]);

    if (mapConfigState.kind === "error") {
        return <div>{mapConfigState.message}</div>;
    }

    function removeUndefinedProperties<T extends object>(obj: T): Partial<T> {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            return value === undefined ? acc : { ...acc, [key]: value };
        }, {} as Partial<T>);
    }

    return (
        <MapContainer>
            <LoaderContainer
                loading={
                    mapConfigState.kind === "loading" || allProvincesIds.length === 0 || !mapUrl
                }
            >
                {mapConfigState.kind === "loaded" && allProvincesIds.length !== 0 && mapUrl ? (
                    <Visualisation
                        type="map"
                        key={`${JSON.stringify(dateRangeFilter)}_${JSON.stringify(
                            singleSelectFilters
                        )}_${JSON.stringify(multiSelectFilters)}_${dataSource || ""}`}
                        srcUrl={mapUrl}
                    />
                ) : null}
            </LoaderContainer>
        </MapContainer>
    );
});

const MapContainer = styled.div`
    margin-block: 16px;
    width: 100%;
`;
