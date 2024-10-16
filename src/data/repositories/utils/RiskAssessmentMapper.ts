import { SelectedPick } from "@eyeseetea/d2-api/api";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { D2DataElementSchema } from "@eyeseetea/d2-api/2.36";
import { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_PROGRAM_STAGE_ID,
} from "../consts/DiseaseOutbreakConstants";
import { Code, Id } from "../../../domain/entities/Ref";
import {
    getValueFromRiskAssessmentGrading,
    getValueFromRiskAssessmentStdQuestionnaire,
    getValueFromRiskAssessmentSummary,
    isStringInRiskAssessmentGradingCodes,
    isStringInRiskAssessmentStdQuestionnaireCodes,
    isStringInRiskAssessmentSummaryCodes,
    RiskAssessmentGradingCodes,
    RiskAssessmentGradingKeyCode,
    RiskAssessmentStdQuestionnaireCodes,
    RiskAssessmentStdQuestionnaireKeyCode,
    RiskAssessmentSummaryCodes,
    RiskAssessmentSummaryKeyCode,
    getValueFromRiskAssessmentCustomQuestionnaire,
    RiskAssessmentCustomQuestionnaireCodes,
    isStringInRiskAssessmentCustomQuestionnaireCodes,
    RiskAssessmentCustomQuestionnaireKeyCode,
} from "../consts/RiskAssessmentConstants";
import {
    riskAssessmentCustomQuestionnaireIds,
    riskAssessmentGradingIds,
    RiskAssessmentQuestionnaireBaseDataValues,
    riskAssessmentStdQuestionnaireIds,
    RiskAssessmentSummaryDataValues,
    riskAssessmentSummaryIds,
} from "../RiskAssessmentD2Repository";
import { Maybe } from "../../../utils/ts-utils";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import _c from "../../../domain/entities/generic/Collection";
import {
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentSummaryFormData,
} from "../../../domain/entities/ConfigurableForm";
import { RiskAssessmentQuestionnaire } from "../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";
import { getPopulatedDataElement, getValueById } from "./helpers";

export type D2ProgramStageDataElementsMetadata = {
    dataElement: SelectedPick<
        D2DataElementSchema,
        {
            id: true;
            valueType: true;
            code: true;
        }
    >;
};

export function mapRiskAssessmentToDataElements(
    formData:
        | RiskAssessmentGradingFormData
        | RiskAssessmentSummaryFormData
        | RiskAssessmentQuestionnaireFormData,
    programStageId: Id,
    teiId: Id,
    enrollmentId: Id,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent[] {
    if (!formData.entity) throw new Error("No form data found");
    switch (formData.type) {
        case "risk-assessment-grading":
            return [
                mapRiskAssessmentGradingToDataElements(
                    programStageId,
                    teiId,
                    enrollmentId,
                    formData.entity,
                    programStageDataElementsMetadata
                ),
            ];
        case "risk-assessment-summary":
            if (!formData.entity) throw new Error("No form data found");
            return [
                mapRiskAssessmentSummaryToDataElements(
                    programStageId,
                    teiId,
                    enrollmentId,
                    formData.entity,
                    programStageDataElementsMetadata
                ),
            ];
        case "risk-assessment-questionnaire":
            return mapRiskAssessmentQuestionnaireToDataElements(
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
function mapRiskAssessmentGradingToDataElements(
    programStageId: Id,
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
        return getPopulatedDataElement(programStage.dataElement.id, dataElementValues[typedCode]);
    });

    return getRiskAssessmentTrackerEvent(
        programStageId,
        riskAssessmentGrading.id,
        enrollmentId,
        dataValues,
        teiId
    );
}
function mapRiskAssessmentSummaryToDataElements(
    programStageId: Id,
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
                `DataElement code ${programStage.dataElement.code}  not found in Risk Assessment Summary Codes`
            );
        }
        const typedCode: RiskAssessmentSummaryKeyCode = programStage.dataElement.code;
        return getPopulatedDataElement(programStage.dataElement.id, dataElementValues[typedCode]);
    });

    return getRiskAssessmentTrackerEvent(
        programStageId,
        riskAssessmentSummary.id,
        enrollmentId,
        dataValues,
        teiId
    );
}

