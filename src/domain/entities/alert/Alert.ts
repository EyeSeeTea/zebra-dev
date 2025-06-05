import { Maybe } from "../../../utils/ts-utils";
import { IncidentStatus } from "../disease-outbreak-event/PerformanceOverviewMetrics";
import { Code, Id } from "../Ref";

export type Alert = {
    id: Id;
    districtId: Id;
    suspectedDiseaseCode: Code;
    confirmedDiseaseCode: Maybe<Code>;
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED";
    incidentStatus?: IncidentStatus; // TODO: Change IncidentStatus to be mandatory
};

export enum VerificationStatus {
    RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED = "RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED",
    RTSL_ZEB_AL_OS_VERIFICATION_PENDING_VERIFICATION = "RTSL_ZEB_AL_OS_VERIFICATION_PENDING_VERIFICATION",
    RTSL_ZEB_AL_OS_VERIFICATION_NOT_AN_EVENT = "RTSL_ZEB_AL_OS_VERIFICATION_NOT_AN_EVENT",
}

export enum AlertDataSource {
    RTSL_ZEB_OS_DATA_SOURCE_IBS = "RTSL_ZEB_OS_DATA_SOURCE_IBS",
    RTSL_ZEB_OS_DATA_SOURCE_EBS = "RTSL_ZEB_OS_DATA_SOURCE_EBS",
}

export const alertVerificationStates = [
    "Verified ",
    "Pending Verification",
    "Not an event",
] as const;

export type AlertVerificationStatus = (typeof alertVerificationStates)[number];

export enum PHEOCStatus {
    Alert = "PHEOC_STATUS_ALERT",
    Respond = "PHEOC_STATUS_RESPOND",
    Watch = "PHEOC_STATUS_WATCH",
}
