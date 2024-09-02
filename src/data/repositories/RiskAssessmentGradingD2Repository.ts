import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { mapDiseaseOutbreakEventToTrackedEntityAttributes } from "./utils/DiseaseOutbreakMapper";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { getProgramStage, getProgramTEAsMetadata } from "./utils/MetadataHelper";
import { Future } from "../../domain/entities/generic/Future";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentGradingRepository } from "../../domain/repositories/RiskAssessmentGradingRepository";
import {
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
            RTSL_ZEBRA_PROGRAM_ID,
            RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID
        ).flatMap(riskGradingResponse => {
            const riskGradingDataElements =
                riskGradingResponse.objects[0]?.programStageDataElements;

            if (!riskGradingDataElements)
                return Future.error(
                    new Error(`Risk Assessment Grading Program Stage metadata not found`)
                );

            const events: D2TrackerEvent = mapRiskAssessmentGradingToDataElements(
                diseaseOutbreakId,
                riskAssessmentGrading,
                riskGradingDataElements
            );

            return apiToFuture(
                this.api.tracker.post({ importStrategy: "CREATE_AND_UPDATE" }, { events: [events] })
            ).flatMap(saveResponse => {
                if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                    return Future.error(new Error(`Error Risk Assessment Grading`));
                } else {
                    return Future.success(undefined);
                }
            });
        });
    }
}
