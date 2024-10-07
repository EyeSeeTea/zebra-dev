import { Future } from "../../../domain/entities/generic/Future";
import { SystemRepository } from "../../../domain/repositories/SystemRepository";
import { FutureData } from "../../api-futures";

export class SystemTestRepository implements SystemRepository {
    getLastAnalyticsRuntime(): FutureData<string> {
        return Future.success(new Date().toString());
    }
}
