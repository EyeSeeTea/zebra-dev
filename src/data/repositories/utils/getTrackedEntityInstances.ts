import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Id } from "../../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../../api-futures";
import {
    DiseaseOutbreakEvent,
    HazardType,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { getPopulatedEntity, getValueFromMap } from "./getPopulatedEntity";

export function getTrackedEntityAttributes(
    api: D2Api,
    programId: Id,
    orgUnitId: Id,
    trackedEntityId: Id
): FutureData<DiseaseOutbreakEvent> {
    return apiToFuture(
        api.tracker.trackedEntities.get({
            program: programId,
            orgUnit: orgUnitId,
            trackedEntity: trackedEntityId,
            fields: { attributes: true, trackedEntity: true },
        })
    ).map(trackedEntity => {
        if (!trackedEntity.instances[0]) throw new Error("Tracked entity not found");
        return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity.instances[0]);
    });
}

function mapTrackedEntityAttributesToDiseaseOutbreak(
    trackedEntity: D2TrackerTrackedEntity
): DiseaseOutbreakEvent {
    if (!trackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    // const diseaseOutbreak: DiseaseOutbreakEvent = new DiseaseOutbreakEvent({
    //     // Hardcoded values for DiseaseOutbreakEvent properties
    //     id: trackedEntity.trackedEntity,
    //     name: getValueFromMap("name", trackedEntity) || "",
    //     created: new Date(getValueFromMap("created", trackedEntity) || ""),
    //     lastUpdated: new Date(getValueFromMap("lastUpdated", trackedEntity) || ""),
    //     createdBy: undefined,
    //     hazardType: getValueFromMap("hazardType", trackedEntity) as HazardType,
    //     mainSyndrome: {
    //         id: getValueFromMap("mainSyndrome", trackedEntity) || "",
    //         code: "",
    //         name: "",
    //     }, //TO DO : Option set not yet created
    //     suspectedDisease: {
    //         id: getValueFromMap("suspectedDisease", trackedEntity) || "",
    //         code: "",
    //         name: "",
    //     }, //TO DO : Option set not yet created
    //     notificationSource: {
    //         id: getValueFromMap("notificationSource", trackedEntity) || "",
    //         code: "",
    //         name: "",
    //     }, //TO DO : Option set not yet created
    //     areasAffectedProvinces: [
    //         {
    //             id: getValueFromMap("areasAffectedProvinces", trackedEntity) || "",
    //             code: "",
    //             name: "",
    //         },
    //     ],
    //     areasAffectedDistricts: [
    //         {
    //             id: getValueFromMap("areasAffectedDistricts", trackedEntity) || "",
    //             code: "",
    //             name: "",
    //         },
    //     ],
    //     incidentStatus: getValueFromMap("incidentStatus", trackedEntity) as IncidentStatusType,
    //     emerged: {
    //         date: new Date(getValueFromMap("emerged.date", trackedEntity) || ""),
    //         narrative: getValueFromMap("emerged.narrative", trackedEntity) || "",
    //     },
    //     detected: {
    //         date: new Date(getValueFromMap("detected.date", trackedEntity) || ""),
    //         narrative: getValueFromMap("detected.narrative", trackedEntity) || "",
    //     },
    //     notified: {
    //         date: new Date(getValueFromMap("notified.date", trackedEntity) || ""),
    //         narrative: getValueFromMap("notified.narrative", trackedEntity) || "",
    //     },
    //     incidentManager: new TeamMember({
    //         id: getValueFromMap("incidentManager", trackedEntity) || "",
    //         name: "",
    //         phone: undefined,
    //         email: undefined,
    //         status: undefined,
    //         role: undefined,
    //         photo: undefined,
    //     }),
    //     earlyResponseActions: {
    //         initiateInvestigation: new Date(
    //             getValueFromMap("earlyResponseActions.initiateInvestigation", trackedEntity) || ""
    //         ),
    //         conductEpidemiologicalAnalysis: new Date(
    //             getValueFromMap(
    //                 "earlyResponseActions.conductEpidemiologicalAnalysis",
    //                 trackedEntity
    //             ) || ""
    //         ),
    //         laboratoryConfirmation: {
    //             date: new Date(
    //                 getValueFromMap(
    //                     "earlyResponseActions.laboratoryConfirmation.date",
    //                     trackedEntity
    //                 ) || ""
    //             ),
    //             na:
    //                 getValueFromMap(
    //                     "earlyResponseActions.laboratoryConfirmation.na",
    //                     trackedEntity
    //                 ) === "true"
    //                     ? true
    //                     : false || false,
    //         },
    //         appropriateCaseManagement: {
    //             date: new Date(
    //                 getValueFromMap(
    //                     "earlyResponseActions.appropriateCaseManagement.date",
    //                     trackedEntity
    //                 ) || ""
    //             ),
    //             na:
    //                 getValueFromMap(
    //                     "earlyResponseActions.appropriateCaseManagement.na",
    //                     trackedEntity
    //                 ) === "true"
    //                     ? true
    //                     : false || false,
    //         },
    //         initiatePublicHealthCounterMeasures: {
    //             date: new Date(
    //                 getValueFromMap(
    //                     "earlyResponseActions.initiatePublicHealthCounterMeasures.date",
    //                     trackedEntity
    //                 ) || ""
    //             ),
    //             na:
    //                 getValueFromMap(
    //                     "earlyResponseActions.initiatePublicHealthCounterMeasures.na",
    //                     trackedEntity
    //                 ) === "true"
    //                     ? true
    //                     : false || false,
    //         },
    //         initiateRiskCommunication: {
    //             date: new Date(
    //                 getValueFromMap(
    //                     "earlyResponseActions.initiateRiskCommunication.date",
    //                     trackedEntity
    //                 ) || ""
    //             ),
    //             na:
    //                 getValueFromMap(
    //                     "earlyResponseActions.initiateRiskCommunication.na",
    //                     trackedEntity
    //                 ) === "true"
    //                     ? true
    //                     : false || false,
    //         },
    //         establishCoordination: new Date(
    //             getValueFromMap("earlyResponseActions.establishCoordination", trackedEntity) || ""
    //         ),
    //         responseNarrative:
    //             getValueFromMap("earlyResponseActions.responseNarrative", trackedEntity) || "",
    //     },
    //     notes: getValueFromMap("notes", trackedEntity) || "",
    //     riskAssessments: undefined,
    //     incidentActionPlan: undefined,
    //     incidentManagementTeam: undefined,
    // });

    const diseaseOutbreak: DiseaseOutbreakEvent = getPopulatedEntity(trackedEntity);
    return diseaseOutbreak;
}
