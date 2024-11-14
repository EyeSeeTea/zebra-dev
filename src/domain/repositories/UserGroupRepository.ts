import { FutureData } from "../../data/api-futures";
import { UserGroup } from "../entities/UserGroup";

export interface UserGroupRepository {
    getIncidentManagerUserGroupByCode(): FutureData<UserGroup>;
}
