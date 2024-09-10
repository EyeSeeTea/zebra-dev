import { SelectedPick } from "@eyeseetea/d2-api/api";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { D2DataElementSchema } from "@eyeseetea/d2-api/2.36";
import { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID,
} from "../consts/DiseaseOutbreakConstants";

import { Id } from "../../../domain/entities/Ref";
import {
    getValueFromRiskAssessmentGrading,
    getValueFromRiskAssessmentSummary,
    isStringInRiskAssessmentGradingCodes,
    isStringInRiskAssessmentSummaryCodes,
    RiskAssessmentGradingCodes,
    RiskAssessmentGradingKeyCode,
    RiskAssessmentSummaryCodes,
    RiskAssessmentSummaryKeyCode,
} from "../consts/RiskAssessmentGradingConstants";
import {
    riskAssessmentGradingIds,
    RiskAssessmentSummaryDataValues,
    riskAssessmentSummaryIds,
} from "../RiskAssessmentD2Repository";
import { Maybe } from "../../../utils/ts-utils";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import _c from "../../../domain/entities/generic/Collection";

type D2ProgramStageDataElementsMetadata = {
    dataElement: SelectedPick<
        D2DataElementSchema,
        {
            id: true;
            valueType: true;
            code: true;
        }
    >;
};

export function mapRiskAssessmentGradingToDataElements(
    teiId: Id,
    enrollmentId: Id,
    riskAssessmentGrading: RiskAssessmentGrading,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent {
    const dataElementValues: Record<RiskAssessmentGradingCodes, string> =
        getValueFromRiskAssessmentGrading(riskAssessmentGrading);

    const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
        if (!isStringInRiskAssessmentGradingCodes(programStage.dataElement.code)) {
            throw new Error("DataElement code not found in RiskAssessmentGradingCodes");
        }
        const typedCode: RiskAssessmentGradingKeyCode = programStage.dataElement.code;
        const populatedDataElement = {
            dataElement: programStage.dataElement.id,
            value: dataElementValues[typedCode] ?? "",
            lastUpdated: new Date().toISOString(),
            storedBy: "",
            created: new Date().toISOString(),
            providedElsewhere: false,
        };
        return populatedDataElement;
    });

    const d2RiskAssessmentGrading: D2TrackerEvent = {
        event: "",
        status: "ACTIVE",
        program: RTSL_ZEBRA_PROGRAM_ID,
        programStage: RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
        enrollment: enrollmentId,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        occurredAt: new Date().toISOString(),
        dataValues: dataValues,
        trackedEntity: teiId,
    };
    return d2RiskAssessmentGrading;
}

export function mapDataElementsToRiskAssessmentGrading(
    dataValues: DataValue[]
): RiskAssessmentGrading {
    const populationValue = getValueById(dataValues, riskAssessmentGradingIds.populationAtRisk);
    const attackRateValue = getValueById(dataValues, riskAssessmentGradingIds.attackRate);
    const geographicalSpreadValue = getValueById(
        dataValues,
        riskAssessmentGradingIds.geographicalSpread
    );
    const complexityValue = getValueById(dataValues, riskAssessmentGradingIds.complexity);
    const capacityValue = getValueById(dataValues, riskAssessmentGradingIds.capacity);
    const capabilityValue = getValueById(dataValues, riskAssessmentGradingIds.capability);
    const reputationalRiskValue = getValueById(
        dataValues,
        riskAssessmentGradingIds.reputationalRisk
    );
    const severityValue = getValueById(dataValues, riskAssessmentGradingIds.severity);

    const riskAssessmentGrading: RiskAssessmentGrading = RiskAssessmentGrading.create({
        id: "",
        lastUpdated: new Date(),
        populationAtRisk: RiskAssessmentGrading.getOptionTypeByCodePopulation(populationValue),
        attackRate: RiskAssessmentGrading.getOptionTypeByCodeWeighted(attackRateValue),
        geographicalSpread:
            RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(geographicalSpreadValue),
        complexity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(complexityValue),
        capacity: RiskAssessmentGrading.getOptionTypeByCodeCapacity(capacityValue),
        capability: RiskAssessmentGrading.getOptionTypeByCodeCapability(capabilityValue),
        reputationalRisk: RiskAssessmentGrading.getOptionTypeByCodeWeighted(reputationalRiskValue),
        severity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(severityValue),
    });
    return riskAssessmentGrading;
}

