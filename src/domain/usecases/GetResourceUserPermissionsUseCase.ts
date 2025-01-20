import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import {
    ResourcePermissions,
    RTSL_ZEBRA_ACCESS_RESOURCES,
    RTSL_ZEBRA_ADMIN_RESOURCES,
    RTSL_ZEBRA_DATA_CAPTURE_RESOURCES,
} from "../entities/resources/ResourcePermissions";
import { User } from "../entities/User";
import { UserGroupRepository } from "../repositories/UserGroupRepository";

export class GetResourceUserPermissionsUseCase {
    constructor(
        private options: {
            userGroupRepository: UserGroupRepository;
        }
    ) {}

    public execute(currentUser: User): FutureData<ResourcePermissions> {
        return Future.joinObj({
            adminUserGroup: this.options.userGroupRepository.getUserGroupByCode(
                RTSL_ZEBRA_ADMIN_RESOURCES
            ),
            dataCaptureUserGroup: this.options.userGroupRepository.getUserGroupByCode(
                RTSL_ZEBRA_DATA_CAPTURE_RESOURCES
            ),
            accessUserGroup: this.options.userGroupRepository.getUserGroupByCode(
                RTSL_ZEBRA_ACCESS_RESOURCES
            ),
        }).map(({ adminUserGroup, dataCaptureUserGroup, accessUserGroup }) => {
            const isAdmin = currentUser.belongToUserGroup(adminUserGroup.id);
            const isDataCapture = currentUser.belongToUserGroup(dataCaptureUserGroup.id);
            const isAccess = currentUser.belongToUserGroup(accessUserGroup.id);

            return { isAdmin, isDataCapture, isAccess };
        });
    }
}
