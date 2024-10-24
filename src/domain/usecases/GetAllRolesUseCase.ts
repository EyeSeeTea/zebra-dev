import { FutureData } from "../../data/api-futures";
import { Role } from "../entities/incident-management-team/Role";
import { RoleRepository } from "../repositories/RoleRepository";

export class GetAllRolesUseCase {
    constructor(private roleRepository: RoleRepository) {}

    public execute(): FutureData<Role[]> {
        return this.roleRepository.getAll();
    }
}
