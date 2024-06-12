import { Struct } from "../generic/Struct";
import { TeamMember } from "./TeamMember";

interface TeamRole {
    role: string;
    level: number;
}

interface RoleTeamMemberMap {
    role: TeamRole;
    teamMember: TeamMember;
}
interface IncidentManagementTeamAttrs {
    teamHeirarchy: RoleTeamMemberMap[]; //Is there a better way to represent heirarchy? Maybe a tree?
}

export class IncidentManagementTeam extends Struct<IncidentManagementTeamAttrs>() {}
