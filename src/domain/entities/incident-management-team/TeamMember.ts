import { Maybe } from "../../../utils/ts-utils";
import { Id, NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type PhoneNumber = string;
type Email = string;
type IncidentManagerStatus = "Available" | "Unavailable";

export type TeamRole = NamedRef & {
    diseaseOutbreakId: Id;
    roleId: Id;
    reportsToUsername: Maybe<string>;
};

interface TeamMemberAttrs extends NamedRef {
    username: string;
    phone: Maybe<PhoneNumber>;
    email: Maybe<Email>;
    status: Maybe<IncidentManagerStatus>;
    photo: Maybe<URL>;
    teamRoles: Maybe<TeamRole[]>;
    workPosition: Maybe<string>;
}

export class TeamMember extends Struct<TeamMemberAttrs>() {
    static validatePhAndEmail() {
        //TO DO : any validations for phone number?
        //TO DO : any validations for email?
    }

    static isValidPhotoUrl(urlString: string): boolean {
        try {
            return Boolean(new URL(urlString));
        } catch (e) {
            return false;
        }
    }
}
