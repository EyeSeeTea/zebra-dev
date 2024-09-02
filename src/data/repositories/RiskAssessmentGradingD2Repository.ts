import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { getProgramStage } from "./utils/MetadataHelper";
import { Future } from "../../domain/entities/generic/Future";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentGradingRepository } from "../../domain/repositories/RiskAssessmentGradingRepository";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
} from "./consts/DiseaseOutbreakConstants";
import { mapRiskAssessmentGradingToDataElements } from "./utils/RiskAssessmentGradingMapper";
import { Id } from "../../domain/entities/Ref";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";

export class RiskAssessmentGradingD2Repository implements RiskAssessmentGradingRepository {
    constructor(private api: D2Api) {}

    save(riskAssessmentGrading: RiskAssessmentGrading, diseaseOutbreakId: Id): FutureData<void> {
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
}
