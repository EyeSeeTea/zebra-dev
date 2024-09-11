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
import { SaveDiseaseOutbreakUseCase } from "./domain/usecases/SaveDiseaseOutbreakUseCase";
import { GetDiseaseOutbreakWithOptionsUseCase } from "./domain/usecases/GetDiseaseOutbreakWithOptionsUseCase";
import { AnalyticsRepository } from "./domain/repositories/AnalyticsRepository";
import { GetAllProgramIndicatorsUseCase } from "./domain/usecases/GetAllProgramIndicatorsUseCase";
import { AnalyticsD2Repository } from "./data/repositories/AnalyticsD2Repository";
import { ProgramIndicatorsTestRepository } from "./data/repositories/test/ProgramIndicatorsTestRepository";
import { GetDiseasesTotalUseCase } from "./domain/usecases/GetDiseasesTotalUseCase";
import { MapConfigRepository } from "./domain/repositories/MapConfigRepository";
import { MapConfigD2Repository } from "./data/repositories/MapConfigD2Repository";
import { MapConfigTestRepository } from "./data/repositories/test/MapConfigTestRepository";
import { GetMapConfigUseCase } from "./domain/usecases/GetMapConfigUseCase";
import { MapDiseaseOutbreakToAlertsUseCase } from "./domain/usecases/MapDiseaseOutbreakToAlertsUseCase";
import { AlertRepository } from "./domain/repositories/AlertRepository";
import { AlertSyncRepository } from "./domain/repositories/AlertSyncRepository";
import { AlertSyncDataStoreRepository } from "./data/repositories/AlertSyncDataStoreRepository";
import { AlertSyncDataStoreTestRepository } from "./data/repositories/test/AlertSyncDataStoreTestRepository";
import { AlertTestRepository } from "./data/repositories/test/AlertTestRepository";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    alertRepository: AlertRepository;
    alertSyncRepository: AlertSyncRepository;
    optionsRepository: OptionsRepository;
    teamMemberRepository: TeamMemberRepository;
    orgUnitRepository: OrgUnitRepository;
    analytics: AnalyticsRepository;
    mapConfigRepository: MapConfigRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        diseaseOutbreakEvent: {
            get: new GetDiseaseOutbreakByIdUseCase(repositories),
            getWithOptions: new GetDiseaseOutbreakWithOptionsUseCase(repositories),
            getAll: new GetAllDiseaseOutbreaksUseCase(repositories.diseaseOutbreakEventRepository),
            save: new SaveDiseaseOutbreakUseCase(repositories.diseaseOutbreakEventRepository),
            mapDiseaseOutbreakEventToAlerts: new MapDiseaseOutbreakToAlertsUseCase(
                repositories.alertRepository,
                repositories.alertSyncRepository,
                repositories.optionsRepository
            ),
        },
        analytics: {
            getProgramIndicators: new GetAllProgramIndicatorsUseCase(repositories),
            getDiseasesTotal: new GetDiseasesTotalUseCase(repositories),
        },
        maps: {
            getConfig: new GetMapConfigUseCase(repositories.mapConfigRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventD2Repository(api),
        alertRepository: new AlertD2Repository(api),
        alertSyncRepository: new AlertSyncDataStoreRepository(api),
        optionsRepository: new OptionsD2Repository(api),
        teamMemberRepository: new TeamMemberD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
        analytics: new AnalyticsD2Repository(api),
        mapConfigRepository: new MapConfigD2Repository(api),
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
        analytics: new ProgramIndicatorsTestRepository(),
        mapConfigRepository: new MapConfigTestRepository(),
    };

    return getCompositionRoot(repositories);
}
