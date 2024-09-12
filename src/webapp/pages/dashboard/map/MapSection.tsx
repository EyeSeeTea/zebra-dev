import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import { Map } from "../../../components/map/Map";
import { useMap } from "./useMap";
import { MapKey } from "../../../../domain/entities/MapConfig";
import LoaderContainer from "../../../components/loader/LoaderContainer";
import { useAppContext } from "../../../contexts/app-context";

type MapSectionProps = {
    mapKey: MapKey;
    singleSelectFilters?: Record<string, string>;
    multiSelectFilters?: Record<string, string[]>;
};

export const MapSection: React.FC<MapSectionProps> = React.memo(props => {
    const { mapKey, singleSelectFilters, multiSelectFilters } = props;
    const { orgUnits } = useAppContext();
    const snackbar = useSnackbar();

    const allProvincesIds = useMemo(
        () => orgUnits.filter(orgUnit => orgUnit.level === "Province").map(orgUnit => orgUnit.id),
        [orgUnits]
    );

    const { mapConfigState } = useMap({
        mapKey: mapKey,
        allOrgUnitsIds: allProvincesIds,
        singleSelectFilters: singleSelectFilters,
        multiSelectFilters: multiSelectFilters,
    });

    useEffect(() => {
        if (mapConfigState.kind === "error") {
            snackbar.error(mapConfigState.message);
        }
    }, [mapConfigState, snackbar]);

    if (mapConfigState.kind === "error") {
        return <div>{mapConfigState.message}</div>;
    }

    return (
        <MapContainer>
            <LoaderContainer
                loading={mapConfigState.kind === "loading" || allProvincesIds.length === 0}
            >
                {mapConfigState.kind === "loaded" && allProvincesIds.length !== 0 ? (
                    <Map
                        key={`${JSON.stringify(singleSelectFilters)}_${JSON.stringify(
                            multiSelectFilters
                        )}`}
                        config={mapConfigState.data}
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
