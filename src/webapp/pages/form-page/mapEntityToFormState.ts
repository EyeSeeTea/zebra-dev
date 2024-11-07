import { ConfigurableForm } from "../../../domain/entities/ConfigurableForm";
import {
    DiseaseNames,
    HazardNames,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { Option } from "../../../domain/entities/Ref";
import { FormState } from "../../components/form/FormState";
import { User } from "../../components/user-selector/UserSelector";
import { Option as PresentationOption } from "../../components/utils/option";
import { mapDiseaseOutbreakEventToInitialFormState } from "./disease-outbreak-event/mapDiseaseOutbreakEventToInitialFormState";
import {
    mapIncidentActionPlanToInitialFormState,
    mapIncidentResponseActionToInitialFormState,
} from "./incident-action/mapIncidentActionToInitialFormState";
import { mapIncidentManagementTeamMemberToInitialFormState } from "./incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";
import {
    mapRiskAssessmentQuestionnaireToInitialFormState,
    mapRiskAssessmentSummaryToInitialFormState,
    mapRiskGradingToInitialFormState,
} from "./risk-assessment/mapRiskAssessmentToInitialFormState";

export function mapEntityToFormState(
    configurableForm: ConfigurableForm,
    editMode?: boolean,
    existingEventTrackerTypes?: (DiseaseNames | HazardNames)[]
): FormState {
    switch (configurableForm.type) {
        case "disease-outbreak-event":
            return mapDiseaseOutbreakEventToInitialFormState(
                configurableForm,
                editMode ?? false,
                existingEventTrackerTypes ?? []
            );
        case "risk-assessment-grading":
            return mapRiskGradingToInitialFormState(configurableForm);
        case "risk-assessment-summary":
            return mapRiskAssessmentSummaryToInitialFormState(configurableForm);
        case "risk-assessment-questionnaire":
            return mapRiskAssessmentQuestionnaireToInitialFormState(configurableForm);
        case "incident-action-plan":
            return mapIncidentActionPlanToInitialFormState(configurableForm);
        case "incident-response-action":
            return mapIncidentResponseActionToInitialFormState(configurableForm);
        case "incident-management-team-member-assignment":
            return mapIncidentManagementTeamMemberToInitialFormState(configurableForm);
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
    const teamRoles = teamMember.teamRoles?.map(role => role.name).join(", ");
    return {
        value: teamMember.username,
        label: teamMember.name,
        workPosition: teamMember.workPosition || "",
        teamRoles: teamRoles || "",
        phone: teamMember.phone || "",
        email: teamMember.email || "",
        status: teamMember.status || "",
        src: teamMember.photo?.toString(),
        alt: teamMember.photo ? `Photo of ${teamMember.name}` : undefined,
    };
}
