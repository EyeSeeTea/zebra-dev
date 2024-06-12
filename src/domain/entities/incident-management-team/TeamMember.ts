import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type PhoneNumber = string;
type Email = string;
type IncidentManagerStatus = "Available" | "Unavailable";

interface TeamMemberAttrs extends NamedRef {
    position: string;
    phone: PhoneNumber;
    email: Email;
    status: IncidentManagerStatus;
    photo: string; //URL to photo
}

export class TeamMember extends Struct<TeamMemberAttrs>() {
    static validatePhAndEmail() {
        //TO DO : any validations for phone number?
        //TO DO : any validations for email?
    }
}