export function mapRiskAssessmentSummaryToDataElements(
    teiId: Id,
    enrollmentId: Id,
    riskAssessmentSummary: RiskAssessmentSummary,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent {
    const dataElementValues: Record<RiskAssessmentSummaryCodes, string> =
        getValueFromRiskAssessmentSummary(riskAssessmentSummary);

    const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
        if (!isStringInRiskAssessmentSummaryCodes(programStage.dataElement.code)) {
            throw new Error(
                `DataElement code ${programStage.dataElement.code}  not found in RiskAssessmentGradingCodes`
            );
        }
        const typedCode: RiskAssessmentSummaryKeyCode = programStage.dataElement.code;
        const populatedDataElement = {
            dataElement: programStage.dataElement.id,
            value: dataElementValues[typedCode] ?? "",
            lastUpdated: new Date().toISOString(),
            storedBy: "",
            created: new Date().toISOString(),
            providedElsewhere: false,
        };
        return populatedDataElement;
    });

    const d2RiskAssessmentGrading: D2TrackerEvent = {
        event: riskAssessmentSummary.id ?? "",
        status: "ACTIVE",
        program: RTSL_ZEBRA_PROGRAM_ID,
        programStage: RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID,
        enrollment: enrollmentId,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        occurredAt: new Date().toISOString(),
        dataValues: dataValues,
        trackedEntity: teiId,
    };
    return d2RiskAssessmentGrading;
}

export function mapDataElementsToRiskAssessmentSummary(
    id: Id,
    dataValues: DataValue[]
): RiskAssessmentSummaryDataValues {
    const riskAssessmentDate = getValueById(
        dataValues,
        riskAssessmentSummaryIds.riskAssessmentDate
    );
    const qualitativeRiskAssessment = getValueById(
        dataValues,
        riskAssessmentSummaryIds.qualitativeRiskAssessment
    );
    const riskAssessor1Value = getValueById(dataValues, riskAssessmentSummaryIds.riskAssessor1);
    const riskAssessor2Value = getValueById(dataValues, riskAssessmentSummaryIds.riskAssessor2);
    const riskAssessor3Value = getValueById(dataValues, riskAssessmentSummaryIds.riskAssessor3);
    const riskAssessor4Value = getValueById(dataValues, riskAssessmentSummaryIds.riskAssessor4);
    const riskAssessor5Value = getValueById(dataValues, riskAssessmentSummaryIds.riskAssessor5);

    const overallRiskNational = getValueById(
        dataValues,
        riskAssessmentSummaryIds.overallRiskNational
    );
    const overallRiskRegional = getValueById(
        dataValues,
        riskAssessmentSummaryIds.overallRiskRegional
    );
    const overallRiskGlobal = getValueById(dataValues, riskAssessmentSummaryIds.overallRiskGlobal);
    const overallConfidenceNational = getValueById(
        dataValues,
        riskAssessmentSummaryIds.overallConfidenceNational
    );
    const overallConfidenceRegional = getValueById(
        dataValues,
        riskAssessmentSummaryIds.overallConfidenceRegional
    );
    const overallConfidenceGlobal = getValueById(
        dataValues,
        riskAssessmentSummaryIds.overallConfidenceGlobal
    );
    const addAnotherRiskAssessor1 = getValueById(
        dataValues,
        riskAssessmentSummaryIds.addAnotherRiskAssessor1
    );
    const addAnotherRiskAssessor2 = getValueById(
        dataValues,
        riskAssessmentSummaryIds.addAnotherRiskAssessor2
    );
    const addAnotherRiskAssessor3 = getValueById(
        dataValues,
        riskAssessmentSummaryIds.addAnotherRiskAssessor3
    );
    const addAnotherRiskAssessor4 = getValueById(
        dataValues,
        riskAssessmentSummaryIds.addAnotherRiskAssessor4
    );

    const summary: RiskAssessmentSummaryDataValues = {
        id: id,
        riskAssessmentDate: riskAssessmentDate ?? "",
        qualitativeRiskAssessment: qualitativeRiskAssessment ?? "",
        riskAssessor1: riskAssessor1Value,
        riskAssessor2: riskAssessor2Value,
        riskAssessor3: riskAssessor3Value,
        riskAssessor4: riskAssessor4Value,
        riskAssessor5: riskAssessor5Value,
        overallRiskNational: overallRiskNational ?? "",
        overallRiskRegional: overallRiskRegional ?? "",
        overallRiskGlobal: overallRiskGlobal ?? "",
        overallConfidenceNational: overallConfidenceNational ?? "",
        overallConfidenceRegional: overallConfidenceRegional ?? "",
        overallConfidenceGlobal: overallConfidenceGlobal ?? "",
        addAnotherRiskAssessor1: addAnotherRiskAssessor1,
        addAnotherRiskAssessor2: addAnotherRiskAssessor2,
        addAnotherRiskAssessor3: addAnotherRiskAssessor3,
        addAnotherRiskAssessor4: addAnotherRiskAssessor4,
    };

    return summary;
}
function getValueById(dataValues: DataValue[], dataElement: string): Maybe<string> {
    return dataValues.find(dataValue => dataValue.dataElement === dataElement)?.value;
}
