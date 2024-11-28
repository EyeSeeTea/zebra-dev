import { FutureData } from "../../../../data/api-futures";
import { Configurations } from "../../../entities/AppConfigurations";
import {
    ResponseActionFormData,
    SingleResponseActionFormData,
} from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";

export function getResponseActionConfigurableForm(
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations
): FutureData<ResponseActionFormData> {
    const { incidentResponseActionConfigurations } = configurations.selectableOptions;
    const incidentResponseActionData: ResponseActionFormData = {
        type: "incident-response-actions",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.incidentActionPlan?.responseActions ?? [],
        options: {
            searchAssignRO: incidentResponseActionConfigurations.searchAssignRO,
            status: incidentResponseActionConfigurations.status,
            verification: incidentResponseActionConfigurations.verification,
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

export function getSingleResponseActionConfigurableForm(options: {
    eventTrackerDetails: DiseaseOutbreakEvent;
    responseActionId: string;
    configurations: Configurations;
}): FutureData<SingleResponseActionFormData> {
    const { eventTrackerDetails, responseActionId, configurations } = options;
    const { incidentResponseActionConfigurations } = configurations.selectableOptions;

    const incidentResponseActionData: SingleResponseActionFormData = {
        type: "incident-response-action",
        eventTrackerDetails: eventTrackerDetails,
        entity:
            eventTrackerDetails.incidentActionPlan?.responseActions.find(
                responseAction => responseAction.id === responseActionId
            ) ??
            (() => {
                throw new Error("Response Action not found");
            })(),
        options: {
            searchAssignRO: incidentResponseActionConfigurations.searchAssignRO,
            status: incidentResponseActionConfigurations.status,
            verification: incidentResponseActionConfigurations.verification,
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
