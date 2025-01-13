import { Future } from "../../domain/entities/generic/Future";
import {
    ResourcePermissions,
    RTSL_ZEBRA_ACCESS_RESOURCES,
    RTSL_ZEBRA_ADMIN_RESOURCES,
    RTSL_ZEBRA_DATA_CAPTURE_RESOURCES,
} from "../../domain/entities/resources/ResourcePermissions";
import { User } from "../../domain/entities/User";
import { ResourcePermissionsRepository } from "../../domain/repositories/ResourcePermissionsRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { getUserGroupByCode } from "./utils/MetadataHelper";

export class ResourcePermissionsD2Repository implements ResourcePermissionsRepository {
    constructor(private api: D2Api) {}

    getPermissions(currentUser: User): FutureData<ResourcePermissions> {
        return Future.joinObj({
            adminUserGroup: getUserGroupByCode(this.api, RTSL_ZEBRA_ADMIN_RESOURCES),
            dataCaptureUserGroup: getUserGroupByCode(this.api, RTSL_ZEBRA_DATA_CAPTURE_RESOURCES),
            accessUserGroup: getUserGroupByCode(this.api, RTSL_ZEBRA_ACCESS_RESOURCES),
        }).map(({ adminUserGroup, dataCaptureUserGroup, accessUserGroup }) => {
            const isAdmin = currentUser.belongToUserGroup(adminUserGroup.id);
            const isDataCapture = currentUser.belongToUserGroup(dataCaptureUserGroup.id);
            const isAccess = currentUser.belongToUserGroup(accessUserGroup.id);

            return { isAdmin, isDataCapture, isAccess };
        });
    }
}
