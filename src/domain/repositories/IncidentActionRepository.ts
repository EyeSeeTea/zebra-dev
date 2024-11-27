import { FutureData } from "../../data/api-futures";
import {
    IncidentActionPlanDataValues,
    IncidentResponseActionDataValues,
} from "../../data/repositories/IncidentActionD2Repository";
import { Maybe } from "../../utils/ts-utils";
import {
    ActionPlanFormData,
    ResponseActionFormData,
    SingleResponseActionFormData,
} from "../entities/ConfigurableForm";
import { Id } from "../entities/Ref";

export interface IncidentActionRepository {
    getIncidentActionPlan(diseaseOutbreakId: Id): FutureData<Maybe<IncidentActionPlanDataValues>>;
    getIncidentResponseActions(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<IncidentResponseActionDataValues[]>>;
    saveIncidentAction(
        formData: ActionPlanFormData | ResponseActionFormData | SingleResponseActionFormData,
        diseaseOutbreakId: Id
    ): FutureData<void>;
    deleteIncidentResponseAction(eventId: Id): FutureData<void>;
    updateIncidentResponseAction(options: UpdateIncidentResponseActionOptions): FutureData<void>;
}

export type UpdateIncidentResponseActionOptions = {
    diseaseOutbreakId: Id;
    eventId: Id;
    responseAction: {
        value: string;
        type: string;
    };
};
