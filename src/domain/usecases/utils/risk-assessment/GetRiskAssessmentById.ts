import { FutureData } from "../../../../data/api-futures";
import { RiskAssessmentSummaryDataValues } from "../../../../data/repositories/RiskAssessmentD2Repository";
import { Maybe } from "../../../../utils/ts-utils";
import _c from "../../../entities/generic/Collection";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { RiskAssessment } from "../../../entities/risk-assessment/RiskAssessment";
import {
    RiskAssessmentQuestion,
    RiskAssessmentQuestionnaire,
} from "../../../entities/risk-assessment/RiskAssessmentQuestionnaire";
import { RiskAssessmentSummary } from "../../../entities/risk-assessment/RiskAssessmentSummary";
import { OptionsRepository } from "../../../repositories/OptionsRepository";
import { RiskAssessmentRepository } from "../../../repositories/RiskAssessmentRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getAll(
    diseaseOutbreakId: Id,
    riskAssessmentRepository: RiskAssessmentRepository,
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
): FutureData<RiskAssessment> {
    return riskAssessmentRepository
        .getAllRiskAssessmentGrading(diseaseOutbreakId)
        .flatMap(gradings => {
            return riskAssessmentRepository
                .getRiskAssessmentSummary(diseaseOutbreakId)
                .flatMap(summaryDataValues => {
                    return Future.joinObj(
                        getRiskSummaryFutures(
                            summaryDataValues,
                            optionsRepository,
                            teamMemberRepository
                        ),
                        { concurrency: 3 }
                    ).flatMap(summaryResponse => {
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
                                } = summaryResponse;

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

                                return Future.joinObj({
                                    likelihood1: questionnaireDataValues?.stdSummary?.likelihood1
                                        ? optionsRepository.getLikelihoodOption(
                                              questionnaireDataValues.stdSummary?.likelihood1
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    likelihood2: questionnaireDataValues?.stdSummary?.likelihood2
                                        ? optionsRepository.getLikelihoodOption(
                                              questionnaireDataValues.stdSummary?.likelihood2
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    likelihood3: questionnaireDataValues?.stdSummary?.likelihood3
                                        ? optionsRepository.getLikelihoodOption(
                                              questionnaireDataValues.stdSummary?.likelihood3
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    consequence1: questionnaireDataValues?.stdSummary?.consequence1
                                        ? optionsRepository.getConsequencesOption(
                                              questionnaireDataValues.stdSummary?.consequence1
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    consequence2: questionnaireDataValues?.stdSummary?.consequence2
                                        ? optionsRepository.getConsequencesOption(
                                              questionnaireDataValues.stdSummary?.consequence2
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    consequence3: questionnaireDataValues?.stdSummary?.consequence3
                                        ? optionsRepository.getConsequencesOption(
                                              questionnaireDataValues.stdSummary?.consequence3
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    risk1: questionnaireDataValues?.stdSummary?.risk1
                                        ? optionsRepository.getLowMediumHighOption(
                                              questionnaireDataValues.stdSummary?.risk1
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    risk2: questionnaireDataValues?.stdSummary?.risk2
                                        ? optionsRepository.getLowMediumHighOption(
                                              questionnaireDataValues.stdSummary?.risk2
                                          )
                                        : Future.success({ id: "", name: "" }),
                                    risk3: questionnaireDataValues?.stdSummary?.risk3
                                        ? optionsRepository.getLowMediumHighOption(
                                              questionnaireDataValues.stdSummary?.risk3
                                          )
                                        : Future.success({ id: "", name: "" }),
                                }).flatMap(questionnaireResponse => {
                                    const {
                                        likelihood1,
                                        likelihood2,
                                        likelihood3,
                                        consequence1,
                                        consequence2,
                                        consequence3,
                                        risk1,
                                        risk2,
                                        risk3,
                                    } = questionnaireResponse;

                                    const additionalQuestions =
                                        questionnaireDataValues?.customSummary.map(
                                            customQuestionDataValues => {
                                                const likelihood =
                                                    customQuestionDataValues.likelihood
                                                        ? optionsRepository.getLikelihoodOption(
                                                              customQuestionDataValues.likelihood
                                                          )
                                                        : Future.success({ id: "", name: "" });
                                                const consequence =
                                                    customQuestionDataValues.consequence
                                                        ? optionsRepository.getConsequencesOption(
                                                              customQuestionDataValues.consequence
                                                          )
                                                        : Future.success({ id: "", name: "" });
                                                const risk = customQuestionDataValues.risk
                                                    ? optionsRepository.getLowMediumHighOption(
                                                          customQuestionDataValues.risk
                                                      )
                                                    : Future.success({ id: "", name: "" });

                                                return Future.joinObj({
                                                    likelihood,
                                                    consequence,
                                                    risk,
                                                }).flatMap(customQuestionResponse => {
                                                    const customQuestion: RiskAssessmentQuestion = {
                                                        question: customQuestionDataValues.question,
                                                        likelihood:
                                                            customQuestionResponse.likelihood,
                                                        consequences:
                                                            customQuestionResponse.consequence,
                                                        risk: customQuestionResponse.risk,
                                                        rational:
                                                            customQuestionDataValues.rationale,
                                                    };
                                                    return Future.success(customQuestion);
                                                });
                                            }
                                        );

                                    const customQuestions = additionalQuestions
                                        ? Future.sequential(additionalQuestions)
                                        : Future.success([]);

                                    return customQuestions.flatMap(customQuestions => {
                                        const questionnaire = new RiskAssessmentQuestionnaire({
                                            id: questionnaireDataValues?.stdSummary?.id ?? "",
                                            potentialRiskForHumanHealth: {
                                                likelihood: likelihood1,
                                                consequences: consequence1,
                                                risk: risk1,
                                                rational:
                                                    questionnaireDataValues?.stdSummary
                                                        ?.rationale1 ?? "",
                                            },
                                            riskOfEventSpreading: {
                                                likelihood: likelihood2,
                                                consequences: consequence2,
                                                risk: risk2,
                                                rational:
                                                    questionnaireDataValues?.stdSummary
                                                        ?.rationale2 ?? "",
                                            },
                                            riskOfInsufficientCapacities: {
                                                likelihood: likelihood3,
                                                consequences: consequence3,
                                                risk: risk3,
                                                rational:
                                                    questionnaireDataValues?.stdSummary
                                                        ?.rationale3 ?? "",
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
                });
        });
}
function getRiskSummaryFutures(
    summarybase: Maybe<RiskAssessmentSummaryDataValues>,
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
) {
    return {
        riskAssessor1: summarybase?.riskAssessor1
            ? teamMemberRepository.get(summarybase.riskAssessor1)
            : Future.success(undefined),
        riskAssessor2: summarybase?.riskAssessor2
            ? teamMemberRepository.get(summarybase.riskAssessor2)
            : Future.success(undefined),
        riskAssessor3: summarybase?.riskAssessor3
            ? teamMemberRepository.get(summarybase.riskAssessor3)
            : Future.success(undefined),
        riskAssessor4: summarybase?.riskAssessor4
            ? teamMemberRepository.get(summarybase.riskAssessor4)
            : Future.success(undefined),
        riskAssessor5: summarybase?.riskAssessor5
            ? teamMemberRepository.get(summarybase.riskAssessor5)
            : Future.success(undefined),
        overallRiskNational: summarybase?.overallRiskNational
            ? optionsRepository.getLowMediumHighOption(summarybase.overallRiskNational)
            : Future.success({ id: "", name: "" }),
        overallRiskRegional: summarybase?.overallRiskRegional
            ? optionsRepository.getLowMediumHighOption(summarybase.overallRiskRegional)
            : Future.success({ id: "", name: "" }),
        overallRiskGlobal: summarybase?.overallRiskGlobal
            ? optionsRepository.getLowMediumHighOption(summarybase.overallRiskGlobal)
            : Future.success({ id: "", name: "" }),
        overallConfidenceNational: summarybase?.overallConfidenceNational
            ? optionsRepository.getLowMediumHighOption(summarybase.overallConfidenceNational)
            : Future.success({ id: "", name: "" }),
        overallConfidenceRegional: summarybase?.overallConfidenceRegional
            ? optionsRepository.getLowMediumHighOption(summarybase.overallConfidenceRegional)
            : Future.success({ id: "", name: "" }),
        overallConfidenceGlobal: summarybase?.overallConfidenceGlobal
            ? optionsRepository.getLowMediumHighOption(summarybase.overallConfidenceGlobal)
            : Future.success({ id: "", name: "" }),
    };
}
