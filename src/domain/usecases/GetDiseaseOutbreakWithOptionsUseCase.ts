import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
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

    public execute(id?: Id): FutureData<DiseaseOutbreakEventWithOptions> {
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
    ): FutureData<DiseaseOutbreakEventWithOptions> {
        return Future.joinObj({
            hazardTypes: this.options.optionsRepository.getAllHazardTypes(),
            mainSyndromes: this.options.optionsRepository.getAllMainSyndromes(),
            suspectedDiseases: this.options.optionsRepository.getAllSuspectedDiseases(),
            notificationSources: this.options.optionsRepository.getAllNotificationSources(),
            incidentStatus: this.options.optionsRepository.getAllIncidentStatus(),
            teamMembers: this.options.teamMemberRepository.getAll(),
        }).flatMap(
            ({
                hazardTypes,
                mainSyndromes,
                suspectedDiseases,
                notificationSources,
                incidentStatus,
                teamMembers,
            }) => {
                const diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions = {
                    diseaseOutbreakEvent: diseaseOutbreakEventBase,
                    options: {
                        teamMembers,
                        hazardTypes,
                        mainSyndromes,
                        suspectedDiseases,
                        notificationSources,
                        incidentStatus,
                    },
                    // TODO: Get labels form Datastore used in mapEntityToInitialFormState to create initial form state
                    labels: {
                        errors: {
                            field_is_required: "This field is required",
                            field_is_required_na: "This field is required when not applicable",
                        },
                    },
                };
                return Future.success(diseaseOutbreakEventWithOptions);
            }
        );
    }
}
