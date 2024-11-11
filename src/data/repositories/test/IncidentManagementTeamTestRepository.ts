import { Future } from "../../../domain/entities/generic/Future";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { Role } from "../../../domain/entities/incident-management-team/Role";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import { IncidentManagementTeamRepository } from "../../../domain/repositories/IncidentManagementTeamRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";

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

    deleteIncidentManagementTeamMemberRoles(
        _diseaseOutbreakId: Id,
        _incidentManagementTeamRoleIds: Id[]
    ): FutureData<void> {
        return Future.success(undefined);
    }
}
