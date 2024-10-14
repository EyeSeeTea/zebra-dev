import { Future } from "../../../domain/entities/generic/Future";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../../domain/entities/Ref";
import { TeamMemberRepository } from "../../../domain/repositories/TeamMemberRepository";
import { FutureData } from "../../api-futures";

export class TeamMemberTestRepository implements TeamMemberRepository {
    getIncidentManagers(): FutureData<TeamMember[]> {
        const teamMember: TeamMember = new TeamMember({
            id: "incidentManager",
            username: "incidentManager",
            name: `Team Member Name test`,
            email: `email@email.com`,
            phone: `121-1234`,
            role: { id: "1", name: "role" },
            status: "Available",
            photo: new URL("https://www.example.com"),
        });

        return Future.success([teamMember]);
    }
    getRiskAssessors(): FutureData<TeamMember[]> {
        const teamMember: TeamMember = new TeamMember({
            id: "riskAssessor",
            username: "riskAssessor",
            name: `Team Member Name test`,
            email: `email@email.com`,
            phone: `121-1234`,
            role: { id: "1", name: "role" },
            status: "Available",
            photo: new URL("https://www.example.com"),
        });

        return Future.success([teamMember]);
    }

    getAll(): FutureData<TeamMember[]> {
        const teamMember: TeamMember = new TeamMember({
            id: "test",
            username: "test",
            name: `Team Member Name test`,
            email: `email@email.com`,
            phone: `121-1234`,
            role: { id: "1", name: "role" },
            status: "Available",
            photo: new URL("https://www.example.com"),
        });

        return Future.success([teamMember]);
    }

    get(id: Id): FutureData<TeamMember> {
        const teamMember: TeamMember = new TeamMember({
            id: id,
            username: id,
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
