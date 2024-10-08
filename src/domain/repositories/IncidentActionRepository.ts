import { FutureData } from "../../data/api-futures";
import {
    IncidentActionPlanDataValues,
    IncidentResponseActionsDataValues,
} from "../../data/repositories/IncidentActionD2Repository";
import { Maybe } from "../../utils/ts-utils";
import { ActionPlanFormData, ResponseActionFormData } from "../entities/ConfigurableForm";
import { Id } from "../entities/Ref";

export interface IncidentActionRepository {
    getIncidentActionPlan(diseaseOutbreakId: Id): FutureData<Maybe<IncidentActionPlanDataValues>>;
    getIncidentResponseActions(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<IncidentResponseActionsDataValues>>;
    saveIncidentAction(
        formData: ActionPlanFormData | ResponseActionFormData,
        diseaseOutbreakId: Id
    ): FutureData<void>;
}
