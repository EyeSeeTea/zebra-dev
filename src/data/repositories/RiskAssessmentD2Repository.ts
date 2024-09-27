import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import { Future } from "../../domain/entities/generic/Future";
import { Code, Id } from "../../domain/entities/Ref";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentRepository } from "../../domain/repositories/RiskAssessmentRepository";
import { D2Api } from "../../types/d2-api";
import { Maybe } from "../../utils/ts-utils";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_CUSTOM_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID,
} from "./consts/DiseaseOutbreakConstants";
import { getProgramStage } from "./utils/MetadataHelper";
import {
    mapDataElementsToRiskAssessmentGrading,
    mapDataElementsToStdRiskAssessmentQuestionnaire,
    mapDataElementsToRiskAssessmentSummary,
    mapRiskAssessmentToDataElements,
    mapDataElementsToCustomRiskAssessmentQuestionnaire,
} from "./utils/RiskAssessmentMapper";
import {
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentSummaryFormData,
} from "../../domain/entities/ConfigurableForm";

//SNEHA TO DO : Fetch from metadata on app load
export const riskAssessmentGradingIds = {
    populationAtRisk: "FdU3G0hH70Z",
    attackRate: "HfiSumUhxMf",
    geographicalSpread: "Xq4fPCmrkWS",
    complexity: "Vfusttsl1WB",
    capacity: "s5jzAmNVv0e",
    reputationalRisk: "nRZ4XJJdwWW",
    severity: "PYHSWBcKCNF",
    capability: "tChEvMFdP85",
    grade: "efLjbtWudax",
    riskId: "BeCTMOWo83N",
} as const;

export const riskAssessmentSummaryIds = {
    riskAssessmentDate: "bSmNYOatIZr",
    // riskGrade: "RTSL_ZEB_DET_RAG", //TO DO SNEHA : Do we need this?
    riskAssessor1: "H5MbxkSRf6c",
    addAnotherRiskAssessor1: "CM51mmM6dGs",
    riskAssessor2: "GVB68P2yMs6",
    addAnotherRiskAssessor2: "HEURhHZwESO",
    riskAssessor3: "EzGHhWqcMyV",
    addAnotherRiskAssessor3: "SQ9xGiE8c9D",
    riskAssessor4: "ufDiudoS5Zs",
    addAnotherRiskAssessor4: "SdjlmCpCa9Y",
    riskAssessor5: "bBf0ITzaP7g",
    qualitativeRiskAssessment: "oEQLJvobDPB",
    overallRiskNational: "SadvwwvVIjP",
    overallRiskRegional: "L5TQEffiugf",
    overallRiskGlobal: "bb00Yp1BGBH",
    overallConfidenceNational: "zHcHPvTIGuM",
    overallConfidenceRegional: "GWnyfWV8AK5",
    overallConfidenceGlobal: "ms1psJdoFD3",
} as const;

export const riskAssessmentStdQuestionnaireIds = {
    question: "NMU8ZbBPPRS",
    likelihood1: "rEtL93VEx8t",
    consequences1: "MC4qXnd8bF6",
    risk1: "B64Q6Gqvuwp",
    rational1: "EVQlTUZRJeb",
    likelihood2: "H5FqXDO4S3d",
    consequences2: "pFz63wn1rkm",
    risk2: "vt0XBS2egab",
    rational2: "EAvjE0FXf2N",
    likelihood3: "jP8fzoDBVDR",
    consequences3: "Ny0itBkNRNW",
    risk3: "OUfGKAstsWa",
    rational3: "T3oXwmPxKhU",
    riskId: "gpf85UvsOf9",
    riskId2: "vt0XBS2egab",
    riskId3: "i4eXktJiTs5",
} as const;

export const riskAssessmentCustomQuestionnaireIds = {
    id: "AgUlw358eBZ",
    question: "NMU8ZbBPPRS",
    likelihood: "z7viVU7U07z",
    consequences: "xJbWWMR6GYq",
    risk: "UHBneaaWTA7",
    rational: "sNPFIGXZQve",
} as const;

export type RiskAssessmentSummaryDataValues = {
    id: string;
    riskAssessmentDate: string;
    riskAssessor1: Maybe<string>;
    addAnotherRiskAssessor1: Maybe<string>;
    riskAssessor2: Maybe<string>;
    addAnotherRiskAssessor2: Maybe<string>;
    riskAssessor3: Maybe<string>;
    addAnotherRiskAssessor3: Maybe<string>;
    riskAssessor4: Maybe<string>;
    addAnotherRiskAssessor4: Maybe<string>;
    riskAssessor5: Maybe<string>;
    qualitativeRiskAssessment: string;
    overallRiskNational: Code;
    overallRiskRegional: Code;
    overallRiskGlobal: Code;
    overallConfidenceNational: Code;
    overallConfidenceRegional: Code;
    overallConfidenceGlobal: Code;
};

export type RiskAssessmentQuestionnaireBaseDataValues = {
    id: Id;
    rationale1: Code;
    rationale2: Code;
    rationale3: Code;
    risk1: Code;
    risk2: Code;
    risk3: Code;
    likelihood1: Code;
    likelihood2: Code;
    likelihood3: Code;
    consequence1: Code;
    consequence2: Code;
    consequence3: Code;
};

