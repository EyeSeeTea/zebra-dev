import { AlertVerificationStatus } from "../../../domain/entities/alert/Alert";

export const alertOutbreakCodes = {
    hazardType: "RTSL_ZEB_TEA_EVENT_TYPE",
    suspectedDisease: "RTSL_ZEB_TEA_DISEASE",
    verificationStatus: "RTSL_ZEB_TEA_VERIFICATION_STATUS",
    incidentManager: "RTSL_ZEB_TEA_ ALERT_IM_NAME",
    outbreakId: "RTSL_ZEB_TEA_ OutBreak_ID",
    emsId: "RTSL_ZEB_TEA_EMS_ID",
} as const;

export const verificationStatusCodeMap: Record<string, AlertVerificationStatus> = {
    RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED: "Verified ",
    RTSL_ZEB_AL_OS_VERIFICATION_PENDING_VERIFICATION: "Pending Verification",
    RTSL_ZEB_AL_OS_VERIFICATION_NOT_AN_EVENT: "Not an event",
} as const;
