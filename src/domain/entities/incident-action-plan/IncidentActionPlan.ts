import { ActionPlan } from "./ActionPlan";
import { Ref } from "../Ref";
import { Struct } from "../generic/Struct";
import { ResponseAction } from "./ResponseAction";
import { Maybe } from "../../../utils/ts-utils";

interface IncidentActionPlanAttrs extends Ref {
    lastUpdated: Date;
    actionPlan: Maybe<ActionPlan>;
    responseActions: ResponseAction[];
}

export class IncidentActionPlan extends Struct<IncidentActionPlanAttrs>() {}
