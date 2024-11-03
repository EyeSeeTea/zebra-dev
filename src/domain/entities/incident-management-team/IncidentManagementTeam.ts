import { Maybe } from "../../../utils/ts-utils";
import { Struct } from "../generic/Struct";
import { TeamMember } from "./TeamMember";

interface IncidentManagementTeamAttrs {
    lastUpdated: Maybe<Date>;
    teamHierarchy: TeamMember[];
}

export class IncidentManagementTeam extends Struct<IncidentManagementTeamAttrs>() {}
