import { FutureData } from "../../data/api-futures";
import { SystemRepository } from "../repositories/SystemRepository";

export class GetAnalyticsRuntimeUseCase {
    constructor(
        private options: {
            systemRepository: SystemRepository;
        }
    ) {}

    public execute(): FutureData<string> {
        return this.options.systemRepository.getLastAnalyticsRuntime();
    }
}
