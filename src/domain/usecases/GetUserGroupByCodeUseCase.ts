import { FutureData } from "../../data/api-futures";
import { Code } from "../entities/Ref";
import { UserGroup } from "../entities/UserGroup";
import { UserGroupRepository } from "../repositories/UserGroupRepository";

export class GetUserGroupByCodeUseCase {
    constructor(private userGroupRepository: UserGroupRepository) {}

    public execute(code: Code): FutureData<UserGroup> {
        return this.userGroupRepository.getUserGroupByCode(code);
    }
}
