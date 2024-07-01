import { describe, expect, it } from "vitest";
import { RiskAssessmentGrading } from "../RiskAssessmentGrading";

const lowPopulationAtRisk = { type: "LessPercentage" as const, weight: 1 as const };
const mediumPopulationAtRisk = { type: "MediumPercentage" as const, weight: 2 as const };
const highPopulationAtRisk = { type: "HighPercentage" as const, weight: 3 as const };
const lowWeightedOption = { type: "Low" as const, weight: 1 as const };
const mediumWeightedOption = { type: "Medium" as const, weight: 2 as const };
const highWeightedOption = { type: "High" as const, weight: 3 as const };
const lowGeographicalSpread = { type: "WithinDistrict" as const, weight: 1 as const };
const mediumGeographicalSpread = { type: "MoretThanOneDistrict" as const, weight: 2 as const };
const highGeographicalSpread = { type: "MoreThanOneProvince" as const, weight: 3 as const };
const lowCapacity = { type: "ProvincialNationalLevel" as const, weight: 1 as const };
const mediumCapacity = { type: "ProvincialLevel" as const, weight: 2 as const };
const highCapacity = { type: "NationalInternationalLevel" as const, weight: 3 as const };

describe("RiskAssessmentGrading", () => {
    it("should be Grade1 if total weight is less than or equal to 7", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "1",
            lastUpdated: new Date(),
            populationAtRisk: lowPopulationAtRisk,
            attackRate: lowWeightedOption,
            geographicalSpread: lowGeographicalSpread,
            complexity: lowWeightedOption,
            capacity: lowCapacity,
            reputationalRisk: lowWeightedOption,
            severity: lowWeightedOption,
        });
        const grade = riskAssessmentGrading.getGrade().getOrThrow();
        if (grade) expect(RiskAssessmentGrading.getTranslatedLabel(grade)).toBe("Grade 1");
    });

    it("should be Grade2 if total weight is greater than 7 and less than equal to 14", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "2",
            lastUpdated: new Date(),
            populationAtRisk: mediumPopulationAtRisk,
            attackRate: mediumWeightedOption,
            geographicalSpread: mediumGeographicalSpread,
            complexity: mediumWeightedOption,
            capacity: mediumCapacity,
            reputationalRisk: mediumWeightedOption,
            severity: mediumWeightedOption,
        });
        const grade = riskAssessmentGrading.getGrade().getOrThrow();
        if (grade) expect(RiskAssessmentGrading.getTranslatedLabel(grade)).toBe("Grade 2");
    });

    it("should be Grade3 if score is greater than 14", () => {
        const riskAssessmentGrading = RiskAssessmentGrading.create({
            id: "3",
            lastUpdated: new Date(),
            populationAtRisk: highPopulationAtRisk,
            attackRate: highWeightedOption,
            geographicalSpread: highGeographicalSpread,
            complexity: highWeightedOption,
            capacity: highCapacity,
            reputationalRisk: highWeightedOption,
            severity: highWeightedOption,
        });

        const grade = riskAssessmentGrading.getGrade().getOrThrow();
        if (grade) expect(RiskAssessmentGrading.getTranslatedLabel(grade)).toBe("Grade 3");
    });
});
