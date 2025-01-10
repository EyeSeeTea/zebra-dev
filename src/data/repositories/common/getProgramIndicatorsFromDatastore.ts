import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import { DataStoreClient } from "../../DataStoreClient";

export enum ProgramIndicatorsDatastoreKey {
    ActiveVerifiedAlerts = "active-verified-alerts-program-indicators",
    SuspectedCasesAlertsProgram = "suspected-cases-alerts-program-indicators",
    SuspectedCasesCasesProgram = "suspected-cases-cases-program-indicators",
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
        case ProgramIndicatorsDatastoreKey.SuspectedCasesAlertsProgram:
        case ProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts:
        case ProgramIndicatorsDatastoreKey.SuspectedCasesCasesProgram:
            return dataStoreClient.getObject<ProgramIndicatorsDatastore[]>(
                programIndicatorsDatastoreKey
            );
    }
}
