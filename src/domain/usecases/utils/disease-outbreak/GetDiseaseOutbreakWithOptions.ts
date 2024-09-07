import { FutureData } from "../../../../data/api-futures";
import { ConfigurableForm, DiseaseOutbreakEventFormData } from "../../../entities/ConfigurableForm";
import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
} from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../../../repositories/OptionsRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getDiseaseOutbreakWithEventOptions(
    options: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        optionsRepository: OptionsRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    id?: Id
): FutureData<DiseaseOutbreakEventFormData> {
    if (id) {
        return options.diseaseOutbreakEventRepository.get(id).flatMap(diseaseOutbreakEventBase => {
            return getPopulatedDiseaseOutbreakEventWithOptions(options, diseaseOutbreakEventBase);
        });
    } else {
        return getPopulatedDiseaseOutbreakEventWithOptions(options);
    }
}

function getPopulatedDiseaseOutbreakEventWithOptions(
    options: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        optionsRepository: OptionsRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBase?: DiseaseOutbreakEventBaseAttrs
): FutureData<DiseaseOutbreakEventFormData> {
    return Future.joinObj({
        dataSources: options.optionsRepository.getDataSources(),
        hazardTypes: options.optionsRepository.getHazardTypes(),
        mainSyndromes: options.optionsRepository.getMainSyndromes(),
        suspectedDiseases: options.optionsRepository.getSuspectedDiseases(),
        notificationSources: options.optionsRepository.getNotificationSources(),
        incidentStatus: options.optionsRepository.getIncidentStatus(),
        teamMembers: options.teamMemberRepository.getAll(),
    }).flatMap(
        ({
            dataSources,
            hazardTypes,
            mainSyndromes,
            suspectedDiseases,
            notificationSources,
            incidentStatus,
            teamMembers,
        }) => {
            const diseaseOutbreakEventWithOptions: ConfigurableForm = {
                type: "disease-outbreak-event",
                entity: diseaseOutbreakEventBase,
                options: {
                    dataSources,
                    teamMembers,
                    hazardTypes,
                    mainSyndromes,
                    suspectedDiseases,
                    notificationSources,
                    incidentStatus,
                },

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
            return Future.success(diseaseOutbreakEventWithOptions);
        }
    );
}
