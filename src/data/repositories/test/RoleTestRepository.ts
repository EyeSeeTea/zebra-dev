import { Future } from "../../../domain/entities/generic/Future";
import { Role } from "../../../domain/entities/Role";
import { RoleRepository } from "../../../domain/repositories/RoleRepository";
import { FutureData } from "../../api-futures";

export class RoleTestRepository implements RoleRepository {
    getAll(): FutureData<Role[]> {
        const roles: Role[] = [];
        return Future.success(roles);
    }
}
