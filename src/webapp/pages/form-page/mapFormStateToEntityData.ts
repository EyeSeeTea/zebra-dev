import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    NationalIncidentStatus,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { FormState } from "../../components/form/FormState";
import { diseaseOutbreakEventFieldIds } from "./disease-outbreak-event/mapDiseaseOutbreakEventToInitialFormState";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getBooleanFieldValue,
    getDateFieldValue,
    getMultipleOptionsFieldValue,
    getStringFieldValue,
} from "../../components/form/FormFieldsState";
import {
    ConfigurableForm,
    DiseaseOutbreakEventFormData,
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentSummaryFormData,
} from "../../../domain/entities/ConfigurableForm";
import { Maybe } from "../../../utils/ts-utils";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import {
    riskAssessmentGradingCodes,
    riskAssessmentQuestionnaireCodes,
    riskAssessmentSummaryCodes,
} from "../../../data/repositories/consts/RiskAssessmentConstants";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import _c from "../../../domain/entities/generic/Collection";
import {
    RiskAssessmentQuestion,
    RiskAssessmentQuestionnaire,
} from "../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    formData: ConfigurableForm
): ConfigurableForm {
    switch (formData.type) {
        case "disease-outbreak-event": {
            const dieaseEntity = mapFormStateToDiseaseOutbreakEvent(
                formState,
                currentUserName,
                formData.entity
            );
            const diseaseForm: DiseaseOutbreakEventFormData = {
                ...formData,
                entity: dieaseEntity,
            };
            return diseaseForm;
        }

        case "risk-assessment-grading": {
            const riskEntity = mapFormStateToRiskAssessmentGrading(formState);
            const riskForm: RiskAssessmentGradingFormData = {
                ...formData,
                entity: riskEntity,
            };
            return riskForm;
        }
        case "risk-assessment-summary": {
            const riskSummary = mapFormStateToRiskAssessmentSummary(formState, formData);
            const riskSummaryForm: RiskAssessmentSummaryFormData = {
                ...formData,
                entity: riskSummary,
            };
            return riskSummaryForm;
        }
        case "risk-assessment-questionnaire": {
            const riskQuestionnaire = mapFormStateToRiskAssessmentQuestionnaire(
                formState,
                formData
            );
            const riskQuestionnaireForm: RiskAssessmentQuestionnaireFormData = {
                ...formData,
                entity: riskQuestionnaire,
            };
            return riskQuestionnaireForm;
        }

        default:
            return formData;
    }
}

