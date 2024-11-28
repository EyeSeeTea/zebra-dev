import { Future } from "../../../domain/entities/generic/Future";
import { ChartConfigRepository } from "../../../domain/repositories/ChartConfigRepository";
import { FutureData } from "../../api-futures";

export class ChartConfigTestRepository implements ChartConfigRepository {
    getRiskAssessmentHistory(_chartKey: string): FutureData<string> {
        return Future.success("1");
    }
    getCases(_chartkey: string): FutureData<string> {
        return Future.success("1");
    }
    getDeaths(_chartKey: string): FutureData<string> {
        return Future.success("1");
    }
}
