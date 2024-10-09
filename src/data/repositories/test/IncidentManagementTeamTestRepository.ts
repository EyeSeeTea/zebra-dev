import { Future } from "../../../domain/entities/generic/Future";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import { IncidentManagementTeamRepository } from "../../../domain/repositories/IncidentManagementTeamRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS } from "../consts/IncidentManagementTeamBuilderConstants";

export class IncidentManagementTeamTestRepository implements IncidentManagementTeamRepository {
    get(
        _diseaseOutbreakId: Id,
        _teamMembers: TeamMember[]
    ): FutureData<Maybe<IncidentManagementTeam>> {
        return Future.success(undefined);
    }

    saveIncidentManagementTeamMemberRole(
        _teamMemberRole: TeamRole,
        _incidentManagementTeamMember: TeamMember,
        _diseaseOutbreakId: Id
    ): FutureData<void> {
        return Future.success(undefined);
    }

    deleteIncidentManagementTeamMemberRole(
        _teamMemberRole: TeamRole,
        _incidentManagementTeamMember: TeamMember,
        _diseaseOutbreakId: Id
    ): FutureData<void> {
        return Future.success(undefined);
    }

    getIncidentManagementTeamMember(username: Id, _diseaseOutbreakId: Id): FutureData<TeamMember> {
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
                    roleId: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole,
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
