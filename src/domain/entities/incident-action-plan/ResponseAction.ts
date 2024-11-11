import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../Ref";
import { Struct } from "../generic/Struct";
import { TeamMember } from "../incident-management-team/TeamMember";

export type ResponseActionStatusType = "Not done" | "Pending" | "In Progress" | "Complete";
export type ResponseActionVerificationType = "Verified" | "Unverified";

export enum Status {
    RTSL_ZEB_OS_STATUS_NOT_DONE = "RTSL_ZEB_OS_STATUS_NOT_DONE",
    RTSL_ZEB_OS_STATUS_PENDING = "RTSL_ZEB_OS_STATUS_PENDING",
    RTSL_ZEB_OS_STATUS_IN_PROGRESS = "RTSL_ZEB_OS_STATUS_IN_PROGRESS",
    RTSL_ZEB_OS_STATUS_COMPLETE = "RTSL_ZEB_OS_STATUS_COMPLETE",
}

export enum Verification {
    RTSL_ZEB_OS_VERIFICATION_VERIFIED = "RTSL_ZEB_OS_VERIFICATION_VERIFIED",
    RTSL_ZEB_OS_VERIFICATION_UNVERIFIED = "RTSL_ZEB_OS_VERIFICATION_UNVERIFIED",
}

interface ResponseActionAttrs {
    id: Id;
    mainTask: string;
    subActivities: string;
    subPillar: string;
    searchAssignRO: Maybe<TeamMember>;
    dueDate: Date;
    status: Status;
    verification: Verification;
}

export class ResponseAction extends Struct<ResponseActionAttrs>() {}
