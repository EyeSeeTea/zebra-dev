import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import { DataStoreClient } from "../../DataStoreClient";

export enum ProgramIndicatorsDatastoreKey {
    ActiveVerifiedAlerts = "active-verified-alerts-program-indicators",
    SuspectedCasesCasesProgram = "suspected-cases-cases-program-indicators",
}

export type ProgramIndicatorsDatastore = {
    id: string;
    name: string;
    disease: string | null;
    incidentStatus: string | null;
    dataSource: string | null;
};

export function getProgramIndicatorsFromDatastore(
    dataStoreClient: DataStoreClient,
    programIndicatorsDatastoreKey: ProgramIndicatorsDatastoreKey
): FutureData<Maybe<ProgramIndicatorsDatastore[]>> {
    switch (programIndicatorsDatastoreKey) {
        case ProgramIndicatorsDatastoreKey.ActiveVerifiedAlerts:
        case ProgramIndicatorsDatastoreKey.SuspectedCasesCasesProgram:
            return dataStoreClient.getObject<ProgramIndicatorsDatastore[]>(
                programIndicatorsDatastoreKey
            );
    }
}
