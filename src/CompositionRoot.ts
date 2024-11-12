import { DiseaseOutbreakEventD2Repository } from "./data/repositories/DiseaseOutbreakEventD2Repository";
import { UserTestRepository } from "./data/repositories/test/UserTestRepository";
import { DiseaseOutbreakEventTestRepository } from "./data/repositories/test/DiseaseOutbreakEventTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { DiseaseOutbreakEventRepository } from "./domain/repositories/DiseaseOutbreakEventRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetDiseaseOutbreakByIdUseCase } from "./domain/usecases/GetDiseaseOutbreakByIdUseCase";
import { D2Api } from "./types/d2-api";

import { TeamMemberRepository } from "./domain/repositories/TeamMemberRepository";
import { OrgUnitRepository } from "./domain/repositories/OrgUnitRepository";

import { TeamMemberD2Repository } from "./data/repositories/TeamMemberD2Repository";
import { OrgUnitD2Repository } from "./data/repositories/OrgUnitD2Repository";
import { AlertD2Repository } from "./data/repositories/AlertD2Repository";
import { TeamMemberTestRepository } from "./data/repositories/test/TeamMemberTestRepository";
import { OrgUnitTestRepository } from "./data/repositories/test/OrgUnitTestRepository";
import { GetAllDiseaseOutbreaksUseCase } from "./domain/usecases/GetAllDiseaseOutbreaksUseCase";
import { MapDiseaseOutbreakToAlertsUseCase } from "./domain/usecases/MapDiseaseOutbreakToAlertsUseCase";
import { AlertRepository } from "./domain/repositories/AlertRepository";
import { AlertTestRepository } from "./data/repositories/test/AlertTestRepository";
import { Get717PerformanceUseCase } from "./domain/usecases/Get717PerformanceUseCase";
import { GetConfigurableFormUseCase } from "./domain/usecases/GetConfigurableFormUseCase";
import { SaveEntityUseCase } from "./domain/usecases/SaveEntityUseCase";
import { RiskAssessmentRepository } from "./domain/repositories/RiskAssessmentRepository";
import { RiskAssessmentD2Repository } from "./data/repositories/RiskAssessmentD2Repository";
import { RiskAssessmentTestRepository } from "./data/repositories/test/RiskAssessmentTestRepository";
import { IncidentActionRepository } from "./domain/repositories/IncidentActionRepository";
import { IncidentActionD2Repository } from "./data/repositories/IncidentActionD2Repository";
import { IncidentActionTestRepository } from "./data/repositories/test/IncidentActionTestRepository";
import { MapConfigRepository } from "./domain/repositories/MapConfigRepository";
import { MapConfigD2Repository } from "./data/repositories/MapConfigD2Repository";
import { MapConfigTestRepository } from "./data/repositories/test/MapConfigTestRepository";
import { GetMapConfigUseCase } from "./domain/usecases/GetMapConfigUseCase";
import { GetProvincesOrgUnits } from "./domain/usecases/GetProvincesOrgUnits";
import { GetAllOrgUnitsUseCase } from "./domain/usecases/GetAllOrgUnitsUseCase";
import { PerformanceOverviewRepository } from "./domain/repositories/PerformanceOverviewRepository";
import { GetAllPerformanceOverviewMetricsUseCase } from "./domain/usecases/GetAllPerformanceOverviewMetricsUseCase";
import { PerformanceOverviewD2Repository } from "./data/repositories/PerformanceOverviewD2Repository";
import { PerformanceOverviewTestRepository } from "./data/repositories/test/PerformanceOverviewTestRepository";
import { AlertSyncDataStoreRepository } from "./data/repositories/AlertSyncDataStoreRepository";
import { AlertSyncDataStoreTestRepository } from "./data/repositories/test/AlertSyncDataStoreTestRepository";
import { AlertSyncRepository } from "./domain/repositories/AlertSyncRepository";
import { DataStoreClient } from "./data/DataStoreClient";
import { GetTotalCardCountsUseCase } from "./domain/usecases/GetTotalCardCountsUseCase";
import { GetIncidentActionByIdUseCase } from "./domain/usecases/GetIncidentActionByIdUseCase";
import { UpdateIncidentResponseActionUseCase } from "./domain/usecases/UpdateIncidentResponseActionUseCase";
import { RoleRepository } from "./domain/repositories/RoleRepository";
import { RoleD2Repository } from "./data/repositories/RoleD2Repository";
import { RoleTestRepository } from "./data/repositories/test/RoleTestRepository";
import { IncidentManagementTeamTestRepository } from "./data/repositories/test/IncidentManagementTeamTestRepository";
import { IncidentManagementTeamD2Repository } from "./data/repositories/IncidentManagementTeamD2Repository";
import { IncidentManagementTeamRepository } from "./domain/repositories/IncidentManagementTeamRepository";
import { GetIncidentManagementTeamByIdUseCase } from "./domain/usecases/GetIncidentManagementTeamByIdUseCase";
import { DeleteIncidentManagementTeamMemberRolesUseCase } from "./domain/usecases/DeleteIncidentManagementTeamMemberRolesUseCase";
import { ChartConfigRepository } from "./domain/repositories/ChartConfigRepository";
import { GetChartConfigByTypeUseCase } from "./domain/usecases/GetChartConfigByTypeUseCase";
import { ChartConfigTestRepository } from "./data/repositories/test/ChartConfigTestRepository";
import { ChartConfigD2Repository } from "./data/repositories/ChartConfigD2Repository";
import { GetAnalyticsRuntimeUseCase } from "./domain/usecases/GetAnalyticsRuntimeUseCase";
import { SystemRepository } from "./domain/repositories/SystemRepository";
import { SystemD2Repository } from "./data/repositories/SystemD2Repository";
import { SystemTestRepository } from "./data/repositories/test/SystemTestRepository";
import { GetOverviewCardsUseCase } from "./domain/usecases/GetOverviewCardsUseCase";
import { GetConfigurationsUseCase } from "./domain/usecases/GetConfigurationsUseCase";
import { ConfigurationsRepository } from "./domain/repositories/ConfigurationsRepository";
import { ConfigurationsD2Repository } from "./data/repositories/ConfigurationsD2Repository";
import { ConfigurationsTestRepository } from "./data/repositories/test/ConfigurationsTestRepository";
import { CompleteEventTrackerUseCase } from "./domain/usecases/CompleteEventTrackerUseCase";
import { UserGroupD2Repository } from "./data/repositories/UserGroupD2Repository";
import { UserGroupRepository } from "./domain/repositories/UserGroupRepository";
import { UserGroupTestRepository } from "./data/repositories/test/UserGroupTestRepository";
import { GetUserGroupByCodeUseCase } from "./domain/usecases/GetUserGroupByCodeUseCase";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    alertRepository: AlertRepository;
    alertSyncRepository: AlertSyncRepository;
    teamMemberRepository: TeamMemberRepository;
    orgUnitRepository: OrgUnitRepository;
    riskAssessmentRepository: RiskAssessmentRepository;
    incidentActionRepository: IncidentActionRepository;
    mapConfigRepository: MapConfigRepository;
    performanceOverviewRepository: PerformanceOverviewRepository;
    roleRepository: RoleRepository;
    incidentManagementTeamRepository: IncidentManagementTeamRepository;
    chartConfigRepository: ChartConfigRepository;
    systemRepository: SystemRepository;
    configurationsRepository: ConfigurationsRepository;
    userGroupRepository: UserGroupRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        getConfigurableForm: new GetConfigurableFormUseCase(repositories),
        save: new SaveEntityUseCase(repositories),
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        diseaseOutbreakEvent: {
            get: new GetDiseaseOutbreakByIdUseCase(repositories),
            getAll: new GetAllDiseaseOutbreaksUseCase(repositories.diseaseOutbreakEventRepository),
            mapDiseaseOutbreakEventToAlerts: new MapDiseaseOutbreakToAlertsUseCase(
                repositories.alertRepository,
                repositories.alertSyncRepository
            ),
            getConfigurations: new GetConfigurationsUseCase(
                repositories.configurationsRepository,
                repositories.teamMemberRepository
            ),
            complete: new CompleteEventTrackerUseCase(repositories),
        },
        incidentActionPlan: {
            get: new GetIncidentActionByIdUseCase(repositories),
            updateResponseAction: new UpdateIncidentResponseActionUseCase(repositories),
        },
        incidentManagementTeam: {
            get: new GetIncidentManagementTeamByIdUseCase(repositories),
            deleteIncidentManagementTeamMemberRoles:
                new DeleteIncidentManagementTeamMemberRolesUseCase(repositories),
        },
        performanceOverview: {
            getPerformanceOverviewMetrics: new GetAllPerformanceOverviewMetricsUseCase(
                repositories
            ),
            getTotalCardCounts: new GetTotalCardCountsUseCase(repositories),
            get717Performance: new Get717PerformanceUseCase(repositories),
            getAnalyticsRuntime: new GetAnalyticsRuntimeUseCase(repositories),
            getOverviewCards: new GetOverviewCardsUseCase(
                repositories.performanceOverviewRepository
            ),
        },
        maps: {
            getConfig: new GetMapConfigUseCase(repositories.mapConfigRepository),
        },
        orgUnits: {
            getAll: new GetAllOrgUnitsUseCase(repositories.orgUnitRepository),
            getProvinces: new GetProvincesOrgUnits(repositories.orgUnitRepository),
        },
        charts: {
            getCases: new GetChartConfigByTypeUseCase(repositories.chartConfigRepository),
        },
        userGroup: {
            getByCode: new GetUserGroupByCodeUseCase(repositories.userGroupRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const dataStoreClient = new DataStoreClient(api);
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api, dataStoreClient),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventD2Repository(api),
        alertRepository: new AlertD2Repository(api),
        alertSyncRepository: new AlertSyncDataStoreRepository(api),
        teamMemberRepository: new TeamMemberD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
        riskAssessmentRepository: new RiskAssessmentD2Repository(api),
        incidentActionRepository: new IncidentActionD2Repository(api),
        mapConfigRepository: new MapConfigD2Repository(api),
        performanceOverviewRepository: new PerformanceOverviewD2Repository(api, dataStoreClient),
        roleRepository: new RoleD2Repository(api),
        incidentManagementTeamRepository: new IncidentManagementTeamD2Repository(api),
        chartConfigRepository: new ChartConfigD2Repository(dataStoreClient),
        systemRepository: new SystemD2Repository(api),
        configurationsRepository: new ConfigurationsD2Repository(api),
        userGroupRepository: new UserGroupD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventTestRepository(),
        alertRepository: new AlertTestRepository(),
        alertSyncRepository: new AlertSyncDataStoreTestRepository(),
        teamMemberRepository: new TeamMemberTestRepository(),
        orgUnitRepository: new OrgUnitTestRepository(),
        riskAssessmentRepository: new RiskAssessmentTestRepository(),
        incidentActionRepository: new IncidentActionTestRepository(),
        mapConfigRepository: new MapConfigTestRepository(),
        performanceOverviewRepository: new PerformanceOverviewTestRepository(),
        roleRepository: new RoleTestRepository(),
        incidentManagementTeamRepository: new IncidentManagementTeamTestRepository(),
        chartConfigRepository: new ChartConfigTestRepository(),
        systemRepository: new SystemTestRepository(),
        configurationsRepository: new ConfigurationsTestRepository(),
        userGroupRepository: new UserGroupTestRepository(),
    };

    return getCompositionRoot(repositories);
}
