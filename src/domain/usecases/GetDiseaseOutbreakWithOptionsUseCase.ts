import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetDiseaseOutbreakWithOptionsUseCase {
    constructor(
        private diseaseOutbreakRepository: DiseaseOutbreakEventRepository,
        private optionsRepository: OptionsRepository,
        private teamMemberRepository: TeamMemberRepository,
        private orgUnitRepository: OrgUnitRepository
    ) {}

    public execute(id?: Id): FutureData<DiseaseOutbreakEventWithOptions> {
        if (id) {
            return this.diseaseOutbreakRepository.get(id).flatMap(diseaseOutbreakEventBase => {
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
            hazardTypes: this.optionsRepository.getAllHazardTypes(),
            mainSyndromes: this.optionsRepository.getAllMainSyndromes(),
            suspectedDiseases: this.optionsRepository.getAllSuspectedDiseases(),
            notificationSources: this.optionsRepository.getAllNotificationSources(),
            organisationUnits: this.orgUnitRepository.getAll(),
            incidentStatus: this.optionsRepository.getAllIncidentStatus(),
            teamMembers: this.teamMemberRepository.getAll(),
        }).flatMap(
            ({
                hazardTypes,
                mainSyndromes,
                suspectedDiseases,
                notificationSources,
                organisationUnits,
                incidentStatus,
                teamMembers,
            }) => {
                const diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions = {
                    diseaseOutbreakEvent: diseaseOutbreakEventBase,
                    options: {
                        teamMembers,
                        organisationUnits,
                        hazardTypes,
                        mainSyndromes,
                        suspectedDiseases,
                        notificationSources,
                        incidentStatus,
                    },
                    // TODO: Get labels form Datastore
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
