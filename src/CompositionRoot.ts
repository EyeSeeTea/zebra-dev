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
import { RiskAssessmentGradingRepository } from "./domain/repositories/RiskAssessmentGradingRepository";
import { RiskAssessmentGradingD2Repository } from "./data/repositories/RiskAssessmentGradingD2Repository";
import { RiskAssessmentGradingTestRepository } from "./data/repositories/test/RiskAssessmentGradingTestRepository";
import { RiskAssessmentRepository } from "./domain/repositories/RiskAssessmentRepository";
import { RiskAssessmentD2Repository } from "./data/repositories/RiskAssessmentD2Repository";
import { RiskAssessmentTestRepository } from "./data/repositories/test/RiskAssessmentTestRepository";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    alertRepository: AlertRepository;
    optionsRepository: OptionsRepository;
    teamMemberRepository: TeamMemberRepository;
    orgUnitRepository: OrgUnitRepository;
    riskAssessmentGradingsRepository: RiskAssessmentGradingRepository;
    riskAssessmentRepository: RiskAssessmentRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        getWithOptions: new GetEntityWithOptionsUseCase(repositories),
        save: new SaveEntityUseCase(
            repositories.diseaseOutbreakEventRepository,
            repositories.riskAssessmentGradingsRepository
        ),
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        diseaseOutbreakEvent: {
            get: new GetDiseaseOutbreakByIdUseCase(repositories),

            getAll: new GetAllDiseaseOutbreaksUseCase(repositories.diseaseOutbreakEventRepository),

            mapDiseaseOutbreakEventToAlerts: new MapDiseaseOutbreakToAlertsUseCase(
                repositories.alertRepository
            ),
        },
        riskAssessment: {},
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventD2Repository(api),
        alertRepository: new AlertD2Repository(api),
        optionsRepository: new OptionsD2Repository(api),
        teamMemberRepository: new TeamMemberD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
        riskAssessmentGradingsRepository: new RiskAssessmentGradingD2Repository(api),
        riskAssessmentRepository: new RiskAssessmentD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        diseaseOutbreakEventRepository: new DiseaseOutbreakEventTestRepository(),
        alertRepository: new AlertTestRepository(),
        optionsRepository: new OptionsTestRepository(),
        teamMemberRepository: new TeamMemberTestRepository(),
        orgUnitRepository: new OrgUnitTestRepository(),
        riskAssessmentGradingsRepository: new RiskAssessmentGradingTestRepository(),
        riskAssessmentRepository: new RiskAssessmentTestRepository(),
    };

    return getCompositionRoot(repositories);
}
