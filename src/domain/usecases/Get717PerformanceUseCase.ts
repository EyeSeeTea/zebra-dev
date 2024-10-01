import { FutureData } from "../../data/api-futures";
import { Indicator717PerformanceBaseAttrs } from "../../data/repositories/PerformanceOverviewD2Repository";
import { PerformanceOverviewRepository } from "../repositories/PerformanceOverviewRepository";

export class Get717PerformanceUseCase {
    constructor(
        private options: {
            performanceOverviewRepository: PerformanceOverviewRepository;
        }
    ) {}

    public execute(): FutureData<Indicator717PerformanceBaseAttrs[]> {
        return this.options.performanceOverviewRepository.get717Performance();
    }
}
