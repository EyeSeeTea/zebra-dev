import { D2Api } from "@eyeseetea/d2-api/2.36";
import { UserGroupRepository } from "../../domain/repositories/UserGroupRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { assertOrError } from "./utils/AssertOrError";
import { UserGroup } from "../../domain/entities/UserGroup";

export class UserGroupD2Repository implements UserGroupRepository {
    constructor(private api: D2Api) {}

    getUserGroupByCode(code: string): FutureData<UserGroup> {
        return apiToFuture(
            this.api.metadata.get({
                userGroups: {
                    fields: {
                        id: true,
                    },
                    filter: {
                        code: { eq: code },
                    },
                },
            })
        )
            .flatMap(response => assertOrError(response.userGroups[0], `User group ${code}`))
            .map(userGroup => userGroup);
    }
}
