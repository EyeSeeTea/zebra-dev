import { D2Api } from "../../types/d2-api";
import { Maybe } from "../../utils/ts-utils";
import { apiToFuture, FutureData } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import {
    RTSL_ZEBRA_INCIDENT_ACTION_PLAN_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_INCIDENT_RESPONSE_ACTION_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
} from "./consts/DiseaseOutbreakConstants";
import { IncidentActionRepository } from "../../domain/repositories/IncidentActionRepository";
import {
    mapDataElementsToIncidentActionPlan,
    mapDataElementsToIncidentResponseActions,
    mapIncidentActionToDataElements,
} from "./utils/IncidentActionMapper";
import { ActionPlanFormData, ResponseActionFormData } from "../../domain/entities/ConfigurableForm";
import { getProgramStage } from "./utils/MetadataHelper";
import { Future } from "../../domain/entities/generic/Future";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import { Status, Verification } from "../../domain/entities/incident-action-plan/ResponseAction";

export const incidentActionPlanIds = {
    iapType: "wr1I51WTHhl",
    phoecLevel: "KgTXZonQEsm",
    criticalInfoRequirements: "sgZ6MgzCI7m",
    planningAssumptions: "RZviL2uz1Wa",
    responseObjectives: "giq2C0lvCza",
    responseStrategies: "lbcbEZ8bEpK",
    expectedResults: "sB1N7Nkm5Y1",
    responseActivitiesNarrative: "RnWk88dYOXN",
} as const;

export type IncidentActionPlanDataValues = {
    id: string;
    iapType: Maybe<string>;
    phoecLevel: Maybe<string>;
    criticalInfoRequirements: Maybe<string>;
    planningAssumptions: Maybe<string>;
    responseObjectives: Maybe<string>;
    responseStrategies: Maybe<string>;
    expectedResults: Maybe<string>;
    responseActivitiesNarrative: Maybe<string>;
};

export const incidentResponseActionsIds = {
    mainTask: "k3FiTDWD18d",
    subActivities: "i728CZUYlRB",
    subPillar: "BQhCqEHOyej",
    searchAssignRO: "Z9a067KbV5J",
    dueDate: "i2M51y9qBoC",
    timeLine: "xvWvQ3K1GVA",
    status: "mUR4eNxgAwg",
    verification: "M62NkbKXhqZ",
};

export type IncidentResponseActionsDataValues = {
    id: string;
    mainTask: Maybe<string>;
    subActivities: Maybe<string>;
    subPillar: Maybe<string>;
    searchAssignRO: Maybe<string>;
    dueDate: Maybe<string>;
    timeLine: Maybe<string>;
    status: Maybe<Status>;
    verification: Maybe<Verification>;
};

export class IncidentActionD2Repository implements IncidentActionRepository {
    constructor(private api: D2Api) {}

    private fields = {
        event: true,
        dataValues: {
            dataElement: { id: true, code: true },
            value: true,
        },
        trackedEntity: true,
    };

    getIncidentActionPlan(diseaseOutbreakId: Id): FutureData<Maybe<IncidentActionPlanDataValues>> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: diseaseOutbreakId,
                programStage: RTSL_ZEBRA_INCIDENT_ACTION_PLAN_PROGRAM_STAGE_ID,
                fields: this.fields,
            })
        ).map(events => {
            if (!events.instances[0]?.event) return undefined;

            const plan: IncidentActionPlanDataValues = mapDataElementsToIncidentActionPlan(
                events.instances[0].event,
                events.instances[0].dataValues
            );

            return plan;
        });
    }

    getIncidentResponseActions(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<IncidentResponseActionsDataValues>> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: diseaseOutbreakId,
                programStage: RTSL_ZEBRA_INCIDENT_RESPONSE_ACTION_PROGRAM_STAGE_ID,
                fields: this.fields,
            })
        ).map(events => {
            const responseActions: IncidentResponseActionsDataValues =
                mapDataElementsToIncidentResponseActions(
                    events.instances[0]?.event ?? diseaseOutbreakId,
                    events.instances[0]?.dataValues ?? []
                );

            return responseActions;
        });
    }

    saveIncidentAction(
        formData: ActionPlanFormData | ResponseActionFormData,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        const programStageId = this.getProgramStageByFormType(formData.type);

        return getProgramStage(this.api, programStageId).flatMap(incidentResponse => {
            const incidentDataElements = incidentResponse.objects[0]?.programStageDataElements;

            if (!incidentDataElements)
                return Future.error(
                    new Error(` ${formData.type} Program Stage metadata not found`)
                );

            //Get the enrollment Id for the disease outbreak
            return apiToFuture(
                this.api.tracker.enrollments.get({
                    fields: {
                        enrollment: true,
                    },
                    trackedEntity: diseaseOutbreakId,
                    enrolledBefore: new Date().toISOString(),
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                })
            ).flatMap(enrollmentResponse => {
                const enrollmentId = enrollmentResponse.instances[0]?.enrollment;
                if (!enrollmentId) {
                    return Future.error(new Error(`Enrollment not found for Disease Outbreak`));
                }

                const events: D2TrackerEvent = mapIncidentActionToDataElements(
                    formData,
                    programStageId,
                    diseaseOutbreakId,
                    enrollmentId,
                    incidentDataElements
                );

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { events: [events] }
                    )
                ).flatMap(saveResponse => {
                    if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                        return Future.error(
                            new Error(`Error saving Incident Action Plan Risk Assessment Grading`)
                        );
                    } else {
                        return Future.success(undefined);
                    }
                });
            });
        });
    }

    private getProgramStageByFormType(formType: string) {
        switch (formType) {
            case "incident-action-plan":
                return RTSL_ZEBRA_INCIDENT_ACTION_PLAN_PROGRAM_STAGE_ID;
            case "incident-response-action":
                return RTSL_ZEBRA_INCIDENT_RESPONSE_ACTION_PROGRAM_STAGE_ID;
            default:
                throw new Error("Incident Action Form type not supported");
        }
    }
}
