import {
    DiseaseOutbreakEventOptions,
    IncidentActionPlanOptions,
    IncidentManagementTeamRoleOptions,
    IncidentResponseActionOptions,
    RiskAssessmentQuestionnaireOptions,
    RiskAssessmentSummaryOptions,
} from "./ConfigurableForm";
import { Role } from "./incident-management-team/Role";
import { TeamMember } from "./incident-management-team/TeamMember";

import {
    LowPopulationAtRisk,
    MediumPopulationAtRisk,
    HighPopulationAtRisk,
    HighWeightedOption,
    LowWeightedOption,
    MediumWeightedOption,
    HighGeographicalSpread,
    LowGeographicalSpread,
    MediumGeographicalSpread,
    HighCapacity,
    LowCapacity,
    MediumCapacity,
    Capability1,
    Capability2,
} from "./risk-assessment/RiskAssessmentGrading";

export type SelectableOptions = {
    eventTrackerConfigurations: DiseaseOutbreakEventOptions;
    riskAssessmentGradingConfigurations: {
        populationAtRisk: Array<
            LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk
        >;
        lowMediumHigh: Array<LowWeightedOption | MediumWeightedOption | HighWeightedOption>;
        geographicalSpread: Array<
            LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread
        >;
        capacity: Array<LowCapacity | MediumCapacity | HighCapacity>;
        capability: Array<Capability1 | Capability2>;
    };
    riskAssessmentSummaryConfigurations: RiskAssessmentSummaryOptions;
    riskAssessmentQuestionnaireConfigurations: RiskAssessmentQuestionnaireOptions;
    incidentActionPlanConfigurations: IncidentActionPlanOptions;
    incidentResponseActionConfigurations: IncidentResponseActionOptions;
    incidentManagementTeamRoleConfigurations: IncidentManagementTeamRoleOptions;
};
export type Configurations = {
    selectableOptions: SelectableOptions;
    teamMembers: {
        all: TeamMember[];
        riskAssessors: TeamMember[];
        incidentManagers: TeamMember[];
    };
    roles: Role[];
};
