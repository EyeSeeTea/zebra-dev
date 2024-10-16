import {
    ActionPlanAttrs,
    ActionPlanIAPType,
    ActionPlanPhoecLevel,
} from "../../../domain/entities/incident-action-plan/ActionPlan";
import {
    ResponseAction,
    ResponseActionStatusType,
    ResponseActionVerificationType,
} from "../../../domain/entities/incident-action-plan/ResponseAction";
import { GetValue, Maybe } from "../../../utils/ts-utils";

export const actionPlanConstants = {
    iapType: "RTSL_ZEB_DET_IAP_TYPE",
    phoecLevel: "RTSL_ZEB_DET_PHOEC_ACT_LEVEL",
    criticalInfoRequirements: "RTSL_ZEB_DET_CIR",
    planningAssumptions: "RTSL_ZEB_DET_PLANNING_ASSUMPTIONS",
    responseObjectives: "RTSL_ZEB_DET_RESPONSE_OBJECTIVES",
    responseStrategies: "RTSL_ZEB_DET_RESPONSE_STRATEGIES",
    expectedResults: "RTSL_ZEB_DET_SECTIONS_OBJECTIVES_EXPECTED_RESULTS",
    responseActivitiesNarrative: "RTSL_ZEB_DET_RESPONSE_ACTIVITIES_NARRATIVE",
} as const;

export type ActionPlanCodes = GetValue<typeof actionPlanConstants>;

export type IncidentActionPlanKeyCode =
    (typeof actionPlanConstants)[keyof typeof actionPlanConstants];

export function isStringInIncidentActionPlanCodes(code: string): code is IncidentActionPlanKeyCode {
    return (Object.values(actionPlanConstants) as string[]).includes(code);
}

const iapTypeCodeMap: Record<ActionPlanIAPType, string> = {
    Initial: "RTSL_ZEB_OS_IAP_TYPE_INITIAL",
    Update: "RTSL_ZEB_OS_IAP_TYPE_UPDATE",
    Final: "RTSL_ZEB_OS_IAP_TYPE_FINAL",
};

export function getIAPTypeByCode(iapTypeCode: string): Maybe<ActionPlanIAPType> {
    return (Object.keys(iapTypeCodeMap) as ActionPlanIAPType[]).find(
        key => iapTypeCodeMap[key] === iapTypeCode
    );
}

const phoecLevelCodeMap: Record<ActionPlanPhoecLevel, string> = {
    Response: "RTSL_ZEB_OS_PHOEC_ACT_LEVEL_RESPONSE",
    Watch: "RTSL_ZEB_OS_PHOEC_ACT_LEVEL_WATCH",
    Alert: "RTSL_ZEB_OS_PHOEC_ACT_LEVEL_ALERT",
};

export function getPhoecLevelByCode(phoecLevelCode: string): ActionPlanPhoecLevel | undefined {
    return (Object.keys(phoecLevelCodeMap) as ActionPlanPhoecLevel[]).find(
        key => phoecLevelCodeMap[key] === phoecLevelCode
    );
}

export const responseActionConstants = {
    mainTask: "RTSL_ZEB_DET_MAIN_TASK",
    subActivities: "RTSL_ZEB_DET_SUB_ACTIVITIES",
    subPillar: "RTSL_ZEB_DET_SUB_PILLAR",
    searchAssignRO: "RTSL_ZEB_DET_SEARCH_ASSIGN_RO",
    dueDate: "RTSL_ZEB_DET_DUE_DATE",
    timeLine: "RTSL_ZEB_DET_TIMELINE",
    status: "RTSL_ZEB_DET_STATUS",
    verification: "RTSL_ZEB_DET_VERIFICATION",
} as const;

export type ResponseActionCodes = GetValue<typeof responseActionConstants>;

export type IncidentResponseActionKeyCode =
    (typeof responseActionConstants)[keyof typeof responseActionConstants];

export function isStringInIncidentResponseActionCodes(
    code: string
): code is IncidentResponseActionKeyCode {
    return (Object.values(responseActionConstants) as string[]).includes(code);
}

export const statusCodeMap: Record<ResponseActionStatusType, string> = {
    "Not done": "RTSL_ZEB_OS_STATUS_NOT_DONE",
    Pending: "RTSL_ZEB_OS_STATUS_PENDING",
    "In Progress": "RTSL_ZEB_OS_STATUS_IN_PROGRESS",
    Complete: "RTSL_ZEB_OS_STATUS_COMPLETE",
} as const;

export function getStatusTypeByCode(iapTypeCode: string): Maybe<ResponseActionStatusType> {
    return (Object.keys(statusCodeMap) as ResponseActionStatusType[]).find(
        key => statusCodeMap[key] === iapTypeCode
    );
}

export const verificationCodeMap: Record<ResponseActionVerificationType, string> = {
    Verified: "RTSL_ZEB_OS_VERIFICATION_VERIFIED",
    Unverified: "RTSL_ZEB_OS_VERIFICATION_UNVERIFIED",
};

export function getVerificationTypeByCode(
    iapTypeCode: string
): Maybe<ResponseActionVerificationType> {
    return (Object.keys(verificationCodeMap) as ResponseActionVerificationType[]).find(
        key => verificationCodeMap[key] === iapTypeCode
    );
}

export function getValueFromIncidentActionPlan(
    incidentActionPlan: ActionPlanAttrs
): Record<ActionPlanCodes, string> {
    return {
        RTSL_ZEB_DET_IAP_TYPE: incidentActionPlan.iapType || "",
        RTSL_ZEB_DET_PHOEC_ACT_LEVEL: incidentActionPlan.phoecLevel || "",
        RTSL_ZEB_DET_CIR: incidentActionPlan.criticalInfoRequirements || "",
        RTSL_ZEB_DET_PLANNING_ASSUMPTIONS: incidentActionPlan.planningAssumptions || "",
        RTSL_ZEB_DET_RESPONSE_OBJECTIVES: incidentActionPlan.responseObjectives || "",
        RTSL_ZEB_DET_RESPONSE_STRATEGIES: incidentActionPlan.responseStrategies || "",
        RTSL_ZEB_DET_SECTIONS_OBJECTIVES_EXPECTED_RESULTS: incidentActionPlan.expectedResults || "",
        RTSL_ZEB_DET_RESPONSE_ACTIVITIES_NARRATIVE:
            incidentActionPlan.responseActivitiesNarrative || "",
    };
}

export function getValueFromIncidentResponseAction(
    incidentResponseAction: ResponseAction
): Record<ResponseActionCodes, string> {
    return {
        RTSL_ZEB_DET_MAIN_TASK: incidentResponseAction.mainTask || "",
        RTSL_ZEB_DET_SUB_ACTIVITIES: incidentResponseAction.subActivities || "",
        RTSL_ZEB_DET_SUB_PILLAR: incidentResponseAction.subPillar || "",
        RTSL_ZEB_DET_SEARCH_ASSIGN_RO: incidentResponseAction.searchAssignRO?.username || "",
        RTSL_ZEB_DET_DUE_DATE: incidentResponseAction.dueDate.toISOString(),
        RTSL_ZEB_DET_TIMELINE: incidentResponseAction.timeLine || "",
        RTSL_ZEB_DET_STATUS: incidentResponseAction.status,
        RTSL_ZEB_DET_VERIFICATION: incidentResponseAction.verification,
    };
}
