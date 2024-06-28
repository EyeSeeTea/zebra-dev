import i18n from "@eyeseetea/feedback-component/locales";
import { Ref } from "../Ref";
import { Struct } from "../generic/Struct";
import { Either } from "../generic/Either";

type WeightedOptions = {
    label: "Low" | "Medium" | "High";
    weight: 1 | 2 | 3;
};
export const LowWeightedOption: WeightedOptions = {
    label: "Low",
    weight: 1,
};
export const MediumWeightedOption: WeightedOptions = {
    label: "Medium",
    weight: 2,
};
export const HighWeightedOption: WeightedOptions = {
    label: "High",
    weight: 3,
};

type PopulationWeightOptions = {
    label: "Less than 0.1%" | "Between 0.1% to 0.25%" | "Above 0.25%";
    weight: 1 | 2 | 3;
};

export const LowPopulationAtRisk: PopulationWeightOptions = {
    label: "Less than 0.1%",
    weight: 1,
};
export const MediumPopulationAtRisk: PopulationWeightOptions = {
    label: "Between 0.1% to 0.25%",
    weight: 2,
};
export const HighPopulationAtRisk: PopulationWeightOptions = {
    label: "Above 0.25%",
    weight: 3,
};

type GeographicalSpreadOptions = {
    label:
        | "Within a district"
        | "Within a province with more than one district affected"
        | "More than one province affected with high threat of spread locally and internationally";
    weight: 1 | 2 | 3;
};

export const LowGeographicalSpread: GeographicalSpreadOptions = {
    label: "Within a district",
    weight: 1,
};
export const MediumGeographicalSpread: GeographicalSpreadOptions = {
    label: "Within a province with more than one district affected",
    weight: 2,
};
export const HighGeographicalSpread: GeographicalSpreadOptions = {
    label: "More than one province affected with high threat of spread locally and internationally",
    weight: 3,
};

type CapacityOptions = {
    label:
        | "Available within the district with support from provincial and national level"
        | "Available within the province with minimal support from national level"
        | "Available at national with support required from international";
    weight: 1 | 2 | 3;
};

export const LowCapacity: CapacityOptions = {
    label: "Available within the district with support from provincial and national level",
    weight: 1,
};
export const MediumCapacity: CapacityOptions = {
    label: "Available within the province with minimal support from national level",
    weight: 2,
};
export const HighCapacity: CapacityOptions = {
    label: "Available at national with support required from international",
    weight: 3,
};

export type Grade = "Grade 1" | "Grade 2" | "Grade 3";

interface RiskAssessmentGradingAttrs extends Ref {
    lastUpdated: Date;
    populationAtRisk: PopulationWeightOptions;
    attackRate: WeightedOptions;
    geographicalSpread: GeographicalSpreadOptions;
    complexity: WeightedOptions;
    capacity: CapacityOptions;
    reputationalRisk: WeightedOptions;
    severity: WeightedOptions;
}

export class RiskAssessmentGrading extends Struct<RiskAssessmentGradingAttrs>() {
    private constructor(attrs: RiskAssessmentGradingAttrs) {
        super(attrs);
    }

    public static create(attrs: RiskAssessmentGradingAttrs): RiskAssessmentGrading {
        return new RiskAssessmentGrading(attrs);
    }

    getGrade = (): Either<Error, Grade> => {
        return this.calculateGrade();
    };

    calculateGrade(): Either<Error, Grade> {
        const totalWeight =
            this.populationAtRisk.weight +
            this.attackRate.weight +
            this.geographicalSpread.weight +
            this.complexity.weight +
            this.capacity.weight +
            this.reputationalRisk.weight +
            this.severity.weight;

        if (totalWeight > 21) return Either.error(new Error(i18n.t("Invalid grade")));

        const grade: Grade =
            totalWeight <= 7
                ? "Grade 1"
                : totalWeight > 7 && totalWeight <= 14
                ? "Grade 2"
                : "Grade 3";

        return Either.success(grade);
    }
}
