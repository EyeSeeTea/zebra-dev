import { NamedRef } from "../Ref";
import { Struct } from "../generic/Struct";

type PhoneNumber = string;
type Email = string;
type IncidentManagerStatus = "Available" | "Unavailable";
type Postion = string; //TO DO : make a list once available from client.

interface TeamMemberAttrs extends NamedRef {
    position: Postion;
    phone: PhoneNumber;
    email: Email;
    status: IncidentManagerStatus;
    photo: URL;
}

export class TeamMember extends Struct<TeamMemberAttrs>() {
    static validatePhAndEmail() {
        //TO DO : any validations for phone number?
        //TO DO : any validations for email?
    }
}
