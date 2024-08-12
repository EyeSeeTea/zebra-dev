import { D2Api, MetadataPick } from "../../types/d2-api";
import { TeamMember } from "../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../domain/entities/Ref";
import { TeamMemberRepository } from "../../domain/repositories/TeamMemberRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { assertOrError } from "./utils/AssertOrError";

export class TeamMemberD2Repository implements TeamMemberRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<TeamMember[]> {
        return apiToFuture(
            this.api.metadata.get({
                users: {
                    fields: d2UserFields,
                },
            })
        ).map(response => {
            if (!response.users) throw new Error("Team Members not found");
            return response.users.map(this.mapUserToTeamMember);
        });
    }

    get(id: Id): FutureData<TeamMember> {
        return apiToFuture(
            this.api.metadata.get({
                users: {
                    fields: d2UserFields,
                    filter: { username: { eq: id } },
                },
            })
        )
            .flatMap(response => assertOrError(response.users[0], "Team member"))
            .map(D2User => {
                return this.mapUserToTeamMember(D2User);
            });
    }

    // TODO: Fix this type: Property 'username' does not exist on type 'D2User'
    mapUserToTeamMember(user: any): TeamMember {
        return new TeamMember({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phoneNumber,
            status: "Available",
            role: { id: "1", name: "Incident Manager" },
            photo: undefined, //TO DO : where will the photo URL be saved
        });
    }
}

const d2UserFields = {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    username: true,
};

type _D2User = MetadataPick<{
    users: { fields: typeof d2UserFields };
}>["users"][number];
