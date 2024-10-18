import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventAggregateRoot } from "../entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { IncidentManagementTeam } from "../entities/incident-management-team/IncidentManagementTeam";
import { TeamMember, TeamRole } from "../entities/incident-management-team/TeamMember";
import { ConfigLabel, Id } from "../entities/Ref";

export interface DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs>;
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]>;
    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id>;
    getConfigStrings(): FutureData<ConfigLabel[]>;
    getIncidentManagementTeam(
        diseaseOutbreakId: Id,
        teamMembers: TeamMember[]
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
    getAggregateRoot(id: Id): FutureData<DiseaseOutbreakEventAggregateRoot>;
}
