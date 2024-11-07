import { ActionPlan } from "./ActionPlan";
import { Option, Ref } from "../Ref";
import { Struct } from "../generic/Struct";
import { ResponseAction } from "./ResponseAction";
import { Maybe } from "../../../utils/ts-utils";

export type IncidentActionOptions = {
    status: Option[];
    verification: Option[];
};

interface IncidentActionPlanAttrs extends Ref {
    actionPlan: Maybe<ActionPlan>;
    responseActions: ResponseAction[];
    incidentActionOptions: IncidentActionOptions;
}

export class IncidentActionPlan extends Struct<IncidentActionPlanAttrs>() {}
