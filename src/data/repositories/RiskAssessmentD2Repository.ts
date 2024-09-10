import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import { Future } from "../../domain/entities/generic/Future";
import { Id } from "../../domain/entities/Ref";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentSummary } from "../../domain/entities/risk-assessment/RiskAssessmentSummary";
import { RiskAssessmentRepository } from "../../domain/repositories/RiskAssessmentRepository";
import { D2Api } from "../../types/d2-api";
import { Maybe } from "../../utils/ts-utils";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID,
} from "./consts/DiseaseOutbreakConstants";
import { getProgramStage } from "./utils/MetadataHelper";
import {
    mapDataElementsToRiskAssessmentGrading,
    mapDataElementsToRiskAssessmentSummary,
    mapRiskAssessmentGradingToDataElements,
    mapRiskAssessmentSummaryToDataElements,
} from "./utils/RiskAssessmentGradingMapper";

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
    // riskId: "Um5rjA04Gby",
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
    overallRiskNational: string;
    overallRiskRegional: string;
    overallRiskGlobal: string;
    overallConfidenceNational: string;
    overallConfidenceRegional: string;
    overallConfidenceGlobal: string;
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

    saveGrading(
        riskAssessmentGrading: RiskAssessmentGrading,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        return getProgramStage(
            this.api,
            RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID
        ).flatMap(riskGradingResponse => {
            const riskGradingDataElements =
                riskGradingResponse.objects[0]?.programStageDataElements;

            if (!riskGradingDataElements)
                return Future.error(
                    new Error(`Risk Assessment Grading Program Stage metadata not found`)
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
                const events: D2TrackerEvent = mapRiskAssessmentGradingToDataElements(
                    diseaseOutbreakId,
                    enrollmentId,
                    riskAssessmentGrading,
                    riskGradingDataElements
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
    saveSummary(
        riskAssessmentSummary: RiskAssessmentSummary,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        return getProgramStage(
            this.api,
            RTSL_ZEBRA_RISK_ASSESSMENT_SUMMARY_PROGRAM_STAGE_ID
        ).flatMap(riskSummaryResponse => {
            const riskSummaryDataElements =
                riskSummaryResponse.objects[0]?.programStageDataElements;

            if (!riskSummaryDataElements)
                return Future.error(
                    new Error(`Risk Assessment Summary Program Stage metadata not found`)
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
                const events: D2TrackerEvent = mapRiskAssessmentSummaryToDataElements(
                    diseaseOutbreakId,
                    enrollmentId,
                    riskAssessmentSummary,
                    riskSummaryDataElements
                );

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { events: [events] }
                    )
                ).flatMap(saveResponse => {
                    if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                        return Future.error(new Error(`Error Risk Assessment Summary`));
                    } else {
                        return Future.success(undefined);
                    }
                });
            });
        });
    }
}