function mapFormStateToDiseaseOutbreakEvent(
    formState: FormState,
    currentUserName: string,
    diseaseOutbreakEvent: Maybe<DiseaseOutbreakEventBaseAttrs>
): DiseaseOutbreakEventBaseAttrs {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const diseaseOutbreakEventEditableData = {
        name: getStringFieldValue(diseaseOutbreakEventFieldIds.name, allFields),
        dataSource: getStringFieldValue(
            diseaseOutbreakEventFieldIds.dataSource,
            allFields
        ) as DataSource,
        hazardType: getStringFieldValue(
            diseaseOutbreakEventFieldIds.hazardType,
            allFields
        ) as HazardType,
        mainSyndromeCode: getStringFieldValue(
            diseaseOutbreakEventFieldIds.mainSyndromeCode,
            allFields
        ),
        suspectedDiseaseCode: getStringFieldValue(
            diseaseOutbreakEventFieldIds.suspectedDiseaseCode,
            allFields
        ),
        notificationSourceCode: getStringFieldValue(
            diseaseOutbreakEventFieldIds.notificationSourceCode,
            allFields
        ),
        areasAffectedProvinceIds: getMultipleOptionsFieldValue(
            diseaseOutbreakEventFieldIds.areasAffectedProvinceIds,
            allFields
        ),
        areasAffectedDistrictIds: getMultipleOptionsFieldValue(
            diseaseOutbreakEventFieldIds.areasAffectedDistrictIds,
            allFields
        ),
        incidentStatus: getStringFieldValue(
            diseaseOutbreakEventFieldIds.incidentStatus,
            allFields
        ) as NationalIncidentStatus,
        emerged: {
            date: getDateFieldValue(diseaseOutbreakEventFieldIds.emergedDate, allFields) as Date,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.emergedNarrative,
                allFields
            ),
        },
        detected: {
            date: getDateFieldValue(diseaseOutbreakEventFieldIds.detectedDate, allFields) as Date,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.detectedNarrative,
                allFields
            ),
        },
        notified: {
            date: getDateFieldValue(diseaseOutbreakEventFieldIds.notifiedDate, allFields) as Date,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.notifiedNarrative,
                allFields
            ),
        },
        earlyResponseActions: {
            initiateInvestigation: getDateFieldValue(
                diseaseOutbreakEventFieldIds.initiateInvestigation,
                allFields
            ) as Date,
            conductEpidemiologicalAnalysis: getDateFieldValue(
                diseaseOutbreakEventFieldIds.conductEpidemiologicalAnalysis,
                allFields
            ) as Date,
            laboratoryConfirmation: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.laboratoryConfirmationDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.laboratoryConfirmationNA,
                    allFields
                ),
            },
            appropriateCaseManagement: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.appropriateCaseManagementDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.appropriateCaseManagementNA,
                    allFields
                ),
            },
            initiatePublicHealthCounterMeasures: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.initiatePublicHealthCounterMeasuresDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.initiatePublicHealthCounterMeasuresNA,
                    allFields
                ),
            },
            initiateRiskCommunication: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.initiateRiskCommunicationDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.initiateRiskCommunicationNA,
                    allFields
                ),
            },
            establishCoordination: getDateFieldValue(
                diseaseOutbreakEventFieldIds.establishCoordination,
                allFields
            ) as Date,
            responseNarrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.responseNarrative,
                allFields
            ),
        },
        incidentManagerName: getStringFieldValue(
            diseaseOutbreakEventFieldIds.incidentManagerName,
            allFields
        ),
        notes: getStringFieldValue(diseaseOutbreakEventFieldIds.notes, allFields),
    };

    const diseaseOutbreakEventBase: DiseaseOutbreakEventBaseAttrs = {
        id: diseaseOutbreakEvent?.id || "",
        status: diseaseOutbreakEvent?.status || "ACTIVE",
        created: diseaseOutbreakEvent?.created || new Date(),
        lastUpdated: diseaseOutbreakEvent?.lastUpdated || new Date(),
        createdByName: diseaseOutbreakEvent?.createdByName || currentUserName,
        ...diseaseOutbreakEventEditableData,
    };

    return diseaseOutbreakEventBase;
}

function mapFormStateToRiskAssessmentGrading(formState: FormState): RiskAssessmentGrading {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const populationValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.populationAtRisk)
    )?.value as string;
    const attackRateValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.attackRate)
    )?.value as string;
    const geographicalSpreadValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.geographicalSpread)
    )?.value as string;
    const complexityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.complexity)
    )?.value as string;
    const capacityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capacity)
    )?.value as string;
    const capabilityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capability)
    )?.value as string;
    const reputationalRiskValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.reputationalRisk)
    )?.value as string;
    const severityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.severity)
    )?.value as string;

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

