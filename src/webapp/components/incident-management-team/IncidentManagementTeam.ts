import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../../../domain/entities/TeamMember";

export type IncidentManagementTeam = {
    lastUpdated: Maybe<Date>;
    teamHierarchy: TeamMember[];
};
