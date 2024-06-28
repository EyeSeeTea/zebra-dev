import { describe, expect, it } from "vitest";
import {
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
} from "../RiskAssessmentGrading";

describe("RiskAssessmentGrading", () => {
    it("should be Grade1 if total weight is less than or equal to 7", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "1",
            lastUpdated: new Date(),
            populationAtRisk: LowPopulationAtRisk,
            attackRate: LowWeightedOption,
            geographicalSpread: LowGeographicalSpread,
            complexity: LowWeightedOption,
            capacity: LowCapacity,
            reputationalRisk: LowWeightedOption,
            severity: LowWeightedOption,
        });
        const grade = riskAssessmentGrading.getGrade().value.data;
        expect(grade).toBe("Grade 1");
    });

    it("should be Grade2 if total weight is greater than 7 and less than equal to 14", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "2",
            lastUpdated: new Date(),
            populationAtRisk: MediumPopulationAtRisk,
            attackRate: MediumWeightedOption,
            geographicalSpread: MediumGeographicalSpread,
            complexity: MediumWeightedOption,
            capacity: MediumCapacity,
            reputationalRisk: MediumWeightedOption,
            severity: MediumWeightedOption,
        });
        const grade = riskAssessmentGrading.getGrade().value.data;
        expect(grade).toBe("Grade 2");
    });

    it("should be Grade3 if score is greater than 14", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "3",
            lastUpdated: new Date(),
            populationAtRisk: HighPopulationAtRisk,
            attackRate: HighWeightedOption,
            geographicalSpread: HighGeographicalSpread,
            complexity: HighWeightedOption,
            capacity: HighCapacity,
            reputationalRisk: HighWeightedOption,
            severity: HighWeightedOption,
        });

        const grade = riskAssessmentGrading.getGrade().value.data;
        expect(grade).toBe("Grade 3");
    });

    it("should be Grade3 if score is greater than 14", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "4",
            lastUpdated: new Date(),
            populationAtRisk: LowPopulationAtRisk,
            attackRate: MediumWeightedOption,
            geographicalSpread: HighGeographicalSpread,
            complexity: MediumWeightedOption,
            capacity: LowCapacity,
            reputationalRisk: HighWeightedOption,
            severity: HighWeightedOption,
        });

        const grade = riskAssessmentGrading.getGrade().value.data;
        expect(grade).toBe("Grade 3");
    });
});
