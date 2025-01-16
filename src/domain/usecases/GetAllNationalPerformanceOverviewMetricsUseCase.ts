import { FutureData } from "../../data/api-futures";
import { PerformanceOverviewMetrics } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class GetAllNationalPerformanceOverviewMetricsUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(): FutureData<PerformanceOverviewMetrics[]> {
        return this.options.diseaseOutbreakEventRepository
            .getAll()
            .flatMap(diseaseOutbreakEvents => {
                return this.options.performanceOverviewRepository.getNationalPerformanceOverviewMetrics(
                    diseaseOutbreakEvents
                );
            });
    }
}
