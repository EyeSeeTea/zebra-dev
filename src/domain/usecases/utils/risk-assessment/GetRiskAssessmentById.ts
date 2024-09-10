import { FutureData } from "../../../../data/api-futures";
import _c from "../../../entities/generic/Collection";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { RiskAssessment } from "../../../entities/risk-assessment/RiskAssessment";
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
                .flatMap(summarybase => {
                    return Future.joinObj({
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
                            ? optionsRepository.getLowMediumHighOption(
                                  summarybase.overallRiskNational
                              )
                            : Future.success({ id: "", name: "" }),
                        overallRiskRegional: summarybase?.overallRiskRegional
                            ? optionsRepository.getLowMediumHighOption(
                                  summarybase.overallRiskRegional
                              )
                            : Future.success({ id: "", name: "" }),
                        overallRiskGlobal: summarybase?.overallRiskGlobal
                            ? optionsRepository.getLowMediumHighOption(
                                  summarybase.overallRiskGlobal
                              )
                            : Future.success({ id: "", name: "" }),
                        overallConfidenceNational: summarybase?.overallConfidenceNational
                            ? optionsRepository.getLowMediumHighOption(
                                  summarybase.overallConfidenceNational
                              )
                            : Future.success({ id: "", name: "" }),
                        overallConfidenceRegional: summarybase?.overallConfidenceRegional
                            ? optionsRepository.getLowMediumHighOption(
                                  summarybase.overallConfidenceRegional
                              )
                            : Future.success({ id: "", name: "" }),
                        overallConfidenceGlobal: summarybase?.overallConfidenceGlobal
                            ? optionsRepository.getLowMediumHighOption(
                                  summarybase.overallConfidenceGlobal
                              )
                            : Future.success({ id: "", name: "" }),
                    }).flatMap(
                        ({
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
                        }) => {
                            if (!summarybase) {
                                const riskAssessment: RiskAssessment = new RiskAssessment({
                                    grading: gradings,
                                    summary: undefined,
                                });
                                return Future.success(riskAssessment);
                            }

                            const summary = new RiskAssessmentSummary({
                                id: summarybase.id ?? "",
                                riskAssessmentDate: new Date(summarybase.riskAssessmentDate),
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
                                    summarybase?.qualitativeRiskAssessment ?? "",
                                riskId: "",
                            });
                            const riskAssessment: RiskAssessment = new RiskAssessment({
                                grading: gradings,
                                summary: summary,
                            });
                            return Future.success(riskAssessment);
                        }
                    );
                });
        });
}
