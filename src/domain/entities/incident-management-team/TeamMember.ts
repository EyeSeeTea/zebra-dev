import { Maybe } from "../../../utils/ts-utils";
import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type PhoneNumber = string;
type Email = string;
type IncidentManagerStatus = "Available" | "Unavailable";

export type TeamRole = NamedRef & {
    level?: number;
};

interface TeamMemberAttrs extends NamedRef {
    phone: Maybe<PhoneNumber>;
    email: Maybe<Email>;
    status: Maybe<IncidentManagerStatus>;
    photo: Maybe<URL>;
    role: Maybe<TeamRole>;
}

export class TeamMember extends Struct<TeamMemberAttrs>() {
    static validatePhAndEmail() {
        //TO DO : any validations for phone number?
        //TO DO : any validations for email?
    }
}
