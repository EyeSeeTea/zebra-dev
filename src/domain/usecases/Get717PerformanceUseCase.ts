import { FutureData } from "../../data/api-futures";
import { PerformanceMetrics717 } from "../entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class Get717PerformanceUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(): FutureData<PerformanceMetrics717[]> {
        return this.options.performanceOverviewRepository.get717Performance();
    }
}
