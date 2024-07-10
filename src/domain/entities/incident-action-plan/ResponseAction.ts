import { CodedNamedRef } from "../Ref";
import { Struct } from "../generic/Struct";
import { TeamMember } from "../incident-management-team/TeamMember";

type ResponseActionStatusType = "NotDone" | "Pending" | "InProgress" | "Complete";
type ResponseActionVerificationType = "Verified" | "Unverified";
type MainTask = CodedNamedRef;
type SubPillar = CodedNamedRef;
type TimeLine = CodedNamedRef;

interface ResponseActionAttrs {
    mainTask: MainTask;
    subActivities: string;
    subPillar: SubPillar;
    responsibleOfficer: TeamMember;
    dueDate: Date;
    timeLine: TimeLine;
    status: ResponseActionStatusType;
    verification: ResponseActionVerificationType;
}

export class ResponseAction extends Struct<ResponseActionAttrs>() {}
