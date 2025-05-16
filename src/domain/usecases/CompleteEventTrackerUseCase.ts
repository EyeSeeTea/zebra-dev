import { FutureData } from "../../data/api-futures";
import { getOutbreakKey } from "../entities/AlertsAndCaseForCasesData";
import { Configurations } from "../entities/AppConfigurations";
import {
    CasesDataSource,
    DiseaseOutbreakEvent,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { CasesFileRepository } from "../repositories/CasesFileRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class CompleteEventTrackerUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            casesFileRepository: CasesFileRepository;
        }
    ) {}

    public execute(
        diseaseOutbreakEvent: DiseaseOutbreakEvent,
        configurations: Configurations
    ): FutureData<void> {
        return this.options.diseaseOutbreakEventRepository
            .complete(diseaseOutbreakEvent.id)
            .flatMap(() => {
                if (
                    diseaseOutbreakEvent.casesDataSource ===
                    CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF
                ) {
                    const outbreakKey = getOutbreakKey({
                        dataSource: diseaseOutbreakEvent.dataSource,
                        outbreakValue:
                            diseaseOutbreakEvent.suspectedDiseaseCode ||
                            diseaseOutbreakEvent.hazardType,
                        hazardTypes:
                            configurations.selectableOptions.eventTrackerConfigurations.hazardTypes,
                        suspectedDiseases:
                            configurations.selectableOptions.eventTrackerConfigurations
                                .suspectedDiseases,
                    });
                    return this.options.casesFileRepository.delete(outbreakKey);
                } else {
                    return Future.success(undefined);
                }
            });
    }
}
