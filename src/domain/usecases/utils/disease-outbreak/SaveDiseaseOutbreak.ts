import { FutureData } from "../../../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { Configurations } from "../../../entities/AppConfigurations";
import { DiseaseOutbreakEventBaseAttrs } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    IncidentManagementTeamMember,
    IncidentManagementTeamRole,
} from "../../../entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { Future } from "../../../entities/generic/Future";
import { TeamMember, TeamRole } from "../../../entities/TeamMember";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";

export function saveDiseaseOutbreak(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
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
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    configurations: Configurations
): FutureData<Id> {
    const teamMembers = configurations.teamMembers.all;
    return repositories.diseaseOutbreakEventRepository
        .getIncidentManagementTeam(diseaseOutbreakEventBaseAttrs.id)
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
                    teamMembers
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
                    teamMembers
                );
            } else {
                return Future.success(diseaseOutbreakEventBaseAttrs.id);
            }
        });
}

function changeIncidentManager(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    },
    diseaseOutbreakEventBaseAttrs: DiseaseOutbreakEventBaseAttrs,
    oldIncidentManager: IncidentManagementTeamMember,
    oldIncidentManagerTeamRole: IncidentManagementTeamRole,
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
            .deleteIncidentManagementTeamMemberRoles(diseaseOutbreakEventBaseAttrs.id, [
                oldIncidentManagerTeamRole.id,
            ])
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
