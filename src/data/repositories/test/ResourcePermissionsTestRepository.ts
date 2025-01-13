import { Future } from "../../../domain/entities/generic/Future";
import { ResourcePermissions } from "../../../domain/entities/resources/ResourcePermissions";
import { User } from "../../../domain/entities/User";
import { ResourcePermissionsRepository } from "../../../domain/repositories/ResourcePermissionsRepository";
import { FutureData } from "../../api-futures";

export class ResourcePermissionsTestRepository implements ResourcePermissionsRepository {
    getPermissions(_currentUser: User): FutureData<ResourcePermissions> {
        return Future.success({
            isAdmin: true,
            isDataCapture: false,
            isAccess: true,
        });
    }
}
