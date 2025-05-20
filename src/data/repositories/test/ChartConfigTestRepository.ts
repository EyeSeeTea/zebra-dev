import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { ChartConfigRepository } from "../../../domain/repositories/ChartConfigRepository";
import { FutureData } from "../../api-futures";

export class ChartConfigTestRepository implements ChartConfigRepository {
    getRiskAssessmentHistory(_chartKey: string): FutureData<string> {
        return Future.success("1");
    }
    getCasesAndDeathsByDataSource(
        _chartKey: string,
        _casesDataSource: CasesDataSource
    ): FutureData<Record<string, string>> {
        return Future.success({ all: "1" });
    }
}
