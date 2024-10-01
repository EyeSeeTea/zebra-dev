import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import { DataStoreClient } from "../../DataStoreClient";

export enum ProgramIndicatorsDatastoreKey {
    ActiveVerifiedAlerts = "active-verified-alerts-program-indicators",
    CasesAlerts = "cases-alerts-program-indicators",
}

export type ProgramIndicatorsDatastore = {
    id: string;
    name: string;
    disease: string | null;
    hazardType: string | null;
    incidentStatus: string | null;
};

export function getProgramIndicatorsFromDatastore(
    dataStoreClient: DataStoreClient,
    programIndicatorsDatastoreKey: ProgramIndicatorsDatastoreKey
): FutureData<Maybe<ProgramIndicatorsDatastore[]>> {
    switch (programIndicatorsDatastoreKey) {
        case ProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts:
            return dataStoreClient.getObject<ProgramIndicatorsDatastore[]>(
                programIndicatorsDatastoreKey
            );
        case ProgramIndicatorsDatastoreKey.CasesAlerts:
            return dataStoreClient.getObject<ProgramIndicatorsDatastore[]>(
                programIndicatorsDatastoreKey
            );
    }
}
