import { Struct } from "./generic/Struct";
import { NamedRef } from "./Ref";

export type Username = string;

export type UserGroupPermissions = NamedRef & {
    hasAdminAccess: boolean;
    hasCaptureAccess: boolean;
    hasVisualizerAccess: boolean;
    canBeIncidentManager: boolean;
};

export interface UserAttrs {
    id: string;
    name: string;
    username: Username;
    userRoles: UserRole[];
    userGroups: UserGroupPermissions[];
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export class User extends Struct<UserAttrs>() {
    belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.userRoles.some(({ authorities }) => authorities.includes("ALL"));
    }

    hasAdminAccess(): boolean {
        return this.userGroups.some(({ hasAdminAccess }) => hasAdminAccess);
    }

    hasDataCaptureAccess(): boolean {
        return this.userGroups.some(({ hasCaptureAccess }) => hasCaptureAccess);
    }

    hasDataVisualizerAccess(): boolean {
        return this.userGroups.some(({ hasVisualizerAccess }) => hasVisualizerAccess);
    }

    canBeIncidentManager(): boolean {
        return this.userGroups.some(({ canBeIncidentManager }) => canBeIncidentManager);
    }
}
