import { Struct } from "../generic/Struct";
import { TeamMember } from "./TeamMember";

interface IncidentManagementTeamAttrs {
    teamHierarchy: TeamMember[];
}

export class IncidentManagementTeam extends Struct<IncidentManagementTeamAttrs>() {}
