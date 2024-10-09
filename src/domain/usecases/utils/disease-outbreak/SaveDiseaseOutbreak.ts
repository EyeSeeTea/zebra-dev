import { FutureData } from "../../../../data/api-futures";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { DiseaseOutbreakEventBaseAttrs } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { TeamMember, TeamRole } from "../../../entities/incident-management-team/TeamMember";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { IncidentManagementTeamRepository } from "../../../repositories/IncidentManagementTeamRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function saveDiseaseOutbreak(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs
): FutureData<Id> {
    return repositories.diseaseOutbreakEventRepository
        .save(diseaseOutbreakEventBaseAttrs)
        .flatMap(() => {
            return saveIncidentManagerTeamMemberRole(repositories, diseaseOutbreakEventBaseAttrs);
        });
}

function saveIncidentManagerTeamMemberRole(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs
): FutureData<Id> {
    return repositories.teamMemberRepository.getAll().flatMap(teamMembers => {
        return repositories.incidentManagementTeamRepository
            .get(diseaseOutbreakEventBaseAttrs.id, teamMembers)
            .flatMap(incidentManagementTeam => {
                const incidentManagerTeamMemberFound = incidentManagementTeam?.teamHierarchy?.find(
                    teamMember =>
                        teamMember.teamRoles?.some(
                            teamRole =>
                                teamRole.roleId ===
                                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole
                        )
                );

                const incidentManagerTeamRole = incidentManagerTeamMemberFound?.teamRoles?.find(
                    teamRole =>
                        teamRole.roleId ===
                        RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole
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
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
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
            roleId: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole,
            reportsToUsername: undefined,
        };
        return repositories.incidentManagementTeamRepository
            .deleteIncidentManagementTeamMemberRole(
                oldIncidentManagerTeamRole,
                oldIncidentManager,
                diseaseOutbreakEventBaseAttrs.id
            )
            .flatMap(() => {
                return repositories.incidentManagementTeamRepository
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
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
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
        roleId: RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole,
        reportsToUsername: undefined,
    };
    return repositories.incidentManagementTeamRepository
        .saveIncidentManagementTeamMemberRole(
            incidentManagerTeamRole,
            newIncidentManager,
            diseaseOutbreakEventBaseAttrs.id
        )
        .flatMap(() => Future.success(diseaseOutbreakEventBaseAttrs.id));
}
