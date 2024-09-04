import { D2Api, MetadataPick } from "../../types/d2-api";
import { TeamMember } from "../../domain/entities/incident-management-team/TeamMember";
import { Id } from "../../domain/entities/Ref";
import { TeamMemberRepository } from "../../domain/repositories/TeamMemberRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { assertOrError } from "./utils/AssertOrError";
import { Future } from "../../domain/entities/generic/Future";

export class TeamMemberD2Repository implements TeamMemberRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<TeamMember[]> {
        return apiToFuture(
            this.api.metadata.get({
                users: {
                    fields: d2UserFields,
                },
            })
        )
            .flatMap(response => assertOrError(response.users, `Team Members not found`))
            .flatMap(d2Users => {
                if (d2Users.length === 0) return Future.error(new Error(`Team Members not found`));
                else
                    return Future.success(
                        d2Users.map(d2User => this.mapUserToTeamMember(d2User as D2UserFix))
                    );
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
            .map(d2User => {
                return this.mapUserToTeamMember(d2User as D2UserFix);
            });
    }

    // TODO: FIXME Property using next version of d2-api ('username' does not exist on type 'D2User')
    private mapUserToTeamMember(user: D2UserFix): TeamMember {
        const avatarId = user?.avatar?.id;
        const photoUrlString = avatarId
            ? `${this.api.baseUrl}/api/fileResources/${avatarId}/data`
            : undefined;

        return new TeamMember({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phoneNumber,
            status: "Available", // TODO: Get status when defined
            role: { id: "1", name: "Incident Manager" }, // TODO: Get role when defined
            photo:
                photoUrlString && TeamMember.isValidPhotoUrl(photoUrlString)
                    ? new URL(photoUrlString)
                    : undefined,
        });
    }
}

const d2UserFields = {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    username: true,
    avatar: true,
} as const;

type D2UserFix = D2User & { username: string };

type D2User = MetadataPick<{
    users: { fields: typeof d2UserFields };
}>["users"][number];
