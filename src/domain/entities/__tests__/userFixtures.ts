import { User, UserRole } from "../User";
import { NamedRef } from "../Ref";

export function createAdminUser(): User {
    const adminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL"] }];

    return createUser(adminRoles, []);
}
export function createNonAdminUser(): User {
    const nonAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Malaria", authorities: ["F_EXPORT_DATA"] }];

    return createUser(nonAdminRoles, []);
}
export function createUserWithGroups(userGroups: NamedRef[] = []): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "John Traore",
        username: "user",
        userRoles: [],
        userGroups,
        hasCaptureAccess: false,
    });
}
function createUser(userRoles: UserRole[], userGroups: NamedRef[] = []): User {
    return new User({
        id: "kQiwoyMYHBS",
        name: "John Traore",
        username: "user",
        userRoles,
        userGroups,
        hasCaptureAccess: false,
    });
}
