import { SelectedPick } from "@eyeseetea/d2-api/api";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { D2DataElementSchema } from "@eyeseetea/d2-api/2.36";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
} from "../consts/DiseaseOutbreakConstants";
import { DataValue } from "@eyeseetea/d2-api";
import { Id } from "../../../domain/entities/Ref";
import {
    getValueFromRiskAssessmentGrading,
    isStringIRiskAssessmentGradingCodes,
    RiskAssessmentGradingCodes,
    RiskAssessmentGradingKeyCode,
} from "../consts/RiskAssessmentGradingConstants";

type D2ProgramStageDataElementsMetadata = {
    dataElement: SelectedPick<
        D2DataElementSchema,
        {
            id: true;
            valueType: true;
            code: true;
        }
    >;
};

export function mapRiskAssessmentGradingToDataElements(
    teiId: Id,
    enrollmentId: Id,
    riskAssessmentGrading: RiskAssessmentGrading,
    programStageDataElementsMetadata: D2ProgramStageDataElementsMetadata[]
): D2TrackerEvent {
    const dataElementValues: Record<RiskAssessmentGradingCodes, string> =
        getValueFromRiskAssessmentGrading(riskAssessmentGrading);

    const dataValues: DataValue[] = programStageDataElementsMetadata.map(programStage => {
        if (!isStringIRiskAssessmentGradingCodes(programStage.dataElement.code)) {
            throw new Error("DataElement code not found in RiskAssessmentGradingCodes");
        }
        const typedCode: RiskAssessmentGradingKeyCode = programStage.dataElement.code;
        const populatedDataElement = {
            dataElement: programStage.dataElement.id,
            value: dataElementValues[typedCode],
            lastUpdated: new Date().toISOString(),
            storedBy: "",
            created: new Date().toISOString(),
            providedElsewhere: false,
        };
        return populatedDataElement;
    });

    const d2RiskAssessmentGrading: D2TrackerEvent = {
        event: "",
        status: "ACTIVE",
        program: RTSL_ZEBRA_PROGRAM_ID,
        programStage: RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
        enrollment: enrollmentId,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        occurredAt: new Date().toISOString(),
        dataValues: dataValues,
        trackedEntity: teiId,
    };
    return d2RiskAssessmentGrading;
}
