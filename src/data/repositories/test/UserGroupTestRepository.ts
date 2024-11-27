import { Future } from "../../../domain/entities/generic/Future";
import { UserGroup } from "../../../domain/entities/UserGroup";
import { UserGroupRepository } from "../../../domain/repositories/UserGroupRepository";
import { FutureData } from "../../api-futures";

export class UserGroupTestRepository implements UserGroupRepository {
    getIncidentManagerUserGroupByCode(): FutureData<UserGroup> {
        return Future.success({
            id: "1",
        });
    }
}
