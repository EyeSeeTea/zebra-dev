import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { diseaseOutbreakCodes } from "../consts/DiseaseOutbreakConstants";
import {
    DataSource,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { AlertOptions } from "../../../domain/repositories/AlertRepository";
import { Maybe } from "../../../utils/ts-utils";
import { Option } from "../../../domain/entities/Ref";

export function mapTrackedEntityAttributesToAlertOutbreak(
    nationalTrackedEntity: D2TrackerTrackedEntity,
    alertTrackedEntity: D2TrackerTrackedEntity
): AlertOptions {
    if (!nationalTrackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: AlertOptions = {
        eventId: nationalTrackedEntity.trackedEntity,
        dataSource: getValueFromMap("dataSource", nationalTrackedEntity) as DataSource,
        hazardTypeCode: getValueFromMap("hazardType", alertTrackedEntity),
        suspectedDiseaseCode: getValueFromMap("suspectedDisease", alertTrackedEntity),
        incidentStatus: getValueFromMap(
            "incidentStatus",
            nationalTrackedEntity
        ) as IncidentStatusType,
    };

    return diseaseOutbreak;
}

export function getValueFromMap(
    key: keyof typeof alertOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return (
        trackedEntity.attributes?.find(attribute => attribute.code === alertOutbreakCodes[key])
            ?.value ?? ""
    );
}

export function getOutbreakKey(
    dataSource: DataSource,
    outbreak: Maybe<string>,
    hazardTypes: Option[],
    suspectedDiseases: Option[]
): Maybe<string> {
    switch (dataSource) {
        case "EBS":
            return hazardTypes.find(hazardType => hazardType.id === outbreak)?.name;
        case "IBS":
            return suspectedDiseases.find(disease => disease.id === outbreak)?.name;
    }
}

const alertOutbreakCodes = {
    ...diseaseOutbreakCodes,
    hazardType: "RTSL_ZEB_TEA_EVENT_TYPE",
    suspectedDisease: "RTSL_ZEB_TEA_DISEASE",
    verificationStatus: "RTSL_ZEB_TEA_VERIFICATION_STATUS",
    incidentManager: "RTSL_ZEB_TEA_ ALERT_IM_NAME",
} as const;
