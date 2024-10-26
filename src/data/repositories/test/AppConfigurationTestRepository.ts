import { AppConfigurations } from "../../../domain/entities/AppConfigurations";
import { Future } from "../../../domain/entities/generic/Future";
import { AppConfigurationRepository } from "../../../domain/repositories/AppConfigurationRepository";
import { FutureData } from "../../api-futures";

export class AppConfigurationTestRepository implements AppConfigurationRepository {
    getAppConfigurations(): FutureData<AppConfigurations> {
        return Future.success({
            eventTrackerConfigurations: {
                dataSources: [],
                hazardTypes: [],
                hazardTypesByCode: [],
                suspectedDiseases: [],
                mainSyndromes: [],
                notificationSources: [],
                incidentManagers: [],
                incidentStatus: [],
            },
            riskAssessmentGradingConfigurations: {
                geographicalSpread: [],
                capability: [],
                capacity: [],
                lowMediumHigh: [],
                populationAtRisk: [],
            },
            riskAssessmentSummaryConfigurations: {
                overAllConfidencGlobal: [],
                overAllConfidencNational: [],
                overAllConfidencRegional: [],
                overallRiskGlobal: [],
                overallRiskNational: [],
                overallRiskRegional: [],
                riskAssessors: [],
            },
            riskAssessmentQuestionnaireConfigurations: {
                likelihood: [],
                consequences: [],
                risk: [],
            },
            incidentActionPlanConfigurations: {
                iapType: [],
                phoecLevel: [],
            },
            incidentResponseActionConfigurations: {
                searchAssignRO: [],
                status: [],
                verification: [],
            },
        });
    }
}
