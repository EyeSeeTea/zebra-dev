import { Struct } from "../generic/Struct";
import { Id } from "../Ref";

export type ActionPlanAttrs = {
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
