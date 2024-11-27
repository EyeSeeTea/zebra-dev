import { Id } from "../../../domain/entities/Ref";
import {
    IncidentActionRepository,
    UpdateIncidentResponseActionOptions,
} from "../../../domain/repositories/IncidentActionRepository";
import { Maybe } from "../../../utils/ts-utils";
import { FutureData } from "../../api-futures";
import {
    IncidentActionPlanDataValues,
    IncidentResponseActionDataValues,
} from "../IncidentActionD2Repository";

export class IncidentActionTestRepository implements IncidentActionRepository {
    getIncidentActionPlan(_diseaseOutbreakId: Id): FutureData<Maybe<IncidentActionPlanDataValues>> {
        throw new Error("Method not implemented.");
    }

    getIncidentResponseActions(
        _diseaseOutbreakId: Id
    ): FutureData<Maybe<IncidentResponseActionDataValues[]>> {
        throw new Error("Method not implemented.");
    }

    saveIncidentAction(_formData: any, _diseaseOutbreakId: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }

    deleteIncidentResponseAction(_eventId: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }

    updateIncidentResponseAction(_options: UpdateIncidentResponseActionOptions): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
