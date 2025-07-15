import { FutureData } from "../../data/api-futures";
import { getOutbreakKey } from "../entities/AlertsAndCaseForCasesData";
import { Configurations } from "../entities/AppConfigurations";
import {
    CasesDataSource,
    DiseaseOutbreakEvent,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { AlertRepository } from "../repositories/AlertRepository";
import { CasesFileRepository } from "../repositories/CasesFileRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class CompleteEventTrackerUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            casesFileRepository: CasesFileRepository;
            alertRepository: AlertRepository;
        }
    ) {}

    public execute(
        diseaseOutbreakEvent: DiseaseOutbreakEvent,
        configurations: Configurations
    ): FutureData<void> {
        return this.options.diseaseOutbreakEventRepository
            .complete(diseaseOutbreakEvent.id)
            .flatMap(() => {
                return this.options.alertRepository
                    .updateAlertsPHEOCStatusByDiseaseOutbreakId(diseaseOutbreakEvent.id, "Alert")
                    .flatMap(() => {
                        if (
                            diseaseOutbreakEvent.casesDataSource ===
                            CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF
                        ) {
                            const outbreakKey = getOutbreakKey({
                                diseaseCode: diseaseOutbreakEvent.suspectedDiseaseCode,
                                diseaseOptions:
                                    configurations.selectableOptions.eventTrackerConfigurations
                                        .suspectedDiseases,
                            });
                            return this.options.casesFileRepository.delete(outbreakKey);
                        } else {
                            return Future.success(undefined);
                        }
                    });
            });
    }
}
