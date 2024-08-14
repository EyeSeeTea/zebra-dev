import { FutureData } from "../../data/api-futures";
import { TeamMember } from "../entities/incident-management-team/TeamMember";
import { Id } from "../entities/Ref";

export interface TeamMemberRepository {
    get(id: Id): FutureData<TeamMember>;
}
