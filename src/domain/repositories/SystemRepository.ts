import { FutureData } from "../../data/api-futures";

export interface SystemRepository {
    getLastAnalyticsRuntime(): FutureData<string>;
}
