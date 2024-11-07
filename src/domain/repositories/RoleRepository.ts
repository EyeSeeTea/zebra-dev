import { FutureData } from "../../data/api-futures";
import { Role } from "../entities/Role";

export interface RoleRepository {
    getAll(): FutureData<Role[]>;
}
