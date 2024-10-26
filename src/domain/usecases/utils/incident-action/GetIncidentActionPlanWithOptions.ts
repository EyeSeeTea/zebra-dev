import { FutureData } from "../../../../data/api-futures";
import { AppConfigurations } from "../../../entities/AppConfigurations";
import { ActionPlanFormData, ResponseActionFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";

export function getIncidentActionPlanWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    appConfig: AppConfigurations
): FutureData<ActionPlanFormData> {
    const incidentActionPlanFormData: ActionPlanFormData = {
        type: "incident-action-plan",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.incidentActionPlan?.actionPlan,
        options: {
            iapType: appConfig.incidentActionPlanConfigurations.iapType,
            phoecLevel: appConfig.incidentActionPlanConfigurations.phoecLevel,
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
}

export function getIncidentResponseActionWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    appConfig: AppConfigurations
): FutureData<ResponseActionFormData> {
    const incidentResponseActionData: ResponseActionFormData = {
        type: "incident-response-action",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.incidentActionPlan?.responseActions ?? [],
        options: {
            searchAssignRO: appConfig.incidentResponseActionConfigurations.searchAssignRO,
            status: appConfig.incidentResponseActionConfigurations.status,
            verification: appConfig.incidentResponseActionConfigurations.verification,
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
}
