import { Struct } from "../generic/Struct";
import { IncidentActionPlan } from "../incident-action-plan/IncidentActionPlan";
import { IncidentManagementTeam } from "../incident-management-team/IncidentManagementTeam";
import { TeamMember } from "../incident-management-team/TeamMember";
import { OrgUnit } from "../OrgUnit";
import { Id, NamedRef } from "../Ref";
import { RiskAssessment } from "../risk-assessment/RiskAssessment";
import { Maybe } from "../../../utils/ts-utils";
import { ValidationError, ValidationErrorKey } from "../ValidationError";

export type HazardType =
    | "Biological:Human"
    | "Biological:Animal"
    | "Chemical"
    | "Environmental"
    | "Unknown";

export type IncidentStatusType = "Watch" | "Alert" | "Respond" | "Closed" | "Discarded";

type DateWithNarrative = {
    date: Date;
    narrative: string;
};

type DateWithNA = {
    date: Date;
    na: Maybe<boolean>;
};

type EarlyResponseActions = {
    initiateInvestigation: Date;
    conductEpidemiologicalAnalysis: Date;
    laboratoryConfirmation: DateWithNA;
    appropriateCaseManagement: DateWithNA;
    initiatePublicHealthCounterMeasures: DateWithNA;
    initiateRiskCommunication: DateWithNA;
    establishCoordination: Date;
    responseNarrative: string;
};

export type DiseaseOutbreakEventBaseAttrs = NamedRef & {
    eventId: Maybe<number>;
    created: Date;
    lastUpdated: Date;
    createdByName: Maybe<string>;
    hazardType: HazardType;
    mainSyndromeId: Id;
    suspectedDiseaseId: Id;
    notificationSourceId: Id;
    areasAffectedProvinceIds: Id[];
    areasAffectedDistrictIds: Id[];
    incidentStatus: IncidentStatusType;
    emerged: DateWithNarrative;
    detected: DateWithNarrative;
    notified: DateWithNarrative;
    earlyResponseActions: EarlyResponseActions;
    incidentManagerName: string;
    notes: Maybe<string>;
};

export type DiseaseOutbreakEventAttrs = DiseaseOutbreakEventBaseAttrs & {
    createdBy: Maybe<TeamMember>;
    mainSyndrome: NamedRef;
    suspectedDisease: NamedRef;
    notificationSource: NamedRef;
    areasAffectedProvinces: OrgUnit[];
    areasAffectedDistricts: OrgUnit[];
    incidentManager: Maybe<TeamMember>; //TO DO : make mandatory once form rules applied.
    riskAssessments: Maybe<RiskAssessment[]>;
    incidentActionPlan: Maybe<IncidentActionPlan>;
    incidentManagementTeam: Maybe<IncidentManagementTeam>;
};

/**
 * Note: DiseaseOutbreakEvent represents Event in the Figma.
 * Not using event as it is a keyword and can also be confused with dhis event
 **/

export class DiseaseOutbreakEvent extends Struct<DiseaseOutbreakEventAttrs>() {
    //TODO: Add required validations, this is an example:
    static validate(data: DiseaseOutbreakEventBaseAttrs): ValidationError[] {
        const validationErrors: ValidationError[] = [
            {
                property: "detected_date" as const,
                errors: DiseaseOutbreakEvent.validateDateDetectedBeforeEmerged(data),
                value: data.id,
            },
            {
                property: "notified_date" as const,
                errors: DiseaseOutbreakEvent.validateDateNotifiedBeforeEmerged(data),
                value: data.id,
            },
        ];

        const filteredValidationErrorsWithErrors = validationErrors.filter(
            v => v.errors.length > 0
        );

        return filteredValidationErrorsWithErrors.length ? validationErrors : [];
    }

    static validateDateDetectedBeforeEmerged(
        data: DiseaseOutbreakEventBaseAttrs
    ): ValidationErrorKey[] {
        return data.detected.date &&
            data.emerged.date &&
            data.detected.date.getTime() < data.emerged.date.getTime()
            ? ["detected_before_emerged"]
            : [];
    }

    static validateDateNotifiedBeforeEmerged(
        data: DiseaseOutbreakEventBaseAttrs
    ): ValidationErrorKey[] {
        return data.notified.date &&
            data.emerged.date &&
            data.notified.date.getTime() < data.emerged.date.getTime()
            ? ["notified_before_emerged"]
            : [];
    }
}
