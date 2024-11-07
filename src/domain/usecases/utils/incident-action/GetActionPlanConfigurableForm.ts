import { FutureData } from "../../../../data/api-futures";
import { Configurations } from "../../../entities/AppConfigurations";
import { ActionPlanFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";

export function getActionPlanConfigurableForm(
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations
): FutureData<ActionPlanFormData> {
    const { incidentActionPlanConfigurations } = configurations.selectableOptions;
    const incidentActionPlanFormData: ActionPlanFormData = {
        type: "incident-action-plan",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.incidentActionPlan?.actionPlan,
        options: {
            iapType: incidentActionPlanConfigurations.iapType,
            phoecLevel: incidentActionPlanConfigurations.phoecLevel,
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
