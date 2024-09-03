import { Id } from "../../domain/entities/Ref";
import { RiskAssessment } from "../../domain/entities/risk-assessment/RiskAssessment";
import {
    Capability1,
    Capability2,
    HighCapacity,
    HighGeographicalSpread,
    HighPopulationAtRisk,
    HighWeightedOption,
    LowCapacity,
    LowGeographicalSpread,
    LowPopulationAtRisk,
    LowWeightedOption,
    MediumCapacity,
    MediumGeographicalSpread,
    MediumPopulationAtRisk,
    MediumWeightedOption,
    RiskAssessmentGrading,
} from "../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { RiskAssessmentRepository } from "../../domain/repositories/RiskAssessmentRepository";
import { D2Api } from "../../types/d2-api";
import { getWeightBasedOnOptionType } from "../../webapp/pages/form-page/mapFormStateToEntityData";
import { apiToFuture, FutureData } from "../api-futures";
import {
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_RISK_ASSESSMENT_GRADING_PROGRAM_STAGE_ID,
} from "./consts/DiseaseOutbreakConstants";
import { riskAssessmentGradingOptionCodes } from "./consts/RiskAssessmentGradingConstants";

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
                const populationValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.populationAtRisk
                )?.value;
                const population = Object.entries(
                    riskAssessmentGradingOptionCodes.populationAtRisk
                ).filter(([_key, val]) => val === populationValue)[0]?.[0];

                if (!population) throw new Error("Population value not found");

                const attackRateValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.attackRate
                )?.value;
                const attackRate = Object.entries(
                    riskAssessmentGradingOptionCodes.weightedOption
                ).filter(([_key, val]) => val === attackRateValue)[0]?.[0];

                if (!attackRate) throw new Error("Attack rate value not found");

                const geographicalSpreadValue = event.dataValues.find(
                    dataValue =>
                        dataValue.dataElement === riskAssessmentGradingIds.geographicalSpread
                )?.value;
                const geographicalSpread = Object.entries(
                    riskAssessmentGradingOptionCodes.geographicalSpread
                ).filter(([_key, val]) => val === geographicalSpreadValue)[0]?.[0];

                if (!geographicalSpread) throw new Error("Geographical spread value not found");

                const complexityValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.complexity
                )?.value;
                const complexity = Object.entries(
                    riskAssessmentGradingOptionCodes.weightedOption
                ).filter(([_key, val]) => val === complexityValue)[0]?.[0];

                if (!complexity) throw new Error("Complexity value not found");

                const capacityValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.capacity
                )?.value;
                const capacity = Object.entries(riskAssessmentGradingOptionCodes.capacity).filter(
                    ([_key, val]) => val === capacityValue
                )[0]?.[0];

                if (!capacity) throw new Error("Capacity value not found");

                const capabilityValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.capability
                )?.value;
                const capability = Object.entries(
                    riskAssessmentGradingOptionCodes.capability
                ).filter(([_key, val]) => val === capabilityValue)[0]?.[0];

                if (!capability) throw new Error("Capability value not found");

                const reputationalRiskValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.reputationalRisk
                )?.value;
                const reputationalRisk = Object.entries(
                    riskAssessmentGradingOptionCodes.weightedOption
                ).filter(([_key, val]) => val === reputationalRiskValue)[0]?.[0];

                if (!reputationalRisk) throw new Error("Reputational risk value not found");

                const severityValue = event.dataValues.find(
                    dataValue => dataValue.dataElement === riskAssessmentGradingIds.severity
                )?.value;
                const severity = Object.entries(
                    riskAssessmentGradingOptionCodes.weightedOption
                ).filter(([_key, val]) => val === severityValue)[0]?.[0];

                if (!severity) throw new Error("Severity value not found");

                const riskAssessmentGrading: RiskAssessmentGrading = RiskAssessmentGrading.create({
                    id: "",
                    lastUpdated: new Date(),
                    populationAtRisk: {
                        type: population,
                        weight: getWeightBasedOnOptionType(population),
                    } as LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk,
                    attackRate: {
                        type: attackRate,
                        weight: getWeightBasedOnOptionType(attackRate),
                    } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
                    geographicalSpread: {
                        type: geographicalSpread,
                        weight: getWeightBasedOnOptionType(geographicalSpread),
                    } as LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread,
                    complexity: {
                        type: complexity,
                        weight: getWeightBasedOnOptionType(complexity),
                    } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
                    capacity: {
                        type: capacity,
                        weight: getWeightBasedOnOptionType(capacity),
                    } as LowCapacity | MediumCapacity | HighCapacity,
                    capability: {
                        type: capability,
                        weight: getWeightBasedOnOptionType(capability),
                    } as Capability1 | Capability2,
                    reputationalRisk: {
                        type: reputationalRisk,
                        weight: getWeightBasedOnOptionType(reputationalRisk),
                    } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
                    severity: {
                        type: severity,
                        weight: getWeightBasedOnOptionType(severity),
                    } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
                });
                return riskAssessmentGrading;
            });
            const riskAssessment: RiskAssessment = new RiskAssessment({
                grading: grading,
            });
            return riskAssessment;
        });
    }
}
