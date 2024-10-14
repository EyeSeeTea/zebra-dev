import { DiseaseOutbreakEventD2Repository } from "./data/repositories/DiseaseOutbreakEventD2Repository";
import { UserTestRepository } from "./data/repositories/test/UserTestRepository";
import { DiseaseOutbreakEventTestRepository } from "./data/repositories/test/DiseaseOutbreakEventTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { DiseaseOutbreakEventRepository } from "./domain/repositories/DiseaseOutbreakEventRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetDiseaseOutbreakByIdUseCase } from "./domain/usecases/GetDiseaseOutbreakByIdUseCase";
import { D2Api } from "./types/d2-api";
import { OptionsRepository } from "./domain/repositories/OptionsRepository";
import { TeamMemberRepository } from "./domain/repositories/TeamMemberRepository";
import { OrgUnitRepository } from "./domain/repositories/OrgUnitRepository";
import { OptionsD2Repository } from "./data/repositories/OptionsD2Repository";
import { TeamMemberD2Repository } from "./data/repositories/TeamMemberD2Repository";
import { OrgUnitD2Repository } from "./data/repositories/OrgUnitD2Repository";
import { AlertD2Repository } from "./data/repositories/AlertD2Repository";
import { OptionsTestRepository } from "./data/repositories/test/OptionsTestRepository";
import { TeamMemberTestRepository } from "./data/repositories/test/TeamMemberTestRepository";
import { OrgUnitTestRepository } from "./data/repositories/test/OrgUnitTestRepository";
import { GetAllDiseaseOutbreaksUseCase } from "./domain/usecases/GetAllDiseaseOutbreaksUseCase";
import { MapDiseaseOutbreakToAlertsUseCase } from "./domain/usecases/MapDiseaseOutbreakToAlertsUseCase";
import { AlertRepository } from "./domain/repositories/AlertRepository";
import { AlertTestRepository } from "./data/repositories/test/AlertTestRepository";
import { GetEntityWithOptionsUseCase } from "./domain/usecases/GetEntityWithOptionsUseCase";
import { SaveEntityUseCase } from "./domain/usecases/SaveEntityUseCase";
import { RiskAssessmentRepository } from "./domain/repositories/RiskAssessmentRepository";
import { RiskAssessmentD2Repository } from "./data/repositories/RiskAssessmentD2Repository";
import { RiskAssessmentTestRepository } from "./data/repositories/test/RiskAssessmentTestRepository";
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

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    alertRepository: AlertRepository;
    alertSyncRepository: AlertSyncRepository;
    optionsRepository: OptionsRepository;
    teamMemberRepository: TeamMemberRepository;
    orgUnitRepository: OrgUnitRepository;
    riskAssessmentRepository: RiskAssessmentRepository;
    mapConfigRepository: MapConfigRepository;
    performanceOverviewRepository: PerformanceOverviewRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        getWithOptions: new GetEntityWithOptionsUseCase(repositories),
        save: new SaveEntityUseCase(
            repositories.diseaseOutbreakEventRepository,
            repositories.riskAssessmentRepository
        ),
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        diseaseOutbreakEvent: {
            get: new GetDiseaseOutbreakByIdUseCase(repositories),
            getAll: new GetAllDiseaseOutbreaksUseCase(repositories.diseaseOutbreakEventRepository),
            mapDiseaseOutbreakEventToAlerts: new MapDiseaseOutbreakToAlertsUseCase(
                repositories.alertRepository,
                repositories.alertSyncRepository,
                repositories.optionsRepository
            ),
        },
        performanceOverview: {
            getPerformanceOverviewMetrics: new GetAllPerformanceOverviewMetricsUseCase(
                repositories
            ),
            getTotalCardCounts: new GetTotalCardCountsUseCase(repositories),
        },
        maps: {
            getConfig: new GetMapConfigUseCase(repositories.mapConfigRepository),
        },
        orgUnits: {
            getAll: new GetAllOrgUnitsUseCase(repositories.orgUnitRepository),
            getProvinces: new GetProvincesOrgUnits(repositories.orgUnitRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const dataStoreClient = new DataStoreClient(api);
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventD2Repository(api),
        alertRepository: new AlertD2Repository(api),
        alertSyncRepository: new AlertSyncDataStoreRepository(api),
        optionsRepository: new OptionsD2Repository(api),
        teamMemberRepository: new TeamMemberD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
        riskAssessmentRepository: new RiskAssessmentD2Repository(api),
        mapConfigRepository: new MapConfigD2Repository(api),
        performanceOverviewRepository: new PerformanceOverviewD2Repository(api, dataStoreClient),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventTestRepository(),
        alertRepository: new AlertTestRepository(),
        alertSyncRepository: new AlertSyncDataStoreTestRepository(),
        optionsRepository: new OptionsTestRepository(),
        teamMemberRepository: new TeamMemberTestRepository(),
        orgUnitRepository: new OrgUnitTestRepository(),
        riskAssessmentRepository: new RiskAssessmentTestRepository(),
        mapConfigRepository: new MapConfigTestRepository(),
        performanceOverviewRepository: new PerformanceOverviewTestRepository(),
    };

    return getCompositionRoot(repositories);
}
