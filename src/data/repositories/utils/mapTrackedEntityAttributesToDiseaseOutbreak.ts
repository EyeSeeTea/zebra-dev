import {
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { DiseaseOutbreakCodes } from "../consts/DiseaseOutbreakConstants";
import _c from "../../../domain/entities/generic/Collection";

export function mapTrackedEntityAttributesToDiseaseOutbreak(
    trackedEntity: D2TrackerTrackedEntity
): DiseaseOutbreakEventBaseAttrs {
    if (!trackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: DiseaseOutbreakEventBaseAttrs = {
        id: trackedEntity.trackedEntity,
        name: getValueFromMap("name", trackedEntity),
        created: trackedEntity.createdAt ? new Date(trackedEntity.createdAt) : new Date(),
        lastUpdated: trackedEntity.updatedAt ? new Date(trackedEntity.updatedAt) : new Date(),
        createdByName: undefined,
        hazardType: getValueFromMap("hazardType", trackedEntity) as HazardType,
        mainSyndromeId: getValueFromMap("mainSyndrome", trackedEntity),
        suspectedDiseaseId: getValueFromMap("suspectedDisease", trackedEntity),

        notificationSourceId: getValueFromMap("notificationSource", trackedEntity),

        areasAffectedProvinceIds: [getValueFromMap("areasAffectedProvinces", trackedEntity)].filter(
            ou => ou !== ""
        ), //TO DO : handle multiple provinces when metadata change is done
        areasAffectedDistrictIds: [getValueFromMap("areasAffectedDistricts", trackedEntity)].filter(
            ou => ou !== ""
        ), //TO DO : handle multiple provinces when metadata change is done
        incidentStatus: getValueFromMap("incidentStatus", trackedEntity) as IncidentStatusType,
        emerged: {
            date: new Date(getValueFromMap("emergedDate", trackedEntity)),
            narrative: getValueFromMap("emergedNarrative", trackedEntity),
        },
        detected: {
            date: new Date(getValueFromMap("detectedDate", trackedEntity)),
            narrative: getValueFromMap("detectedNarrative", trackedEntity),
        },
        notified: {
            date: new Date(getValueFromMap("notifiedDate", trackedEntity)),
            narrative: getValueFromMap("notifiedNarrative", trackedEntity),
        },
        incidentManagerName: getValueFromMap("incidentManager", trackedEntity),

        earlyResponseActions: {
            initiateInvestigation: new Date(
                getValueFromMap("initiateInvestigation", trackedEntity)
            ),
            conductEpidemiologicalAnalysis: new Date(
                getValueFromMap("conductEpidemiologicalAnalysis", trackedEntity)
            ),
            laboratoryConfirmation: {
                date: new Date(getValueFromMap("laboratoryConfirmationDate", trackedEntity)),
                na: getValueFromMap("laboratoryConfirmationNA", trackedEntity) === "true",
            },
            appropriateCaseManagement: {
                date: new Date(getValueFromMap("appropriateCaseManagementDate", trackedEntity)),
                na: getValueFromMap("appropriateCaseManagementNA", trackedEntity) === "true",
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(getValueFromMap("initiateRiskCommunicationDate", trackedEntity)),
                na: getValueFromMap("initiateRiskCommunicationNA", trackedEntity) === "true",
            },
            initiateRiskCommunication: {
                date: new Date(getValueFromMap("initiateRiskCommunicationDate", trackedEntity)),
                na: getValueFromMap("initiateRiskCommunicationNA", trackedEntity) === "true",
            },
            establishCoordination: new Date(
                getValueFromMap("establishCoordination", trackedEntity)
            ),
            responseNarrative: getValueFromMap("responseNarrative", trackedEntity),
        },
        notes: getValueFromMap("notes", trackedEntity),
    };

    return diseaseOutbreak;
}

function getValueFromMap(
    key: keyof typeof DiseaseOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === DiseaseOutbreakCodes[key])?.value ?? "";
}
