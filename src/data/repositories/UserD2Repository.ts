import { Future } from "../../domain/entities/generic/Future";
import { AppDatastoreConfig, User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { DataStoreClient } from "../DataStoreClient";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api, private dataStoreClient: DataStoreClient) {}

    public getCurrent(): FutureData<User> {
        return Future.joinObj({
            currentUser: apiToFuture(
                this.api.currentUser.get({
                    fields: userFields,
                })
            ),
            appUserGroupConfig: this.dataStoreClient.getObject<AppDatastoreConfig>("app-config"),
        }).flatMap(({ currentUser, appUserGroupConfig }) => {
            const res = this.buildUser(currentUser, appUserGroupConfig);
            return Future.success(res);
        });
    }

    private buildUser(d2User: D2User, appUserGroupConfig: AppDatastoreConfig | undefined): User {
        const hasCaptureAccess = d2User.userGroups.some(
            ({ id }) =>
                appUserGroupConfig?.userGroups.admin.includes(id) ||
                appUserGroupConfig?.userGroups.capture.includes(id)
        );

        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            ...d2User.userCredentials,
            hasCaptureAccess: hasCaptureAccess,
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
