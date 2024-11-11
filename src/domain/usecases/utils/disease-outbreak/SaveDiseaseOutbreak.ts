import { FutureData } from "../../../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { Configurations } from "../../../entities/AppConfigurations";
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
    diseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs,
    configurations: Configurations
): FutureData<Id> {
    return repositories.diseaseOutbreakEventRepository
        .save(diseaseOutbreakEvent)
        .flatMap((diseaseOutbreakId: Id) => {
            const diseaseOutbreakEventWithId = { ...diseaseOutbreakEvent, id: diseaseOutbreakId };
            return saveIncidentManagerTeamMemberRole(
                repositories,
                diseaseOutbreakEventWithId,
                configurations
            );
        });
}

function saveIncidentManagerTeamMemberRole(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        roleRepository: RoleRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    configurations: Configurations
): FutureData<Id> {
    return repositories.roleRepository.getAll().flatMap(roles => {
        const teamMembers = configurations.teamMembers.all;
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

                if (!incidentManagerTeamMemberFound) {
                    return createNewIncidentManager(
                        repositories,
                        diseaseOutbreakEventBaseAttrs,
                        teamMembers,
                        roles
                    );
                } else if (
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
                    return Future.success(diseaseOutbreakEventBaseAttrs.id);
                }
            });
    });
}

function changeIncidentManager(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
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
            .deleteIncidentManagementTeamMemberRoles(diseaseOutbreakEventBaseAttrs.id, [
                oldIncidentManagerTeamRole.id,
            ])
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
