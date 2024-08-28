import { FutureData } from "../../data/api-futures";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetDiseaseOutbreakWithOptionsUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
        }
    ) {}

    public execute(id?: Id): FutureData<ConfigurableForm> {
        if (id) {
            return this.options.diseaseOutbreakEventRepository
                .get(id)
                .flatMap(diseaseOutbreakEventBase => {
                    return this.getDiseaseOutbreakEventWithOptions(diseaseOutbreakEventBase);
                });
        } else {
            return this.getDiseaseOutbreakEventWithOptions();
        }
    }

    private getDiseaseOutbreakEventWithOptions(
        diseaseOutbreakEventBase?: DiseaseOutbreakEventBaseAttrs
    ): FutureData<ConfigurableForm> {
        return Future.joinObj({
            dataSources: this.options.optionsRepository.getAllDataSources(),
            hazardTypes: this.options.optionsRepository.getAllHazardTypes(),
            mainSyndromes: this.options.optionsRepository.getAllMainSyndromes(),
            suspectedDiseases: this.options.optionsRepository.getAllSuspectedDiseases(),
            notificationSources: this.options.optionsRepository.getAllNotificationSources(),
            incidentStatus: this.options.optionsRepository.getAllIncidentStatus(),
            teamMembers: this.options.teamMemberRepository.getAll(),
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
                    data: {
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
                            fieldValue: "EBS",
                            sectionIds: ["hazardType_section"],
                        },
                        {
                            type: "toggleSectionsVisibilityByFieldValue",
                            fieldId: "dataSource",
                            fieldValue: "IBS",
                            sectionIds: ["mainSyndrome_section", "suspectedDisease_section"],
                        },
                    ],
                };
                return Future.success(diseaseOutbreakEventWithOptions);
            }
        );
    }
}
