import { CasesDataSource } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../domain/entities/generic/Future";
import {
    MapKey,
    MapConfig,
    MapProgramIndicatorsDatastoreKey,
    MAP_CURRENT_APP,
} from "../../domain/entities/MapConfig";
import { MapConfigRepository } from "../../domain/repositories/MapConfigRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { DataStoreClient, dataStoreNamespace } from "../DataStoreClient";
import {
    getProgramIndicatorsFromDatastore,
    ProgramIndicatorsDatastore,
    ProgramIndicatorsDatastoreKey,
} from "./common/getProgramIndicatorsFromDatastore";

const MAPS_CONFIG_KEY = "maps-config";

export class MapConfigD2Repository implements MapConfigRepository {
    private dataStoreClient: DataStoreClient;

    constructor(private api: D2Api) {
        this.dataStoreClient = new DataStoreClient(api);
    }

    public get(mapKey: MapKey, casesDataSource?: CasesDataSource): FutureData<MapConfig> {
        const programIndicatorsDatastoreKey =
            mapKey === "dashboard"
                ? ProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts
                : casesDataSource === CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF
                ? ProgramIndicatorsDatastoreKey.SuspectedCasesCasesProgram
                : ProgramIndicatorsDatastoreKey.SuspectedCasesAlertsProgram;

        return this.dataStoreClient
            .getObject<MapsConfigDatastore>(MAPS_CONFIG_KEY)
            .flatMap(mapsConfigDatastore => {
                if (!mapsConfigDatastore)
                    return Future.error(
                        new Error(
                            `Maps configuration not found in datastore: key ${MAPS_CONFIG_KEY}`
                        )
                    );

                const mapConfigDataStore =
                    mapKey === "dashboard"
                        ? mapsConfigDatastore?.dashboard
                        : mapsConfigDatastore?.event_tracker;
                return getProgramIndicatorsFromDatastore(
                    this.dataStoreClient,
                    programIndicatorsDatastoreKey
                ).flatMap(programIndicatorsDatastore => {
                    if (!programIndicatorsDatastore)
                        return Future.error(
                            new Error(
                                `Program indicators needed for the map not found in datastore: key ${programIndicatorsDatastoreKey}`
                            )
                        );

                    return Future.success(
                        this.buildMapConfig(mapConfigDataStore, programIndicatorsDatastore)
                    );
                });
            });
    }

    private buildMapConfig(
        mapConfigDatastore: MapConfigDatastore,
        programIndicatorsDatastore: ProgramIndicatorsDatastore[]
    ): MapConfig {
        return {
            currentApp: MAP_CURRENT_APP,
            currentPage: mapConfigDatastore.currentPage,
            mapId: mapConfigDatastore.mapId,
            programId: mapConfigDatastore.programId,
            programName: mapConfigDatastore.programName,
            startDate: mapConfigDatastore.startDate,
            timeField: mapConfigDatastore.timeField,
            programIndicators: programIndicatorsDatastore,
            zebraNamespace: dataStoreNamespace,
            dashboardDatastoreKey: MapProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts,
        };
    }
}

type MapsConfigDatastore = {
    dashboard: MapConfigDatastore;
    event_tracker: MapConfigDatastore;
};

type MapConfigDatastore = {
    currentPage: string;
    mapId: string;
    programId: string;
    programName: string;
    startDate: string;
    timeField: string;
};
