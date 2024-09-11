import React, { useEffect } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import { Map } from "../../../components/map/Map";
import { useMap } from "./useMap";
import { MapKey } from "../../../../domain/entities/MapConfig";
import LoaderContainer from "../../../components/loader/LoaderContainer";

type MapSectionProps = {
    mapKey: MapKey;
    filters?: Record<string, string[]>;
};

export const MapSection: React.FC<MapSectionProps> = React.memo(props => {
    const { mapKey, filters } = props;
    const snackbar = useSnackbar();

    const { mapConfigState } = useMap(mapKey, filters);

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
            <LoaderContainer loading={mapConfigState.kind === "loading"}>
                {mapConfigState.kind === "loaded" ? (
                    <Map key={JSON.stringify(filters)} config={mapConfigState.data} />
                ) : null}
            </LoaderContainer>
        </MapContainer>
    );
});

const MapContainer = styled.div`
    margin-block: 16px;
    width: 100%;
`;
