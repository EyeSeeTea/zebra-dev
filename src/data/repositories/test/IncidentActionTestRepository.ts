import { Id } from "../../../domain/entities/Ref";
import { IncidentActionRepository } from "../../../domain/repositories/IncidentActionRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import {
    IncidentActionPlanDataValues,
    IncidentResponseActionsDataValues,
} from "../IncidentActionD2Repository";

export class IncidentActionTestRepository implements IncidentActionRepository {
    getIncidentActionPlan(_diseaseOutbreakId: Id): FutureData<Maybe<IncidentActionPlanDataValues>> {
        throw new Error("Method not implemented.");
    }

    getIncidentResponseActions(
        _diseaseOutbreakId: Id
    ): FutureData<Maybe<IncidentResponseActionsDataValues>> {
        throw new Error("Method not implemented.");
    }

    saveIncidentAction(_formData: any, _diseaseOutbreakId: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
