import { Maybe } from "../../../utils/ts-utils";
import { Struct } from "../generic/Struct";
import { Id } from "../Ref";

export type ActionPlanIAPType = "Initial" | "Update" | "Final";
export type ActionPlanPhoecLevel = "Response" | "Watch" | "Alert";

export type ActionPlanAttrs = {
    lastUpdated: Maybe<Date>;
    id: Id;
    iapType: string;
    phoecLevel: string;
    criticalInfoRequirements: string;
    planningAssumptions: string;
    responseObjectives: string;
    responseStrategies: string;
    expectedResults: string;
    responseActivitiesNarrative: string;
};

export class ActionPlan extends Struct<ActionPlanAttrs>() {}
