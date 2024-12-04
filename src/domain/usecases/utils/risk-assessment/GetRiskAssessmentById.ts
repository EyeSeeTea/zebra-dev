import { FutureData } from "../../../../data/api-futures";
import {
    RiskAssessmentQuestionnaireDataValues,
    RiskAssessmentSummaryDataValues,
} from "../../../../data/repositories/RiskAssessmentD2Repository";
import { Maybe } from "../../../../utils/ts-utils";
import { Configurations } from "../../../entities/AppConfigurations";
import { RiskAssessmentQuestionnaireOptions } from "../../../entities/ConfigurableForm";
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
    configurations: Configurations
): FutureData<RiskAssessment> {
    return Future.joinObj({
        gradings: riskAssessmentRepository.getAllRiskAssessmentGrading(diseaseOutbreakId),
        summaryDataValues: riskAssessmentRepository.getRiskAssessmentSummary(diseaseOutbreakId),
        questionnaireDataValues:
            riskAssessmentRepository.getRiskAssessmentQuestionnaire(diseaseOutbreakId),
    }).flatMap(({ gradings, summaryDataValues, questionnaireDataValues }) => {
        const summary = mapRiskSummary(configurations, summaryDataValues);
        return mapRiskQuestionnaire(configurations, questionnaireDataValues).flatMap(
            questionnaire => {
                const riskAssessment: RiskAssessment = new RiskAssessment({
                    grading: gradings,
                    summary: summaryDataValues ? summary : undefined,
                    questionnaire: questionnaireDataValues ? questionnaire : undefined,
                });
                return Future.success(riskAssessment);
            }
        );
    });
}

function mapRiskSummary(
    configurations: Configurations,
    summaryDataValues: Maybe<RiskAssessmentSummaryDataValues>
) {
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
    } = getRiskSummarySelections(configurations, summaryDataValues);

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
        qualitativeRiskAssessment: summaryDataValues?.qualitativeRiskAssessment ?? "",
        riskId: "",
    });
    return summary;
}

function mapRiskQuestionnaire(
    configurations: Configurations,
    questionnaireDataValues: Maybe<RiskAssessmentQuestionnaireDataValues>
) {
    const { riskAssessmentQuestionnaireConfigurations: riskQuestionnaireConfig } =
        configurations.selectableOptions;
    const additionalQuestions = questionnaireDataValues?.customSummary.map(
        customQuestionDataValues => {
            const customQuestion: RiskAssessmentQuestion = {
                id: customQuestionDataValues.id,
                question: customQuestionDataValues.question,
                likelihood: getLikelihood(
                    riskQuestionnaireConfig,
                    customQuestionDataValues.likelihood
                ),
                consequences: getConsequence(
                    riskQuestionnaireConfig,
                    customQuestionDataValues.consequence
                ),
                risk: getRisk(riskQuestionnaireConfig, customQuestionDataValues.risk),
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
                likelihood: getLikelihood(
                    riskQuestionnaireConfig,
                    questionnaireDataValues?.stdSummary?.likelihood1
                ),
                consequences: getConsequence(
                    riskQuestionnaireConfig,
                    questionnaireDataValues?.stdSummary?.consequence1
                ),
                risk: getRisk(riskQuestionnaireConfig, questionnaireDataValues?.stdSummary?.risk1),
                rational: questionnaireDataValues?.stdSummary?.rationale1 ?? "",
            },
            riskOfEventSpreading: {
                likelihood: getLikelihood(
                    riskQuestionnaireConfig,
                    questionnaireDataValues?.stdSummary?.likelihood2
                ),
                consequences: getConsequence(
                    riskQuestionnaireConfig,
                    questionnaireDataValues?.stdSummary?.consequence2
                ),
                risk: getRisk(riskQuestionnaireConfig, questionnaireDataValues?.stdSummary?.risk2),
                rational: questionnaireDataValues?.stdSummary?.rationale2 ?? "",
            },
            riskOfInsufficientCapacities: {
                likelihood: getLikelihood(
                    riskQuestionnaireConfig,
                    questionnaireDataValues?.stdSummary?.likelihood3
                ),
                consequences: getConsequence(
                    riskQuestionnaireConfig,
                    questionnaireDataValues?.stdSummary?.consequence3
                ),
                risk: getRisk(riskQuestionnaireConfig, questionnaireDataValues?.stdSummary?.risk3),
                rational: questionnaireDataValues?.stdSummary?.rationale3 ?? "",
            },
            additionalQuestions: customQuestions,
        });
        return Future.success(questionnaire);
    });
}

function getLikelihood(config: RiskAssessmentQuestionnaireOptions, value: Maybe<string>) {
    return (
        config.likelihood.find(likelihood => likelihood.id === value) ?? {
            id: "",
            name: "",
        }
    );
}

function getConsequence(config: RiskAssessmentQuestionnaireOptions, value: Maybe<string>) {
    return (
        config.consequences.find(consequence => consequence.id === value) ?? {
            id: "",
            name: "",
        }
    );
}

function getRisk(config: RiskAssessmentQuestionnaireOptions, value: Maybe<string>) {
    return (
        config.risk.find(risk => risk.id === value) ?? {
            id: "",
            name: "",
        }
    );
}

function getRiskSummarySelections(
    configurations: Configurations,
    summaryDataValues: Maybe<RiskAssessmentSummaryDataValues>
) {
    const { riskAssessmentSummaryConfigurations: riskSummaryConfig } =
        configurations.selectableOptions;

    const riskAssessor1 = riskSummaryConfig.riskAssessors.find(
        assessor => assessor.username === summaryDataValues?.riskAssessor1
    );
    const riskAssessor2 = riskSummaryConfig.riskAssessors.find(
        assessor => assessor.username === summaryDataValues?.riskAssessor2
    );
    const riskAssessor3 = riskSummaryConfig.riskAssessors.find(
        assessor => assessor.username === summaryDataValues?.riskAssessor3
    );
    const riskAssessor4 = riskSummaryConfig.riskAssessors.find(
        assessor => assessor.username === summaryDataValues?.riskAssessor4
    );
    const riskAssessor5 = riskSummaryConfig.riskAssessors.find(
        assessor => assessor.username === summaryDataValues?.riskAssessor5
    );
    const overallRiskGlobal = riskSummaryConfig.overallRiskGlobal.find(
        risk => risk.id === summaryDataValues?.overallRiskGlobal
    ) ?? { id: "", name: "" };
    const overallRiskNational = riskSummaryConfig.overallRiskNational.find(
        risk => risk.id === summaryDataValues?.overallRiskNational
    ) ?? { id: "", name: "" };
    const overallRiskRegional = riskSummaryConfig.overallRiskRegional.find(
        risk => risk.id === summaryDataValues?.overallRiskRegional
    ) ?? { id: "", name: "" };
    const overallConfidenceGlobal = riskSummaryConfig.overAllConfidencGlobal.find(
        risk => risk.id === summaryDataValues?.overallConfidenceGlobal
    ) ?? { id: "", name: "" };
    const overallConfidenceNational = riskSummaryConfig.overAllConfidencNational.find(
        risk => risk.id === summaryDataValues?.overallConfidenceNational
    ) ?? { id: "", name: "" };
    const overallConfidenceRegional = riskSummaryConfig.overAllConfidencRegional.find(
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