function mapFormStateToRiskAssessmentSummary(
    formState: FormState,
    formData: RiskAssessmentSummaryFormData
): RiskAssessmentSummary {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const riskAssessmentDate = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessmentDate)
    )?.value as Date;

    const riskAssessor1Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor1)
    )?.value as string;
    const riskAssessor2Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor2)
    )?.value as string;
    const riskAssessor3Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor3)
    )?.value as string;
    const riskAssessor4Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor4)
    )?.value as string;
    const riskAssessor5Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor5)
    )?.value as string;
    const riskAssessor1 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor1Value
    );
    const riskAssessor2 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor2Value
    );
    const riskAssessor3 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor3Value
    );
    const riskAssessor4 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor4Value
    );
    const riskAssessor5 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor5Value
    );

    const qualitativeRiskAssessment = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.qualitativeRiskAssessment)
    )?.value as string;

    const overallRiskNationalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallRiskNational)
    )?.value as string;
    const overallRiskNational = formData.options.overallRiskNational.find(
        option => option.id === overallRiskNationalValue
    );
    if (!overallRiskNational) throw new Error("Overall risk national not found");

    const overallRiskRegionalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallRiskRegional)
    )?.value as string;
    const overallRiskRegional = formData.options.overallRiskRegional.find(
        option => option.id === overallRiskRegionalValue
    );
    if (!overallRiskRegional) throw new Error("Overall risk regional not found");

    const overallRiskGlobalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallRiskGlobal)
    )?.value as string;
    const overallRiskGlobal = formData.options.overallRiskGlobal.find(
        option => option.id === overallRiskGlobalValue
    );
    if (!overallRiskGlobal) throw new Error("Overall risk global not found");

    const overallConfidenceNationalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallConfidenceNational)
    )?.value as string;
    const overallConfidenceNational = formData.options.overAllConfidencNational.find(
        option => option.id === overallConfidenceNationalValue
    );
    if (!overallConfidenceNational) throw new Error("Overall confidence national not found");

    const overallConfidenceRegionalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallConfidenceRegional)
    )?.value as string;
    const overallConfidenceRegional = formData.options.overAllConfidencRegional.find(
        option => option.id === overallConfidenceRegionalValue
    );
    if (!overallConfidenceRegional) throw new Error("Overall confidence regional not found");

    const overallConfidenceGlobalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallConfidenceGlobal)
    )?.value as string;
    const overallConfidenceGlobal = formData.options.overAllConfidencGlobal.find(
        option => option.id === overallConfidenceGlobalValue
    );
    if (!overallConfidenceGlobal) throw new Error("Overall confidence global not found");

    const riskAssessmentSummary: RiskAssessmentSummary = new RiskAssessmentSummary({
        id: formData.entity?.id ?? "",
        riskAssessmentDate: riskAssessmentDate,
        riskAssessors: _c([
            riskAssessor1,
            riskAssessor2,
            riskAssessor3,
            riskAssessor4,
            riskAssessor5,
        ])
            .compact()
            .value(),
        qualitativeRiskAssessment: qualitativeRiskAssessment,
        overallRiskNational: overallRiskNational,
        overallRiskRegional: overallRiskRegional,
        overallRiskGlobal: overallRiskGlobal,
        overallConfidenceNational: overallConfidenceNational,
        overallConfidenceRegional: overallConfidenceRegional,
        overallConfidenceGlobal: overallConfidenceGlobal,
        riskId: "",
    });
    return riskAssessmentSummary;
}

function mapFormStateToRiskAssessmentQuestionnaire(
    formState: FormState,
    formData: RiskAssessmentQuestionnaireFormData
): RiskAssessmentQuestionnaire {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const indexes = ["1", "2", "3"] as const;
    const questions = indexes.map(index => {
        const likelihood = allFields.find(field =>
            field.id.includes(riskAssessmentQuestionnaireCodes[`likelihood${index}`])
        )?.value as string;
        const likelihoodOption = formData.options.likelihood.find(
            option => option.id === likelihood
        );
        if (!likelihoodOption) throw new Error("Likelihood not found");

        const consequences = allFields.find(field =>
            field.id.includes(riskAssessmentQuestionnaireCodes[`consequences${index}`])
        )?.value as string;
        const consequencesOption = formData.options.consequences.find(
            option => option.id === consequences
        );
        if (!consequencesOption) throw new Error("Consequences not found");

        const risk = allFields.find(field =>
            field.id.includes(riskAssessmentQuestionnaireCodes[`risk${index}`])
        )?.value as string;
        const riskOption = formData.options.risk.find(option => option.id === risk);
        if (!riskOption) throw new Error("Risk  not found");

        const question: RiskAssessmentQuestion = {
            likelihood: likelihoodOption,
            consequences: consequencesOption,
            risk: riskOption,
            rational: allFields.find(field =>
                field.id.includes(riskAssessmentQuestionnaireCodes[`rational${index}`])
            )?.value as string,
        };
        return question;
    });

    if (!questions[0] || !questions[1] || !questions[2]) throw new Error("Questions not found");

    const riskAssessmentQuestionnaire: RiskAssessmentQuestionnaire =
        new RiskAssessmentQuestionnaire({
            id: formData.entity?.id ?? "",
            potentialRiskForHumanHealth: questions[0],
            riskOfEventSpreading: questions[1],
            riskOfInsufficientCapacities: questions[2],
            additionalQuestions: [],
        });
    return riskAssessmentQuestionnaire;
}
