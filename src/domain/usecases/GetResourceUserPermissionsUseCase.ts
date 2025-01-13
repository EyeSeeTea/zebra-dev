import { FutureData } from "../../data/api-futures";
import { ResourcePermissions } from "../entities/resources/ResourcePermissions";
import { User } from "../entities/User";
import { ResourcePermissionsRepository } from "../repositories/ResourcePermissionsRepository";

export class GetResourceUserPermissionsUseCase {
    constructor(private resourcePermissionsRepository: ResourcePermissionsRepository) {}

    public execute(currentUser: User): FutureData<ResourcePermissions> {
        return this.resourcePermissionsRepository.getPermissions(currentUser);
    }
}
