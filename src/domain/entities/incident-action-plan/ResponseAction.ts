import { Struct } from "../generic/Struct";
import { TeamMember } from "../incident-management-team/TeamMember";
import { Option } from "../Ref";

//TO DO : Should this be Option?
type ResponseActionStatusType = "Not done" | "Pending" | "In Progress" | "Complete";
type ResponseActionVerificationType = "Verified" | "Unverified";

interface ResponseActionAttrs {
    mainTask: Option;
    subActivities: string;
    subPillar: Option;
    responsibleOfficer: TeamMember;
    dueDate: Date;
    timeLine: Option;
    status: ResponseActionStatusType;
    verification: ResponseActionVerificationType;
}

export class ResponseAction extends Struct<ResponseActionAttrs>() {}
