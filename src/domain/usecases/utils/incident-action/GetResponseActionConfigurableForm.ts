import { FutureData } from "../../../../data/api-futures";
import { Configurations } from "../../../entities/AppConfigurations";
import { ResponseActionFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";

export function getResponseActionConfigurableForm(
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations
): FutureData<ResponseActionFormData> {
    const { incidentResponseActionConfigurations } = configurations.selectableOptions;
    const incidentResponseActionData: ResponseActionFormData = {
        type: "incident-response-action",
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
