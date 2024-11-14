import { D2Api } from "@eyeseetea/d2-api/2.36";
import { UserGroupRepository } from "../../domain/repositories/UserGroupRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { assertOrError } from "./utils/AssertOrError";
import { UserGroup } from "../../domain/entities/UserGroup";
import { RTSL_ZEBRA_INCIDENTMANAGER } from "./TeamMemberD2Repository";

export class UserGroupD2Repository implements UserGroupRepository {
    constructor(private api: D2Api) {}

    getIncidentManagerUserGroupByCode(): FutureData<UserGroup> {
        return apiToFuture(
            this.api.metadata.get({
                userGroups: {
                    fields: {
                        id: true,
                    },
                    filter: {
                        code: { eq: RTSL_ZEBRA_INCIDENTMANAGER },
                    },
                },
            })
        )
            .flatMap(response =>
                assertOrError(response.userGroups[0], `User group ${RTSL_ZEBRA_INCIDENTMANAGER}`)
            )
            .map(userGroup => userGroup);
    }
}
