import { describe, expect, it } from "vitest";
import { RiskAssessmentGrading } from "../RiskAssessmentGrading";

const LowPopulationAtRisk = { type: "LessPercentage" as const, weight: 1 as const };
const MediumPopulationAtRisk = { type: "MediumPercentage" as const, weight: 2 as const };
const HighPopulationAtRisk = { type: "HighPercentage" as const, weight: 3 as const };
const LowWeightedOption = { type: "Low" as const, weight: 1 as const };
const MediumWeightedOption = { type: "Medium" as const, weight: 2 as const };
const HighWeightedOption = { type: "High" as const, weight: 3 as const };
const LowGeographicalSpread = { type: "WithinDistrict" as const, weight: 1 as const };
const MediumGeographicalSpread = { type: "MoretThanOneDistrict" as const, weight: 2 as const };
const HighGeographicalSpread = { type: "MoreThanOneProvince" as const, weight: 3 as const };
const LowCapacity = { type: "ProvincialNationalLevel" as const, weight: 1 as const };
const MediumCapacity = { type: "ProvincialLevel" as const, weight: 2 as const };
const HighCapacity = { type: "NationalInternationalLevel" as const, weight: 3 as const };

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
        const grade = riskAssessmentGrading.getGrade().getOrThrow();
        if (grade) expect(RiskAssessmentGrading.getTranslatedLabel(grade)).toBe("Grade 1");
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
        const grade = riskAssessmentGrading.getGrade().getOrThrow();
        if (grade) expect(RiskAssessmentGrading.getTranslatedLabel(grade)).toBe("Grade 2");
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

        const grade = riskAssessmentGrading.getGrade().getOrThrow();
        if (grade) expect(RiskAssessmentGrading.getTranslatedLabel(grade)).toBe("Grade 3");
    });
});
