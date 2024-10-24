import { FutureData } from "../../data/api-futures";
import { TeamMember } from "../entities/incident-management-team/TeamMember";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetTeamMembersForIncidentManagementTeamUseCase {
    constructor(private teamMemberRepository: TeamMemberRepository) {}

    public execute(): FutureData<TeamMember[]> {
        return this.teamMemberRepository.getForIncidentManagementTeam();
    }
}
