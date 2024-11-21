import { FutureData } from "../../../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { getOutbreakKey } from "../../../entities/AlertsAndCaseForCasesData";
import { Configurations } from "../../../entities/AppConfigurations";
import {
    CasesDataSource,
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Role } from "../../../entities/incident-management-team/Role";
import { TeamMember, TeamRole } from "../../../entities/incident-management-team/TeamMember";
import { Id } from "../../../entities/Ref";
import { CasesFileRepository } from "../../../repositories/CasesFileRepository";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { IncidentManagementTeamRepository } from "../../../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../../../repositories/RoleRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";
import { Maybe } from "../../../../utils/ts-utils";

export function saveDiseaseOutbreak(
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
        teamMemberRepository: TeamMemberRepository;
        roleRepository: RoleRepository;
        casesFileRepository: CasesFileRepository;
    },
    diseaseOutbreakEvent: DiseaseOutbreakEvent,
    configurations: Configurations,
    editMode: boolean,
    casesDataOptions?: {
        uploadedCasesDataFile: Maybe<File>;
        uploadedCasesDataFileId: Maybe<Id>;
        hasInitiallyCasesDataFile: boolean;
    }
): FutureData<Id> {
    const { uploadedCasesDataFile, uploadedCasesDataFileId, hasInitiallyCasesDataFile } =
        casesDataOptions || {};

    const hasNewCasesData =
        (!editMode || !hasInitiallyCasesDataFile) &&
        !!uploadedCasesDataFile &&
        diseaseOutbreakEvent.casesDataSource ===
            CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;
    const haveChangedCasesData =
        editMode &&
        hasInitiallyCasesDataFile &&
        !uploadedCasesDataFileId &&
        !!uploadedCasesDataFile &&
        diseaseOutbreakEvent.casesDataSource ===
            CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    return repositories.diseaseOutbreakEventRepository
        .save(diseaseOutbreakEvent, haveChangedCasesData)
        .flatMap((diseaseOutbreakId: Id) => {
            const diseaseOutbreakEventWithId = { ...diseaseOutbreakEvent, id: diseaseOutbreakId };
            return saveIncidentManagerTeamMemberRole(
                repositories,
                diseaseOutbreakEventWithId,
                configurations
            ).flatMap(() => {
                if (hasNewCasesData || haveChangedCasesData) {
                    const outbreakKey = getOutbreakKey({
                        dataSource: diseaseOutbreakEventWithId.dataSource,
                        outbreakValue:
                            diseaseOutbreakEventWithId.suspectedDiseaseCode ||
                            diseaseOutbreakEventWithId.hazardType,
                        hazardTypes:
                            configurations.selectableOptions.eventTrackerConfigurations.hazardTypes,
                        suspectedDiseases:
                            configurations.selectableOptions.eventTrackerConfigurations
                                .suspectedDiseases,
                    });

                    if (haveChangedCasesData) {
                        // NOTICE: If the cases data file has changed, we need to replace the old one with the new one
                        return repositories.casesFileRepository.delete(outbreakKey).flatMap(() => {
                            return repositories.casesFileRepository
                                .save(diseaseOutbreakEvent.id, outbreakKey, {
                                    file: uploadedCasesDataFile,
                                })
                                .flatMap(() => Future.success(diseaseOutbreakId));
                        });
                    } else {
                        return repositories.casesFileRepository
                            .save(diseaseOutbreakEvent.id, outbreakKey, {
                                file: uploadedCasesDataFile,
                            })
                            .flatMap(() => Future.success(diseaseOutbreakId));
                    }
                } else {
                    return Future.success(diseaseOutbreakId);
                }
            });
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
