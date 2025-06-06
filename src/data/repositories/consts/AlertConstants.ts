import { AlertVerificationStatus } from "../../../domain/entities/alert/Alert";

export const alertOutbreakCodes = {
    suspectedDisease: "RTSL_ZEB_TEA_DISEASE",
    verificationStatus: "RTSL_ZEB_TEA_VERIFICATION_STATUS",
    incidentManager: "RTSL_ZEB_TEA_ ALERT_IM_NAME",
    outbreakId: "RTSL_ZEB_TEA_ OutBreak_ID",
    emsId: "RTSL_ZEB_TEA_EMS_ID",
    nationalIncidentStatus: "RTSL_ZEB_TEA_ZEBRA_NATIONAL_INCIDENT_STATUS",
    pheocStatus: "RTSL_ZEB_TEA_NATIONAL_INCIDENT_STATUS",
    emergedDate: "RTSL_ZEB_TEA_DATE_EMERGED",
    detectedDate: "RTSL_ZEB_TEA_DATE_DETECTED",
    notifiedDate: "RTSL_ZEB_TEA_DATE_NOTIFIED",
    nationalEventId: "RTSL_ZEB_TEA_EVENT_id",
} as const;

export const verificationStatusCodeMap: Record<string, AlertVerificationStatus> = {
    RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED: "Verified ",
    RTSL_ZEB_AL_OS_VERIFICATION_PENDING_VERIFICATION: "Pending Verification",
    RTSL_ZEB_AL_OS_VERIFICATION_NOT_AN_EVENT: "Not an event",
} as const;
