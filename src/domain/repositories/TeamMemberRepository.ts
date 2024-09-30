import { FutureData } from "../../data/api-futures";
import { TeamMember } from "../entities/incident-management-team/TeamMember";
import { Id } from "../entities/Ref";

export interface TeamMemberRepository {
    getAll(): FutureData<TeamMember[]>;
    get(id: Id): FutureData<TeamMember>;
    getIncidentManagers(): FutureData<TeamMember[]>;
}
