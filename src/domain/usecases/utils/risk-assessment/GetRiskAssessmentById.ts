import { FutureData } from "../../../../data/api-futures";
import { RiskAssessmentSummaryDataValues } from "../../../../data/repositories/RiskAssessmentD2Repository";
import { Maybe } from "../../../../utils/ts-utils";
import { AppConfigurations } from "../../../entities/AppConfigurations";
import _c from "../../../entities/generic/Collection";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { RiskAssessment } from "../../../entities/risk-assessment/RiskAssessment";
import {
    RiskAssessmentQuestion,
    RiskAssessmentQuestionnaire,
} from "../../../entities/risk-assessment/RiskAssessmentQuestionnaire";
import { RiskAssessmentSummary } from "../../../entities/risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentRepository } from "../../../repositories/RiskAssessmentRepository";

export function getAll(
    diseaseOutbreakId: Id,
    riskAssessmentRepository: RiskAssessmentRepository,
    appConfig: AppConfigurations
): FutureData<RiskAssessment> {
    return riskAssessmentRepository
        .getAllRiskAssessmentGrading(diseaseOutbreakId)
        .flatMap(gradings => {
            return riskAssessmentRepository
                .getRiskAssessmentSummary(diseaseOutbreakId)
                .flatMap(summaryDataValues => {
                    return riskAssessmentRepository
                        .getRiskAssessmentQuestionnaire(diseaseOutbreakId)
                        .flatMap(questionnaireDataValues => {
                            const {
                                riskAssessor1,
                                riskAssessor2,
                                riskAssessor3,
                                riskAssessor4,
                                riskAssessor5,
                                overallRiskGlobal,
                                overallRiskNational,
                                overallRiskRegional,
                                overallConfidenceGlobal,
                                overallConfidenceNational,
                                overallConfidenceRegional,
                            } = getRiskSummarySelections(appConfig, summaryDataValues);

                            const summary = new RiskAssessmentSummary({
                                id: summaryDataValues?.id ?? "",
                                riskAssessmentDate: summaryDataValues?.riskAssessmentDate
                                    ? new Date(summaryDataValues.riskAssessmentDate)
                                    : new Date(),
                                riskAssessors: _c([
                                    riskAssessor1,
                                    riskAssessor2,
                                    riskAssessor3,
                                    riskAssessor4,
                                    riskAssessor5,
                                ])
                                    .compact()
                                    .value(),
                                overallRiskNational,
                                overallRiskRegional,
                                overallRiskGlobal,
                                overallConfidenceNational,
                                overallConfidenceRegional,
                                overallConfidenceGlobal,
                                qualitativeRiskAssessment:
                                    summaryDataValues?.qualitativeRiskAssessment ?? "",
                                riskId: "",
                            });

                            const additionalQuestions = questionnaireDataValues?.customSummary.map(
                                customQuestionDataValues => {
                                    const customQuestion: RiskAssessmentQuestion = {
                                        id: customQuestionDataValues.id,
                                        question: customQuestionDataValues.question,
                                        likelihood:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.likelihood.find(
                                                likelihood =>
                                                    likelihood.id ===
                                                    customQuestionDataValues.likelihood
                                            ) ?? { id: "", name: "" },
                                        consequences:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.consequences.find(
                                                consequence =>
                                                    consequence.id ===
                                                    customQuestionDataValues.consequence
                                            ) ?? { id: "", name: "" },
                                        risk: appConfig.riskAssessmentQuestionnaireConfigurations.risk.find(
                                            risk => risk.id === customQuestionDataValues.risk
                                        ) ?? { id: "", name: "" },
                                        rational: customQuestionDataValues.rationale,
                                    };
                                    return Future.success(customQuestion);
                                }
                            );

                            const customQuestions = additionalQuestions
                                ? Future.sequential(additionalQuestions)
                                : Future.success([]);

                            return customQuestions.flatMap(customQuestions => {
                                const questionnaire = new RiskAssessmentQuestionnaire({
                                    id: questionnaireDataValues?.stdSummary?.id ?? "",
                                    potentialRiskForHumanHealth: {
                                        likelihood:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.likelihood.find(
                                                l =>
                                                    l.id ===
                                                    questionnaireDataValues?.stdSummary?.likelihood1
                                            ) ?? { id: "", name: "" },
                                        consequences:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.consequences.find(
                                                c =>
                                                    c.id ===
                                                    questionnaireDataValues?.stdSummary
                                                        ?.consequence1
                                            ) ?? { id: "", name: "" },
                                        risk: appConfig.riskAssessmentQuestionnaireConfigurations.risk.find(
                                            r => r.id === questionnaireDataValues?.stdSummary?.risk1
                                        ) ?? { id: "", name: "" },
                                        rational:
                                            questionnaireDataValues?.stdSummary?.rationale1 ?? "",
                                    },
                                    riskOfEventSpreading: {
                                        likelihood:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.likelihood.find(
                                                l =>
                                                    l.id ===
                                                    questionnaireDataValues?.stdSummary?.likelihood2
                                            ) ?? { id: "", name: "" },
                                        consequences:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.consequences.find(
                                                c =>
                                                    c.id ===
                                                    questionnaireDataValues?.stdSummary
                                                        ?.consequence2
                                            ) ?? { id: "", name: "" },
                                        risk: appConfig.riskAssessmentQuestionnaireConfigurations.risk.find(
                                            r => r.id === questionnaireDataValues?.stdSummary?.risk2
                                        ) ?? { id: "", name: "" },
                                        rational:
                                            questionnaireDataValues?.stdSummary?.rationale2 ?? "",
                                    },
                                    riskOfInsufficientCapacities: {
                                        likelihood:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.likelihood.find(
                                                l =>
                                                    l.id ===
                                                    questionnaireDataValues?.stdSummary?.likelihood3
                                            ) ?? { id: "", name: "" },
                                        consequences:
                                            appConfig.riskAssessmentQuestionnaireConfigurations.consequences.find(
                                                c =>
                                                    c.id ===
                                                    questionnaireDataValues?.stdSummary
                                                        ?.consequence3
                                            ) ?? { id: "", name: "" },
                                        risk: appConfig.riskAssessmentQuestionnaireConfigurations.risk.find(
                                            r => r.id === questionnaireDataValues?.stdSummary?.risk3
                                        ) ?? { id: "", name: "" },
                                        rational:
                                            questionnaireDataValues?.stdSummary?.rationale3 ?? "",
                                    },
                                    additionalQuestions: customQuestions,
                                });

                                const riskAssessment: RiskAssessment = new RiskAssessment({
                                    grading: gradings,
                                    summary: summaryDataValues ? summary : undefined,
                                    questionnaire: questionnaireDataValues
                                        ? questionnaire
                                        : undefined,
                                });
                                return Future.success(riskAssessment);
                            });
                        });
                });
        });
}
function getRiskSummarySelections(
    appConfig: AppConfigurations,
    summaryDataValues: Maybe<RiskAssessmentSummaryDataValues>
) {
    const riskAssessor1 = appConfig.riskAssessmentSummaryConfigurations.riskAssessors.find(
        assessor => assessor.id === summaryDataValues?.riskAssessor1
    );
    const riskAssessor2 = appConfig.riskAssessmentSummaryConfigurations.riskAssessors.find(
        assessor => assessor.id === summaryDataValues?.riskAssessor2
    );
    const riskAssessor3 = appConfig.riskAssessmentSummaryConfigurations.riskAssessors.find(
        assessor => assessor.id === summaryDataValues?.riskAssessor3
    );
    const riskAssessor4 = appConfig.riskAssessmentSummaryConfigurations.riskAssessors.find(
        assessor => assessor.id === summaryDataValues?.riskAssessor4
    );
    const riskAssessor5 = appConfig.riskAssessmentSummaryConfigurations.riskAssessors.find(
        assessor => assessor.id === summaryDataValues?.riskAssessor5
    );

    const overallRiskGlobal = appConfig.riskAssessmentSummaryConfigurations.overallRiskGlobal.find(
        risk => risk.id === summaryDataValues?.overallRiskGlobal
    ) ?? { id: "", name: "" };

    const overallRiskNational =
        appConfig.riskAssessmentSummaryConfigurations.overallRiskNational.find(
            risk => risk.id === summaryDataValues?.overallRiskNational
        ) ?? { id: "", name: "" };
    const overallRiskRegional =
        appConfig.riskAssessmentSummaryConfigurations.overallRiskRegional.find(
            risk => risk.id === summaryDataValues?.overallRiskRegional
        ) ?? { id: "", name: "" };
    const overallConfidenceGlobal =
        appConfig.riskAssessmentSummaryConfigurations.overAllConfidencGlobal.find(
            risk => risk.id === summaryDataValues?.overallConfidenceGlobal
        ) ?? { id: "", name: "" };
    const overallConfidenceNational =
        appConfig.riskAssessmentSummaryConfigurations.overAllConfidencNational.find(
            risk => risk.id === summaryDataValues?.overallConfidenceNational
        ) ?? { id: "", name: "" };
    const overallConfidenceRegional =
        appConfig.riskAssessmentSummaryConfigurations.overAllConfidencRegional.find(
            risk => risk.id === summaryDataValues?.overallConfidenceRegional
        ) ?? { id: "", name: "" };

    return {
        riskAssessor1,
        riskAssessor2,
        riskAssessor3,
        riskAssessor4,
        riskAssessor5,
        overallRiskGlobal,
        overallRiskNational,
        overallRiskRegional,
        overallConfidenceGlobal,
        overallConfidenceNational,
        overallConfidenceRegional,
    };
}
