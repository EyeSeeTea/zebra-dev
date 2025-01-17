import { FutureData } from "../../data/api-futures";
import { UserGroup } from "../entities/UserGroup";

export interface UserGroupRepository {
    getUserGroupByCode(code: string): FutureData<UserGroup>;
    getIncidentManagerUserGroupByCode(): FutureData<UserGroup>;
}
