import { FutureData } from "../../data/api-futures";
import { ProgramIndicatorBaseAttrs } from "../../data/repositories/AnalyticsD2Repository";

export interface AnalyticsRepository {
    getProgramIndicators(): FutureData<ProgramIndicatorBaseAttrs[]>;
}
