import { D2Api, D2UserSchema } from "@eyeseetea/d2-api/2.36";
import { TeamMember } from "../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../domain/entities/Ref";
import { TeamMemberRepository } from "../../domain/repositories/TeamMemberRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { SelectedPick } from "@eyeseetea/d2-api/api";

type D2User = SelectedPick<
    D2UserSchema,
    {
        id: true;
        name: true;
        username: true;
        email: true;
        phoneNumber: true;
    }
>;
export class TeamMemberD2Repository implements TeamMemberRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<TeamMember> {
        return apiToFuture(
            this.api.metadata.get({
                users: {
                    fields: { id: true, name: true, email: true, phoneNumber: true },
                    filter: { username: { eq: id } },
                },
            })
        ).map(response => {
            if (!response.users[0]) throw new Error("Team Member not found");
            return this.mapUserToTeamMember(response.users[0]);
        });
    }

    mapUserToTeamMember(user: D2User): TeamMember {
        return new TeamMember({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phoneNumber,
            status: "Available",
            role: { id: "1", name: "Incident Manager" },
            photo: undefined, //TO DO : where will the photo URL be saved
        });
    }
}
