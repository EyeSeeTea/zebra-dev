import { FutureData } from "../../../../data/api-futures";
import { ActionPlanFormData, ResponseActionFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { OptionsRepository } from "../../../repositories/OptionsRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getIncidentActionPlanWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    optionsRepository: OptionsRepository
): FutureData<ActionPlanFormData> {
    return Future.joinObj({
        iapTypeOptions: optionsRepository.getIapTypeOptions(),
        phoecLevelOptions: optionsRepository.getPhoecLevelOptions(),
    }).flatMap(({ iapTypeOptions, phoecLevelOptions }) => {
        const incidentActionPlanFormData: ActionPlanFormData = {
            type: "incident-action-plan",
            eventTrackerDetails: eventTrackerDetails,
            entity: eventTrackerDetails.incidentActionPlan?.actionPlan,
            options: {
                iapType: iapTypeOptions,
                phoecLevel: phoecLevelOptions,
            },
            // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
            labels: {
                errors: {
                    field_is_required: "This field is required",
                },
            },
            rules: [],
        };

        return Future.success(incidentActionPlanFormData);
    });
}

export function getIncidentResponseActionWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
): FutureData<ResponseActionFormData> {
    return Future.joinObj({
        responsibleOfficers: teamMemberRepository.getAll(),
        statusOptions: optionsRepository.getStatusOptions(),
        verificationOptions: optionsRepository.getVerificationOptions(),
    }).flatMap(({ responsibleOfficers, statusOptions, verificationOptions }) => {
        const incidentResponseActionData: ResponseActionFormData = {
            type: "incident-response-action",
            eventTrackerDetails: eventTrackerDetails,
            entity: eventTrackerDetails.incidentActionPlan?.responseActions[0],
            options: {
                searchAssignRO: responsibleOfficers,
                status: statusOptions,
                verification: verificationOptions,
            },
            // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
            labels: {
                errors: {
                    field_is_required: "This field is required",
                },
            },
            rules: [],
        };

        return Future.success(incidentResponseActionData);
    });
}
