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
                //Do not process events without Suspected disease or Hazard Type set as they are mandatory.
                const filteredEvents = diseaseOutbreakEvents.filter(
                    event => event.suspectedDiseaseCode
                );
                return this.options.performanceOverviewRepository.getNationalPerformanceOverviewMetrics(
                    filteredEvents
                );
            });
    }
}