function mapRiskAssessmentQuestionnaireToDataElements(
    programStageId: Id,
    teiId: Id,
    enrollmentId: Id,
    riskAssessmentQuestionnaire: RiskAssessmentQuestionnaire,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent[] {
    if (programStageId === RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_PROGRAM_STAGE_ID) {
        const dataElementValues: Record<RiskAssessmentStdQuestionnaireCodes, string> =
            getValueFromRiskAssessmentStdQuestionnaire(riskAssessmentQuestionnaire);

        const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
            if (!isStringInRiskAssessmentStdQuestionnaireCodes(programStage.dataElement.code)) {
                throw new Error(
                    `DataElement code ${programStage.dataElement.code}  not found in Risk Assessment Questionnaire Codes`
                );
            }
            const typedCode: RiskAssessmentStdQuestionnaireKeyCode = programStage.dataElement.code;
            return getPopulatedDataElement(
                programStage.dataElement.id,
                dataElementValues[typedCode]
            );
        });
        return [
            getRiskAssessmentTrackerEvent(
                programStageId,
                riskAssessmentQuestionnaire.id,
                enrollmentId,
                dataValues,
                teiId
            ),
        ];
    } else {
        const customEvents = riskAssessmentQuestionnaire.additionalQuestions.map(customQuestion => {
            const dataElementValues: Record<RiskAssessmentCustomQuestionnaireCodes, string> =
                getValueFromRiskAssessmentCustomQuestionnaire(customQuestion);

            const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
                if (
                    !isStringInRiskAssessmentCustomQuestionnaireCodes(programStage.dataElement.code)
                ) {
                    throw new Error(
                        `DataElement code ${programStage.dataElement.code}  not found in Custom Risk Assessment Questionnaire Codes`
                    );
                }
                const typedCode: RiskAssessmentCustomQuestionnaireKeyCode =
                    programStage.dataElement.code;
                return getPopulatedDataElement(
                    programStage.dataElement.id,
                    dataElementValues[typedCode]
                );
            });
            return getRiskAssessmentTrackerEvent(
                programStageId,
                customQuestion.id,
                enrollmentId,
                dataValues,
                teiId
            );
        });

        return customEvents;
    }
}

function getRiskAssessmentTrackerEvent(
    programStageId: Id,
    id: Maybe<Id>,
    enrollmentId: Id,
    dataValues: DataValue[],
    teiId: Id
): D2TrackerEvent {
    const d2RiskAssessment: D2TrackerEvent = {
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
    return d2RiskAssessment;
}

export function mapDataElementsToRiskAssessmentGrading(
    lastUpdated: string | undefined,
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
        lastUpdated: lastUpdated ? new Date(lastUpdated) : undefined,
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

export function mapDataElementsToStdRiskAssessmentQuestionnaire(
    id: Id,
    dataValues: DataValue[]
): RiskAssessmentQuestionnaireBaseDataValues {
    const summary: RiskAssessmentQuestionnaireBaseDataValues = {
        id: id,
        rationale1: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.rational1) ?? "",
        rationale2: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.rational2) ?? "",
        rationale3: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.rational3) ?? "",
        likelihood1: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.likelihood1) ?? "",
        likelihood2: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.likelihood2) ?? "",
        likelihood3: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.likelihood3) ?? "",
        consequence1:
            getValueById(dataValues, riskAssessmentStdQuestionnaireIds.consequences1) ?? "",
        consequence2:
            getValueById(dataValues, riskAssessmentStdQuestionnaireIds.consequences2) ?? "",
        consequence3:
            getValueById(dataValues, riskAssessmentStdQuestionnaireIds.consequences3) ?? "",
        risk1: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.risk1) ?? "",
        risk2: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.risk2) ?? "",
        risk3: getValueById(dataValues, riskAssessmentStdQuestionnaireIds.risk3) ?? "",
    };

    return summary;
}

export function mapDataElementsToCustomRiskAssessmentQuestionnaire(
    id: Id,
    dataValues: DataValue[]
): {
    id: Id;
    question: string;
    likelihood: Code;
    consequence: Code;
    risk: Code;
    rationale: Code;
} {
    const customQuestion = {
        id: id,
        question: getValueById(dataValues, riskAssessmentCustomQuestionnaireIds.question) ?? "",
        rationale: getValueById(dataValues, riskAssessmentCustomQuestionnaireIds.rational) ?? "",
        likelihood: getValueById(dataValues, riskAssessmentCustomQuestionnaireIds.likelihood) ?? "",
        consequence:
            getValueById(dataValues, riskAssessmentCustomQuestionnaireIds.consequences) ?? "",
        risk: getValueById(dataValues, riskAssessmentCustomQuestionnaireIds.risk) ?? "",
    };

    return customQuestion;
}
