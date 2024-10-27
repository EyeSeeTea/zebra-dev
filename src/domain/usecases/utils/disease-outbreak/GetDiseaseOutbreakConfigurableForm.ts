import { FutureData } from "../../../../data/api-futures";
import { DiseaseOutbreakEventFormData, FormLables } from "../../../entities/ConfigurableForm";
import { DataSource } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { Rule } from "../../../entities/Rule";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { Configurations } from "../../../entities/AppConfigurations";

export function getDiseaseOutbreakConfigurableForm(
    options: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    },
    configurations: Configurations,
    id?: Id
): FutureData<DiseaseOutbreakEventFormData> {
    const { rules, labels } = getEventTrackerLabelsRules();

    const diseaseOutbreakForm: DiseaseOutbreakEventFormData = {
        type: "disease-outbreak-event",
        entity: undefined,
        rules: rules,
        labels: labels,
        options: configurations.selectableOptions.eventTrackerConfigurations,
    };

    if (id) {
        return options.diseaseOutbreakEventRepository.get(id).flatMap(diseaseOutbreakEventBase => {
            const populatedDiseaseOutbreakForm: DiseaseOutbreakEventFormData = {
                ...diseaseOutbreakForm,
                entity: diseaseOutbreakEventBase,
            };
            return Future.success(populatedDiseaseOutbreakForm);
        });
    } else {
        return Future.success(diseaseOutbreakForm);
    }
}

function getEventTrackerLabelsRules(): { rules: Rule[]; labels: FormLables } {
    return {
        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
                field_is_required_na: "This field is required when not applicable",
            },
        },
        // TODO: Get rules from Datastore used in applyRulesInFormState
        rules: [
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "dataSource",
                fieldValue: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
                sectionIds: ["hazardType_section"],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "dataSource",
                fieldValue: DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
                sectionIds: ["mainSyndrome_section", "suspectedDisease_section"],
            },
        ],
    };
}
