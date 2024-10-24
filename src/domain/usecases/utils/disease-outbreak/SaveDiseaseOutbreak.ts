import { FutureData } from "../../../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { DiseaseOutbreakEventBaseAttrs } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { TeamMember, TeamRole } from "../../../entities/incident-management-team/TeamMember";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function saveDiseaseOutbreak(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        teamMemberRepository: TeamMemberRepository;
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
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs
): FutureData<Id> {
    return repositories.teamMemberRepository.getAll().flatMap(teamMembers => {
        return repositories.diseaseOutbreakEventRepository
            .getIncidentManagementTeam(diseaseOutbreakEventBaseAttrs.id, teamMembers)
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
                        teamMembers
                    );
                } else {
                    return createNewIncidentManager(
                        repositories,
                        diseaseOutbreakEventBaseAttrs,
                        teamMembers
                    );
                }
            });
    });
}

function changeIncidentManager(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    oldIncidentManager: TeamMember,
    oldIncidentManagerTeamRole: TeamRole,
    teamMembers: TeamMember[]
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
            diseaseOutbreakId: diseaseOutbreakEventBaseAttrs.id,
            roleId: INCIDENT_MANAGER_ROLE,
            reportsToUsername: undefined,
        };

        return repositories.diseaseOutbreakEventRepository
            .deleteIncidentManagementTeamMemberRole(
                diseaseOutbreakEventBaseAttrs.id,
                oldIncidentManagerTeamRole.id
            )
            .flatMap(() => {
                return repositories.diseaseOutbreakEventRepository
                    .saveIncidentManagementTeamMemberRole(
                        newIncidentManagerTeamRole,
                        newIncidentManager,
                        diseaseOutbreakEventBaseAttrs.id
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
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    teamMembers: TeamMember[]
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
        diseaseOutbreakId: diseaseOutbreakEventBaseAttrs.id,
        roleId: INCIDENT_MANAGER_ROLE,
        reportsToUsername: undefined,
    };
    return repositories.diseaseOutbreakEventRepository
        .saveIncidentManagementTeamMemberRole(
            incidentManagerTeamRole,
            newIncidentManager,
            diseaseOutbreakEventBaseAttrs.id
        )
        .flatMap(() => Future.success(diseaseOutbreakEventBaseAttrs.id));
}
