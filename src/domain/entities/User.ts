import { Struct } from "./generic/Struct";
import { NamedRef } from "./Ref";

export interface UserAttrs {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    hasCaptureAccess: boolean;
}

export interface UserRole extends NamedRef {
    authorities: string[];
}
export type AppDatastoreConfig = {
    userGroups: {
        visualizer: string[];
        capture: string[];
        admin: string[];
    };
};

export class User extends Struct<UserAttrs>() {
    belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.userRoles.some(({ authorities }) => authorities.includes("ALL"));
    }
}
