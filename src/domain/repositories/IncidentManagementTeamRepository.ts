import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { IncidentManagementTeam } from "../entities/incident-management-team/IncidentManagementTeam";
import { Role } from "../entities/incident-management-team/Role";
import { TeamMember, TeamRole } from "../entities/incident-management-team/TeamMember";
import { Id } from "../entities/Ref";

export interface IncidentManagementTeamRepository {
    get(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[],
        roles: Role[]
    ): FutureData<Maybe<IncidentManagementTeam>>;
    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id,
        roles: Role[]
    ): FutureData<void>;
    deleteIncidentManagementTeamMemberRoles(
        diseaseOutbreakId: Id,
        incidentManagementTeamRoleIds: Id[]
    ): FutureData<void>;
}
