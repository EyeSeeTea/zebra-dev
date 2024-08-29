import { ConfigurableForm } from "../../../domain/entities/ConfigurableForm";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { Option } from "../../../domain/entities/Ref";
import { User } from "../../components/user-selector/UserSelector";
import { Option as PresentationOption } from "../../components/utils/option";
import { mapDiseaseOutbreakEventToInitialFormState } from "./disease-outbreak-event/mapDiseaseOutbreakEventToInitialFormState";
import { mapRiskGradingToInitialFormState } from "./risk-assessment-grading/mapRiskGradingToInitialFormState";

export function mapEntityToFormState(configurableForm: ConfigurableForm, editMode?: boolean) {
    switch (configurableForm.type) {
        case "disease-outbreak-event":
            return mapDiseaseOutbreakEventToInitialFormState(configurableForm, editMode ?? false);
        case "risk-assessment-grading":
            return mapRiskGradingToInitialFormState(configurableForm);
    }
}

export function mapToPresentationOptions(options: Option[]): PresentationOption[] {
    return options.map(
        (option): PresentationOption => ({
            value: option.id,
            label: option.name,
        })
    );
}

export function mapTeamMemberToUser(teamMember: TeamMember): User {
    return {
        value: teamMember.username,
        label: teamMember.name,
        workPosition: teamMember.role?.name || "",
        phone: teamMember.phone || "",
        email: teamMember.email || "",
        status: teamMember.status || "",
        src: teamMember.photo?.toString(),
        alt: teamMember.photo ? `Photo of ${teamMember.name}` : undefined,
    };
}
