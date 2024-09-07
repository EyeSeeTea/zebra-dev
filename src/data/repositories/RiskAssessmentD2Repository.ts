import { Id } from "../../domain/entities/Ref";
import { RiskAssessment } from "../../domain/entities/risk-assessment/RiskAssessment";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentRepository } from "../../domain/repositories/RiskAssessmentRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
} from "./consts/DiseaseOutbreakConstants";
import { Maybe } from "../../utils/ts-utils";
import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";

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

export class RiskAssessmentD2Repository implements RiskAssessmentRepository {
    constructor(private api: D2Api) {}
    getAll(diseaseOutbreakId: Id): FutureData<RiskAssessment> {
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
                const populationValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.populationAtRisk
                );
                const attackRateValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.attackRate
                );
                const geographicalSpreadValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.geographicalSpread
                );
                const complexityValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.complexity
                );
                const capacityValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.capacity
                );
                const capabilityValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.capability
                );
                const reputationalRiskValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.reputationalRisk
                );
                const severityValue = this.getValueById(
                    event.dataValues,
                    riskAssessmentGradingIds.severity
                );

                const riskAssessmentGrading: RiskAssessmentGrading = RiskAssessmentGrading.create({
                    id: "",
                    lastUpdated: new Date(),
                    populationAtRisk:
                        RiskAssessmentGrading.getOptionTypeByCodePopulation(populationValue),
                    attackRate: RiskAssessmentGrading.getOptionTypeByCodeWeighted(attackRateValue),
                    geographicalSpread:
                        RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(
                            geographicalSpreadValue
                        ),
                    complexity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(complexityValue),
                    capacity: RiskAssessmentGrading.getOptionTypeByCodeCapacity(capacityValue),
                    capability:
                        RiskAssessmentGrading.getOptionTypeByCodeCapability(capabilityValue),
                    reputationalRisk:
                        RiskAssessmentGrading.getOptionTypeByCodeWeighted(reputationalRiskValue),
                    severity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(severityValue),
                });
                return riskAssessmentGrading;
            });
            const riskAssessment: RiskAssessment = new RiskAssessment({
                grading: grading,
            });
            return riskAssessment;
        });
    }

    getValueById(dataValues: DataValue[], dataElement: string): Maybe<string> {
        return dataValues.find(dataValue => dataValue.dataElement === dataElement)?.value;
    }
}
