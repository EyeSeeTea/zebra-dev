import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { IncidentManagementTeam } from "../entities/incident-management-team/IncidentManagementTeam";
import { Role } from "../entities/incident-management-team/Role";
import { TeamMember, TeamRole } from "../entities/incident-management-team/TeamMember";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id>;
    getConfigStrings(): FutureData<ConfigLabel[]>;
    getIncidentManagementTeam(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[],
        roles: Role[]
    ): FutureData<IncidentManagementTeam>;
    saveIncidentManagementTeamMemberRole(
        teamMemberRole: TeamRole,
        incidentManagementTeamMember: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void>;
    deleteIncidentManagementTeamMemberRole(
        diseaseOutbreakId: Id,
        incidentManagementTeamRoleId: Id
    ): FutureData<void>;
}
