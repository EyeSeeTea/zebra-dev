import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { diseaseOutbreakCodes } from "../consts/DiseaseOutbreakConstants";
import {
    DataSource,
    IncidentStatusType,
    OutbreakType,
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

export function getOutbreakFromOptions(
    alert: { value: Maybe<string>; type: OutbreakType },
    suspectedDiseases: Option[],
    hazardTypes: Option[]
): Maybe<string> {
    const { type, value = "" } = alert;

    switch (type) {
        case "disease":
            return suspectedDiseases.find(disease => disease.id === value)?.name ?? alert.value;
        case "hazard":
            return hazardTypes.find(hazardType => hazardType.id === value)?.name ?? alert.value;
    }
}

const alertOutbreakCodes = {
    ...diseaseOutbreakCodes,
    hazardType: "RTSL_ZEB_TEA_EVENT_TYPE",
    suspectedDisease: "RTSL_ZEB_TEA_DISEASE",
    verificationStatus: "RTSL_ZEB_TEA_VERIFICATION_STATUS",
    incidentManager: "RTSL_ZEB_TEA_ ALERT_IM_NAME",
} as const;
