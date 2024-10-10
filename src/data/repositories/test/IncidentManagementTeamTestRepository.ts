import { Future } from "../../../domain/entities/generic/Future";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { Role } from "../../../domain/entities/incident-management-team/Role";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import { IncidentManagementTeamRepository } from "../../../domain/repositories/IncidentManagementTeamRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import { INCIDENT_MANAGER_ROLE } from "../consts/IncidentManagementTeamBuilderConstants";

export class IncidentManagementTeamTestRepository implements IncidentManagementTeamRepository {
    get(
        _diseaseOutbreakId: Id,
        _teamMembers: TeamMember[],
        _roles: Role[]
    ): FutureData<Maybe<IncidentManagementTeam>> {
        return Future.success(undefined);
    }

    saveIncidentManagementTeamMemberRole(
        _teamMemberRole: TeamRole,
        _incidentManagementTeamMember: TeamMember,
        _diseaseOutbreakId: Id,
        _roles: Role[]
    ): FutureData<void> {
        return Future.success(undefined);
    }

    deleteIncidentManagementTeamMemberRole(
        _teamMemberRole: TeamRole,
        _incidentManagementTeamMember: TeamMember,
        _diseaseOutbreakId: Id,
        _roles: Role[]
    ): FutureData<void> {
        return Future.success(undefined);
    }

    getIncidentManagementTeamMember(
        username: Id,
        _diseaseOutbreakId: Id,
        _roles: Role[]
    ): FutureData<TeamMember> {
        const teamMember: TeamMember = new TeamMember({
            id: username,
            username: username,
            name: `Team Member Name ${username}`,
            email: `email@email.com`,
            phone: `121-1234`,
            teamRoles: [
                {
                    id: "role",
                    name: "role",
                    roleId: INCIDENT_MANAGER_ROLE,
                    reportsToUsername: "reportsToUsername",
                },
            ],
            status: "Available",
            photo: new URL("https://www.example.com"),
            workPosition: "workPosition",
        });
        return Future.success(teamMember);
    }
}
