import { Future } from "../../domain/entities/generic/Future";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { DataStoreClient } from "../DataStoreClient";
import { DatastorePermissionsSettings } from "../entities/DatastorePermissionsSettings";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api, private dataStoreClient: DataStoreClient) {}

    public getCurrent(): FutureData<User> {
        return Future.joinObj({
            currentUser: apiToFuture(
                this.api.currentUser.get({
                    fields: userFields,
                })
            ),
            permissionsSettings:
                this.dataStoreClient.getObject<DatastorePermissionsSettings>(
                    "permissions-settings"
                ),
        }).flatMap(({ currentUser, permissionsSettings }) => {
            const res = this.buildUser(currentUser, permissionsSettings);
            return Future.success(res);
        });
    }

    private buildUser(
        d2User: D2User,
        permissionsSettings: DatastorePermissionsSettings | undefined
    ): User {
        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups.map(({ id, name }) => ({
                id,
                name,
                hasAdminAccess: permissionsSettings?.userGroups.admin.includes(id) ?? false,
                hasCaptureAccess:
                    (permissionsSettings?.userGroups.admin.includes(id) ||
                        permissionsSettings?.userGroups.capture.includes(id)) ??
                    false,
                hasVisualizerAccess:
                    (permissionsSettings?.userGroups.admin.includes(id) ||
                        permissionsSettings?.userGroups.visualizer.includes(id)) ??
                    false,
            })),
            ...d2User.userCredentials,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: {
        username: true,
        userRoles: { id: true, name: true, authorities: true },
    },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];
