export type Alert = {
    id: string;
    district: string;
};

export enum VerificationStatus {
    RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED = "RTSL_ZEB_AL_OS_VERIFICATION_VERIFIED",
    RTSL_ZEB_AL_OS_VERIFICATION_PENDING_VERIFICATION = "RTSL_ZEB_AL_OS_VERIFICATION_PENDING_VERIFICATION",
    RTSL_ZEB_AL_OS_VERIFICATION_NOT_AN_EVENT = "RTSL_ZEB_AL_OS_VERIFICATION_NOT_AN_EVENT",
}

export const alertVerificationStates = [
    "Verified ",
    "Pending Verification",
    "Not an event",
] as const;

export type AlertVerificationStatus = (typeof alertVerificationStates)[number];
