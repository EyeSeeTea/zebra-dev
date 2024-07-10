import { Property } from "../Properties";
import { Struct } from "../generic/Struct";

interface ActionPlanAttrs {
    properties: Property[];
}

export class ActionPlan extends Struct<ActionPlanAttrs>() {}
