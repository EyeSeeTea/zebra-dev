import { FutureData } from "../../data/api-futures";
import { TeamMember } from "../entities/TeamMember";
import { Id } from "../entities/Ref";

export interface TeamMemberRepository {
    getAll(): FutureData<TeamMember[]>;
    get(id: Id): FutureData<TeamMember>;
    getIncidentManagers(): FutureData<TeamMember[]>;
    getRiskAssessors(): FutureData<TeamMember[]>;
    getForIncidentManagementTeam(): FutureData<TeamMember[]>;
    getIncidentResponseOfficers(): FutureData<TeamMember[]>;
}
