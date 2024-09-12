import i18n from "@eyeseetea/feedback-component/locales";
import { Code, Ref } from "../Ref";
import { Struct } from "../generic/Struct";
import { Either } from "../generic/Either";
import { Maybe } from "../../../utils/ts-utils";

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
type CapabilityOptionsTypes = "Capability1" | "Capability2";

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

export type Capability1 = {
    type: "Capability1";
    weight: 1;
};
export type Capability2 = {
    type: "Capability2";
    weight: 2;
};

export type Grade = "Grade1" | "Grade2" | "Grade3";

export type AllOptionTypes =
    | WeightedOptionTypes
    | PopulationWeightOptionsTypes
    | GeographicalSpreadOptionsTypes
    | CapacityOptionsTypes
    | CapabilityOptionsTypes
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
    Capability1: i18n.t("Capability 1"),
    Capability2: i18n.t("Capability 2"),
    Grade1: i18n.t("Grade 1"),
    Grade2: i18n.t("Grade 2"),
    Grade3: i18n.t("Grade 3"),
};

export interface RiskAssessmentGradingAttrs extends Ref {
    lastUpdated: Date;
    populationAtRisk: LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk;
    attackRate: LowWeightedOption | MediumWeightedOption | HighWeightedOption;
    geographicalSpread: LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread;
    complexity: LowWeightedOption | MediumWeightedOption | HighWeightedOption;
    capacity: LowCapacity | MediumCapacity | HighCapacity;
    capability: Capability1 | Capability2;
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
    public static getOptionTypeByCodePopulation(
        code: Maybe<Code>
    ): LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk {
        switch (code) {
            case "RTSL_ZEB_OS_POPULATION_AT_RISK_1":
                return {
                    type: "LessPercentage",
                    weight: 1,
                };
            case "RTSL_ZEB_OS_POPULATION_AT_RISK_2":
                return {
                    type: "MediumPercentage",
                    weight: 2,
                };
            case "RTSL_ZEB_OS_POPULATION_AT_RISK_3":
                return {
                    type: "HighPercentage",
                    weight: 3,
                };
            default:
                throw new Error("Invalid code");
        }
    }

    public static getOptionTypeByCodeWeighted(
        code: Maybe<Code>
    ): LowWeightedOption | MediumWeightedOption | HighWeightedOption {
        switch (code) {
            case "RTSL_ZEB_OS_LMH_LOW":
                return {
                    type: "Low",
                    weight: 1,
                };
            case "RTSL_ZEB_OS_LMH_MEDIUM":
                return {
                    type: "Medium",
                    weight: 2,
                };
            case "RTSL_ZEB_OS_LMH_HIGH":
                return {
                    type: "High",
                    weight: 3,
                };
            default:
                throw new Error("Invalid code");
        }
    }

    public static getOptionTypeByCodeGeographicalSpread(
        code: Maybe<Code>
    ): LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread {
        switch (code) {
            case "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_1":
                return {
                    type: "WithinDistrict",
                    weight: 1,
                };
            case "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_2":
                return {
                    type: "MoretThanOneDistrict",
                    weight: 2,
                };
            case "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD_3":
                return {
                    type: "MoreThanOneProvince",
                    weight: 3,
                };
            default:
                throw new Error("Invalid code");
        }
    }

    public static getOptionTypeByCodeCapacity(
        code: Maybe<Code>
    ): LowCapacity | MediumCapacity | HighCapacity {
        switch (code) {
            case "RTSL_ZEB_OS_CAPACITY_1":
                return {
                    type: "ProvincialNationalLevel",
                    weight: 1,
                };
            case "RTSL_ZEB_OS_CAPACITY_2":
                return {
                    type: "ProvincialLevel",
                    weight: 2,
                };
            case "RTSL_ZEB_OS_CAPACITY_3":
                return {
                    type: "NationalInternationalLevel",
                    weight: 3,
                };
            default:
                throw new Error("Invalid code");
        }
    }

    public static getOptionTypeByCodeCapability(code: Maybe<Code>): Capability1 | Capability2 {
        switch (code) {
            case "RTSL_ZEB_OS_CAPABILITY_1":
                return {
                    type: "Capability1",
                    weight: 1,
                };
            case "RTSL_ZEB_OS_CAPABILITY_2":
                return {
                    type: "Capability2",
                    weight: 2,
                };
            default:
                throw new Error("Invalid code");
        }
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
