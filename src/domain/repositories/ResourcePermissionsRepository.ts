import { FutureData } from "../../data/api-futures";
import { ResourcePermissions } from "../entities/resources/ResourcePermissions";
import { User } from "../entities/User";

export interface ResourcePermissionsRepository {
    getPermissions(currentUser: User): FutureData<ResourcePermissions>;
}
