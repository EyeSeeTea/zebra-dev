import { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    IncidentActionPlanDataValues,
    incidentActionPlanIds,
    IncidentResponseActionDataValues,
    incidentResponseActionsIds,
} from "../IncidentActionD2Repository";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import {
    ActionPlanFormData,
    ResponseActionFormData,
} from "../../../domain/entities/ConfigurableForm";
import { D2ProgramStageDataElementsMetadata } from "./RiskAssessmentMapper";
import { ActionPlanAttrs } from "../../../domain/entities/incident-action-plan/ActionPlan";
import {
    ActionPlanCodes,
    getValueFromIncidentActionPlan,
    getValueFromIncidentResponseAction,
    IncidentActionPlanKeyCode,
    IncidentResponseActionKeyCode,
    isStringInIncidentActionPlanCodes,
    isStringInIncidentResponseActionCodes,
    ResponseActionCodes,
} from "../consts/IncidentActionConstants";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "../consts/DiseaseOutbreakConstants";
import {
    ResponseAction,
    Status,
    Verification,
} from "../../../domain/entities/incident-action-plan/ResponseAction";

export function mapDataElementsToIncidentActionPlan(
    id: Id,
    dataValues: DataValue[]
): IncidentActionPlanDataValues {
    const iapType = getValueById(dataValues, incidentActionPlanIds.iapType);
    const phoecLevel = getValueById(dataValues, incidentActionPlanIds.phoecLevel);
    const criticalInfoRequirements = getValueById(
        dataValues,
        incidentActionPlanIds.criticalInfoRequirements
    );
    const planningAssumptions = getValueById(dataValues, incidentActionPlanIds.planningAssumptions);
    const responseObjectives = getValueById(dataValues, incidentActionPlanIds.responseObjectives);
    const responseStrategies = getValueById(dataValues, incidentActionPlanIds.responseStrategies);
    const expectedResults = getValueById(dataValues, incidentActionPlanIds.expectedResults);
    const responseActivitiesNarrative = getValueById(
        dataValues,
        incidentActionPlanIds.responseActivitiesNarrative
    );

    const incidentActionPlan: IncidentActionPlanDataValues = {
        id: id,
        iapType: iapType,
        phoecLevel: phoecLevel,
        criticalInfoRequirements: criticalInfoRequirements,
        planningAssumptions: planningAssumptions,
        responseObjectives: responseObjectives,
        responseStrategies: responseStrategies,
        expectedResults: expectedResults,
        responseActivitiesNarrative: responseActivitiesNarrative,
    };

    return incidentActionPlan;
}

export function mapDataElementsToIncidentResponseActions(
    instances: D2TrackerEvent[]
): IncidentResponseActionDataValues[] {
    const incidentResponseActions: IncidentResponseActionDataValues[] = instances.map(instance => {
        const { event, dataValues } = instance;

        const mainTask = getValueById(dataValues, incidentResponseActionsIds.mainTask);
        const subActivities = getValueById(dataValues, incidentResponseActionsIds.subActivities);
        const subPillar = getValueById(dataValues, incidentResponseActionsIds.subPillar);
        const searchAssignRO = getValueById(dataValues, incidentResponseActionsIds.searchAssignRO);
        const dueDate = getValueById(dataValues, incidentResponseActionsIds.dueDate);
        const timeLine = getValueById(dataValues, incidentResponseActionsIds.timeLine);
        const status = getValueById(dataValues, incidentResponseActionsIds.status) as Status;
        const verification = getValueById(
            dataValues,
            incidentResponseActionsIds.verification
        ) as Verification;

        return {
            id: event,
            mainTask,
            subActivities,
            subPillar,
            searchAssignRO,
            dueDate,
            timeLine,
            status,
            verification,
        };
    });

    //DHIS returns events last updated first, zebra app needs it in order of creation,
    //so we reverse the order
    return incidentResponseActions.reverse();
}

export function mapIncidentActionToDataElements(
    formData: ActionPlanFormData | ResponseActionFormData,
    programStageId: Id,
    teiId: Id,
    enrollmentId: Id,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
) {
    if (!formData.entity) throw new Error("No form data found");

    switch (formData.type) {
        case "incident-action-plan":
            return mapIncidentActionPlanToDataElements(
                programStageId,
                teiId,
                enrollmentId,
                formData.entity,
                programStageDataElementsMetadata
            );
        case "incident-response-action":
            return mapIncidentResponseActionToDataElements(
                programStageId,
                teiId,
                enrollmentId,
                formData.entity,
                programStageDataElementsMetadata
            );
        default:
            throw new Error("Form type not supported");
    }
}

function mapIncidentActionPlanToDataElements(
    programStageId: Id,
    teiId: Id,
    enrollmentId: Id,
    incidentActionPlan: ActionPlanAttrs,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent {
    const dataElementValues: Record<ActionPlanCodes, string> =
        getValueFromIncidentActionPlan(incidentActionPlan);

    const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
        if (!isStringInIncidentActionPlanCodes(programStage.dataElement.code)) {
            throw new Error(
                `DataElement code ${programStage.dataElement.code} not found in Incident Action Plan Codes`
            );
        }
        const typedCode: IncidentActionPlanKeyCode = programStage.dataElement.code;
        return getPopulatedDataElement(programStage.dataElement.id, dataElementValues[typedCode]);
    });

    return getIncidentActionTrackerEvent(
        programStageId,
        incidentActionPlan.id,
        enrollmentId,
        dataValues,
        teiId
    );
}

export function mapIncidentResponseActionToDataElements(
    programStageId: Id,
    teiId: Id,
    enrollmentId: Id,
    incidentResponseActions: ResponseAction[],
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent[] {
    return incidentResponseActions.map(incidentResponseAction => {
        const dataElementValues: Record<ResponseActionCodes, string> =
            getValueFromIncidentResponseAction(incidentResponseAction);

        const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
            if (!isStringInIncidentResponseActionCodes(programStage.dataElement.code)) {
                throw new Error(
                    `DataElement code ${programStage.dataElement.code} not found in Incident Action Plan Codes`
                );
            }
            const typedCode: IncidentResponseActionKeyCode = programStage.dataElement.code;

            return getPopulatedDataElement(
                programStage.dataElement.id,
                dataElementValues[typedCode]
            );
        });

        return getIncidentActionTrackerEvent(
            programStageId,
            incidentResponseAction.id,
            enrollmentId,
            dataValues,
            teiId
        );
    });
}

function getPopulatedDataElement(dataElement: Id, value: Maybe<string>): DataValue {
    const populatedDataElement: DataValue = {
        dataElement: dataElement,
        value: value ?? "",
        updatedAt: new Date().toISOString(),
        storedBy: "",
        createdAt: new Date().toISOString(),
        providedElsewhere: false,
    };

    return populatedDataElement;
}

function getIncidentActionTrackerEvent(
    programStageId: Id,
    id: Maybe<Id>,
    enrollmentId: Id,
    dataValues: DataValue[],
    teiId: Id
): D2TrackerEvent {
    const d2IncidentAction: D2TrackerEvent = {
        event: id ?? "",
        status: "ACTIVE",
        program: RTSL_ZEBRA_PROGRAM_ID,
        programStage: programStageId,
        enrollment: enrollmentId,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        occurredAt: new Date().toISOString(),
        dataValues: dataValues,
        trackedEntity: teiId,
    };

    return d2IncidentAction;
}

function getValueById(dataValues: DataValue[], dataElement: string): Maybe<string> {
    return dataValues.find(dataValue => dataValue.dataElement === dataElement)?.value;
}
