import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { IncidentManagementTeam } from "../entities/incident-management-team/IncidentManagementTeam";
import { TeamMember, TeamRole } from "../entities/incident-management-team/TeamMember";
import { Id } from "../entities/Ref";

export interface IncidentManagementTeamRepository {
    get(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[]
    ): FutureData<Maybe<IncidentManagementTeam>>;
    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void>;
    deleteIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void>;
    getIncidentManagementTeamMember(username: Id, diseaseOutbreakId: Id): FutureData<TeamMember>;
}