export type RiskAssessmentQuestionnaireDataValues = {
    stdSummary: RiskAssessmentQuestionnaireBaseDataValues | undefined;
    customSummary: {
        id: Id;
        question: string;
        likelihood: Code;
        consequence: Code;
        risk: Code;
        rationale: Code;
    }[];
};

export class RiskAssessmentD2Repository implements RiskAssessmentRepository {
    constructor(private api: D2Api) {}

    getAllRiskAssessmentGrading(diseaseOutbreakId: Id): FutureData<RiskAssessmentGrading[]> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: diseaseOutbreakId,
                programStage: RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
                fields: {
                    dataValues: {
                        dataElement: { id: true, code: true },
                        value: true,
                    },
                    trackedEntity: true,
                },
            })
        ).map(events => {
            const grading: RiskAssessmentGrading[] = events.instances.map(event => {
                return mapDataElementsToRiskAssessmentGrading(event.dataValues);
            });
            return grading;
        });
    }

    getRiskAssessmentSummary(
        diseaseOutbreakId: Id
    ): FutureData<Maybe<RiskAssessmentSummaryDataValues>> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: diseaseOutbreakId,
                programStage: RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID,
                fields: {
                    event: true,
                    dataValues: {
                        dataElement: { id: true, code: true },
                        value: true,
                    },
                    trackedEntity: true,
                },
            })
        ).map(events => {
            if (!events.instances[0]?.event) return undefined;

            const summary: RiskAssessmentSummaryDataValues = mapDataElementsToRiskAssessmentSummary(
                events.instances[0].event,
                events.instances[0].dataValues
            );
            return summary;
        });
    }

    getRiskAssessmentQuestionnaire(
        diseaseOutbreakId: Id
    ): FutureData<RiskAssessmentQuestionnaireDataValues> {
        return Future.joinObj({
            standardQuestions: apiToFuture(
                this.api.tracker.events.get({
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    trackedEntity: diseaseOutbreakId,
                    programStage: RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_PROGRAM_STAGE_ID,
                    fields: {
                        event: true,
                        dataValues: {
                            dataElement: { id: true, code: true },
                            value: true,
                        },
                        trackedEntity: true,
                    },
                })
            ),
            customQuestions: apiToFuture(
                this.api.tracker.events.get({
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                    trackedEntity: diseaseOutbreakId,
                    programStage: RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_CUSTOM_PROGRAM_STAGE_ID,
                    fields: {
                        event: true,
                        dataValues: {
                            dataElement: { id: true, code: true },
                            value: true,
                        },
                        trackedEntity: true,
                    },
                })
            ),
        }).flatMap(({ standardQuestions, customQuestions }) => {
            const stdQuestionnaire = standardQuestions.instances[0]
                ? mapDataElementsToStdRiskAssessmentQuestionnaire(
                      standardQuestions.instances[0].event,
                      standardQuestions.instances[0].dataValues
                  )
                : undefined;

            const customQuestionnaire = customQuestions.instances.map(event => {
                return mapDataElementsToCustomRiskAssessmentQuestionnaire(
                    event.event,
                    event.dataValues
                );
            });

            const questionnaire: RiskAssessmentQuestionnaireDataValues = {
                stdSummary: stdQuestionnaire,
                customSummary: customQuestionnaire,
            };
            return Future.success(questionnaire);
        });
    }

    saveRiskAssessment(
        formData:
            | RiskAssessmentGradingFormData
            | RiskAssessmentSummaryFormData
            | RiskAssessmentQuestionnaireFormData,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        const programStageId = this.getProgramStageByFormType(formData.type);
        return getProgramStage(this.api, programStageId).flatMap(riskResponse => {
            const riskDataElements = riskResponse.objects[0]?.programStageDataElements;

            if (!riskDataElements)
                return Future.error(
                    new Error(` ${formData.type} Program Stage metadata not found`)
                );

            //Get the enrollment Id for the disease outbreak
            return apiToFuture(
                this.api.tracker.enrollments.get({
                    fields: {
                        enrollment: true,
                    },
                    trackedEntity: diseaseOutbreakId,
                    enrolledBefore: new Date().toISOString(),
                    program: RTSL_ZEBRA_PROGRAM_ID,
                    orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                })
            ).flatMap(enrollmentResponse => {
                const enrollmentId = enrollmentResponse.instances[0]?.enrollment;
                if (!enrollmentId) {
                    return Future.error(new Error(`Enrollment not found for Disease Outbreak`));
                }
                const events: D2TrackerEvent = mapRiskAssessmentToDataElements(
                    formData,
                    programStageId,
                    diseaseOutbreakId,
                    enrollmentId,
                    riskDataElements
                );

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { events: [events] }
                    )
                ).flatMap(saveResponse => {
                    if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                        return Future.error(new Error(`Error Risk Assessment Grading`));
                    } else {
                        return Future.success(undefined);
                    }
                });
            });
        });
    }
    private getProgramStageByFormType(formType: string) {
        switch (formType) {
            case "risk-assessment-grading":
                return RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID;
            case "risk-assessment-summary":
                return RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID;
            case "risk-assessment-questionnaire":
                return RTSL_ZEBRA_RISK_ASSESSMENT_QUESTIONNAIRE_PROGRAM_STAGE_ID;
            default:
                throw new Error("Risk Form type not supported");
        }
    }
}
