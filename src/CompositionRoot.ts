import { UserTestRepository } from "./data/repositories/test/UserTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
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
import { OptionsTestRepository } from "./data/repositories/test/OptionsTestRepository";
import { TeamMemberTestRepository } from "./data/repositories/test/TeamMemberTestRepository";
import { OrgUnitTestRepository } from "./data/repositories/test/OrgUnitTestRepository";
import { GetAllEventTrackersUseCase } from "./domain/usecases/GetAllEventTrackersUseCase";
import { SaveEventTrackerUseCase } from "./domain/usecases/SaveEventTrackerUseCase";
import { EventTrackerRepository } from "./domain/repositories/EventTrackerRepository";
import { EventTrackerD2Repository } from "./data/repositories/EventTrackerD2Repository";
import { EventTrackerTestRepository } from "./data/repositories/test/EventTrackerTestRepository";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    eventTrackerRepository: EventTrackerRepository;
    optionsRepository: OptionsRepository;
    teamMemberRepository: TeamMemberRepository;
    orgUnitRepository: OrgUnitRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        diseaseOutbreakEvent: {
            get: new GetDiseaseOutbreakByIdUseCase(repositories),
            getAll: new GetAllEventTrackersUseCase(repositories.eventTrackerRepository),
            save: new SaveEventTrackerUseCase(repositories.eventTrackerRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        eventTrackerRepository: new EventTrackerD2Repository(api),
        optionsRepository: new OptionsD2Repository(api),
        teamMemberRepository: new TeamMemberD2Repository(api),
        orgUnitRepository: new OrgUnitD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        eventTrackerRepository: new EventTrackerTestRepository(),
        optionsRepository: new OptionsTestRepository(),
        teamMemberRepository: new TeamMemberTestRepository(),
        orgUnitRepository: new OrgUnitTestRepository(),
    };

    return getCompositionRoot(repositories);
}
