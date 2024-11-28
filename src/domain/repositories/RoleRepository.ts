import { FutureData } from "../../data/api-futures";
import { Role } from "../entities/incident-management-team/Role";

export interface RoleRepository {
    getAll(): FutureData<Role[]>;
}
