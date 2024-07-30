import { Future } from "../../../domain/entities/generic/Future";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import { TeamMemberRepository } from "../../../domain/repositories/TeamMemberRepository";
import { FutureData } from "../../api-futures";

export class TeamMemberTestRepository implements TeamMemberRepository {
    get(id: Id): FutureData<TeamMember> {
        const teamMember: TeamMember = new TeamMember({
            id: id,
            name: `Team Member Name ${id}`,
            email: `email@email.com`,
            phone: `121-1234`,
            role: { id: "1", name: "role" },
            status: "Available",
            photo: new URL("https://www.example.com"),
        });

        return Future.success(teamMember);
    }
}
