import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type PhoneNumber = string;
type Email = string;
type IncidentManagerStatus = "Available" | "Unavailable";

export type TeamRole = NamedRef & {
    level: number;
};

interface TeamMemberAttrs extends NamedRef {
    phone: PhoneNumber;
    email: Email;
    status: IncidentManagerStatus;
    photo: URL;
    role: TeamRole;
}

export class TeamMember extends Struct<TeamMemberAttrs>() {
    static validatePhAndEmail() {
        //TO DO : any validations for phone number?
        //TO DO : any validations for email?
    }
}
