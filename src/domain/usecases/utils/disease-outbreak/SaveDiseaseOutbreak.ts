import { FutureData } from "../../../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { DiseaseOutbreakEventBaseAttrs } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Role } from "../../../entities/incident-management-team/Role";
import { TeamMember, TeamRole } from "../../../entities/incident-management-team/TeamMember";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { IncidentManagementTeamRepository } from "../../../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../../../repositories/RoleRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function saveDiseaseOutbreak(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
        roleRepository: RoleRepository;
    },
    diseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs
): FutureData<Id> {
    return repositories.diseaseOutbreakEventRepository
        .save(diseaseOutbreakEvent)
        .flatMap((diseaseOutbreakId: Id) => {
            const diseaseOutbreakEventWithId = { ...diseaseOutbreakEvent, id: diseaseOutbreakId };
            return saveIncidentManagerTeamMemberRole(repositories, diseaseOutbreakEventWithId);
        });
}

function saveIncidentManagerTeamMemberRole(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
        roleRepository: RoleRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs
): FutureData<Id> {
    return Future.joinObj({
        roles: repositories.roleRepository.getAll(),
        teamMembers: repositories.teamMemberRepository.getAll(),
    }).flatMap(({ roles, teamMembers }) => {
        return repositories.incidentManagementTeamRepository
            .get(diseaseOutbreakEventBaseAttrs.id, teamMembers, roles)
            .flatMap(incidentManagementTeam => {
                const incidentManagerTeamMemberFound = incidentManagementTeam?.teamHierarchy?.find(
                    teamMember =>
                        teamMember.teamRoles?.some(
                            teamRole => teamRole.roleId === INCIDENT_MANAGER_ROLE
                        )
                );

                const incidentManagerTeamRole = incidentManagerTeamMemberFound?.teamRoles?.find(
                    teamRole => teamRole.roleId === INCIDENT_MANAGER_ROLE
                );

                if (
                    incidentManagerTeamMemberFound &&
                    incidentManagerTeamMemberFound.username !==
                        diseaseOutbreakEventBaseAttrs.incidentManagerName &&
                    incidentManagerTeamRole
                ) {
                    return changeIncidentManager(
                        repositories,
                        diseaseOutbreakEventBaseAttrs,
                        incidentManagerTeamMemberFound,
                        incidentManagerTeamRole,
                        teamMembers,
                        roles
                    );
                } else {
                    return createNewIncidentManager(
                        repositories,
                        diseaseOutbreakEventBaseAttrs,
                        teamMembers,
                        roles
                    );
                }
            });
    });
}

function changeIncidentManager(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    oldIncidentManager: TeamMember,
    oldIncidentManagerTeamRole: TeamRole,
    teamMembers: TeamMember[],
    roles: Role[]
): FutureData<Id> {
    if (oldIncidentManager.username !== diseaseOutbreakEventBaseAttrs.incidentManagerName) {
        const newIncidentManager = teamMembers.find(
            teamMember => teamMember.username === diseaseOutbreakEventBaseAttrs.incidentManagerName
        );

        if (!newIncidentManager) {
            return Future.error(
                new Error(
                    `Incident manager with username ${diseaseOutbreakEventBaseAttrs.incidentManagerName} not found`
                )
            );
        }

        const newIncidentManagerTeamRole: TeamRole = {
            id: "",
            name: "",
            roleId: INCIDENT_MANAGER_ROLE,
            reportsToUsername: undefined,
        };

        return repositories.incidentManagementTeamRepository
            .deleteIncidentManagementTeamMemberRole(
                oldIncidentManagerTeamRole,
                oldIncidentManager,
                diseaseOutbreakEventBaseAttrs.id,
                roles
            )
            .flatMap(() => {
                return repositories.incidentManagementTeamRepository
                    .saveIncidentManagementTeamMemberRole(
                        newIncidentManagerTeamRole,
                        newIncidentManager,
                        diseaseOutbreakEventBaseAttrs.id,
                        roles
                    )
                    .flatMap(() => Future.success(diseaseOutbreakEventBaseAttrs.id));
            });
    } else {
        return Future.success(diseaseOutbreakEventBaseAttrs.id);
    }
}

function createNewIncidentManager(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    teamMembers: TeamMember[],
    roles: Role[]
): FutureData<Id> {
    const newIncidentManager = teamMembers.find(
        teamMember => teamMember.username === diseaseOutbreakEventBaseAttrs.incidentManagerName
    );

    if (!newIncidentManager) {
        return Future.error(
            new Error(
                `Incident manager with username ${diseaseOutbreakEventBaseAttrs.incidentManagerName} not found`
            )
        );
    }

    const incidentManagerTeamRole: TeamRole = {
        id: "",
        name: "",
        roleId: INCIDENT_MANAGER_ROLE,
        reportsToUsername: undefined,
    };
    return repositories.incidentManagementTeamRepository
        .saveIncidentManagementTeamMemberRole(
            incidentManagerTeamRole,
            newIncidentManager,
            diseaseOutbreakEventBaseAttrs.id,
            roles
        )
        .flatMap(() => Future.success(diseaseOutbreakEventBaseAttrs.id));
}
