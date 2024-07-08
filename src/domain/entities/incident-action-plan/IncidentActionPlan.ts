import { ActionPlan } from "./ActionPlan";
import { Ref } from "../Ref";
import { Struct } from "../generic/Struct";
import { ResponseAction } from "./ResponseAction";

interface IncidentActionPlanAttrs extends Ref {
    lastUpdated: Date;
    actionPlan: ActionPlan;
    responseActions: ResponseAction[];
}

export class IncidentActionPlan extends Struct<IncidentActionPlanAttrs>() {}
