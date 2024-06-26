import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";
import { TeamMember } from "./TeamMember";

type TeamRole = NamedRef & {
    level: number;
};

interface RoleTeamMemberMap {
    role: TeamRole;
    teamMember: TeamMember;
}
interface IncidentManagementTeamAttrs {
    teamHierarchy: RoleTeamMemberMap[];
}

export class IncidentManagementTeam extends Struct<IncidentManagementTeamAttrs>() {}
