import { SelectableOptions } from "../../../domain/entities/AppConfigurations";
import { Future } from "../../../domain/entities/generic/Future";
import { ConfigurationsRepository } from "../../../domain/repositories/ConfigurationsRepository";
import { FutureData } from "../../api-futures";

export class ConfigurationsTestRepository implements ConfigurationsRepository {
    getSelectableOptions(): FutureData<SelectableOptions> {
        return Future.success({
            eventTrackerConfigurations: {
                dataSources: [],
                suspectedDiseases: [],
                mainSyndromes: [],
                notificationSources: [],
                incidentManagers: [],
                incidentStatus: [],
                casesDataSource: [],
            },
            alertOptions: {
                alertDataSources: [],
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
