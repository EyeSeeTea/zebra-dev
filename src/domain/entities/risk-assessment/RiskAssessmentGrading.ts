import i18n from "@eyeseetea/feedback-component/locales";
import { Ref } from "../Ref";
import { Struct } from "../generic/Struct";
import { Either } from "../generic/Either";

type WeightedOptionTypes = "Low" | "Medium" | "High";
type PopulationWeightOptionsTypes = "LessPercentage" | "MediumPercentage" | "HighPercentage";
type GeographicalSpreadOptionsTypes =
    | "WithinDistrict"
    | "MoretThanOneDistrict"
    | "MoreThanOneProvince";
type CapacityOptionsTypes =
    | "ProvincialNationalLevel"
    | "ProvincialLevel"
    | "NationalInternationalLevel";

export type LowWeightedOption = {
    type: "Low";
    weight: 1;
};
export type MediumWeightedOption = {
    type: "Medium";
    weight: 2;
};
export type HighWeightedOption = {
    type: "High";
    weight: 3;
};

export type LowPopulationAtRisk = {
    type: "LessPercentage";
    weight: 1;
};
export type MediumPopulationAtRisk = {
    type: "MediumPercentage";
    weight: 2;
};
export type HighPopulationAtRisk = {
    type: "HighPercentage";
    weight: 3;
};

export type LowGeographicalSpread = {
    type: "WithinDistrict";
    weight: 1;
};
export type MediumGeographicalSpread = {
    type: "MoretThanOneDistrict";
    weight: 2;
};
export type HighGeographicalSpread = {
    type: "MoreThanOneProvince";
    weight: 3;
};

export type LowCapacity = {
    type: "ProvincialNationalLevel";
    weight: 1;
};
export type MediumCapacity = {
    type: "ProvincialLevel";
    weight: 2;
};
export type HighCapacity = {
    type: "NationalInternationalLevel";
    weight: 3;
};

export type Grade = "Grade1" | "Grade2" | "Grade3";

type AllOptionTypes =
    | WeightedOptionTypes
    | PopulationWeightOptionsTypes
    | GeographicalSpreadOptionsTypes
    | CapacityOptionsTypes
    | Grade;

const translations: Record<AllOptionTypes, string> = {
    Low: i18n.t("Low"),
    Medium: i18n.t("Medium"),
    High: i18n.t("High"),
    LessPercentage: i18n.t("Less than 0.1%"),
    MediumPercentage: i18n.t("Between 0.1% to 0.25%"),
    HighPercentage: i18n.t("Above 0.25%"),
    WithinDistrict: i18n.t("Within a district"),
    MoretThanOneDistrict: i18n.t("Within a province with more than one district affected"),
    MoreThanOneProvince: i18n.t(
        "More than one province affected with high threat of spread locally and internationally"
    ),
    ProvincialNationalLevel: i18n.t(
        "Available within the district with support from provincial and national level"
    ),
    ProvincialLevel: i18n.t(
        "Available within the province with minimal support from national level"
    ),
    NationalInternationalLevel: i18n.t(
        "Available at national with support required from international"
    ),
    Grade1: i18n.t("Grade 1"),
    Grade2: i18n.t("Grade 2"),
    Grade3: i18n.t("Grade 3"),
};

interface RiskAssessmentGradingAttrs extends Ref {
    lastUpdated: Date;
    populationAtRisk: LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk;
    attackRate: LowWeightedOption | MediumWeightedOption | HighWeightedOption;
    geographicalSpread: LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread;
    complexity: LowWeightedOption | MediumWeightedOption | HighWeightedOption;
    capacity: LowCapacity | MediumCapacity | HighCapacity;
    reputationalRisk: LowWeightedOption | MediumWeightedOption | HighWeightedOption;
    severity: LowWeightedOption | MediumWeightedOption | HighWeightedOption;
}

export class RiskAssessmentGrading extends Struct<RiskAssessmentGradingAttrs>() {
    private constructor(attrs: RiskAssessmentGradingAttrs) {
        super(attrs);
    }

    public static create(attrs: RiskAssessmentGradingAttrs): RiskAssessmentGrading {
        return new RiskAssessmentGrading(attrs);
    }

    public static getTranslatedLabel(key: AllOptionTypes): string {
        return translations[key];
    }

    getGrade(): Either<Error, Grade> {
        return this.calculateGrade();
    }

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
                ? "Grade1"
                : totalWeight > 7 && totalWeight <= 14
                ? "Grade2"
                : "Grade3";

        return Either.success(grade);
    }
}
