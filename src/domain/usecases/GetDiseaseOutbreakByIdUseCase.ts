import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Configurations } from "../entities/AppConfigurations";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { TeamMember, TeamRole } from "../entities/TeamMember";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { getIncidentManagementTeamById } from "./utils/incident-management-team/GetIncidentManagementTeamById";
import { getAll } from "./utils/risk-assessment/GetRiskAssessmentById";

export class GetDiseaseOutbreakByIdUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            orgUnitRepository: OrgUnitRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentActionRepository: IncidentActionRepository;
            roleRepository: RoleRepository;
        }
    ) {}

    public execute(id: Id, configurations: Configurations): FutureData<DiseaseOutbreakEvent> {
        return this.options.diseaseOutbreakEventRepository
            .get(id)
            .flatMap(diseaseOutbreakEventBase => {
                const {
                    mainSyndromeCode,
                    suspectedDiseaseCode,
                    notificationSourceCode,
                    incidentManagerName,
                } = diseaseOutbreakEventBase;

                const { selectableOptions, teamMembers, roles } = configurations;

                const mainSyndrome =
                    selectableOptions.eventTrackerConfigurations.mainSyndromes.find(
                        mainSyndrome => mainSyndrome.id === mainSyndromeCode
                    );
                const suspectedDisease =
                    selectableOptions.eventTrackerConfigurations.suspectedDiseases.find(
                        suspectedDisease => suspectedDisease.id === suspectedDiseaseCode
                    );
                const notificationSource =
                    selectableOptions.eventTrackerConfigurations.notificationSources.find(
                        notificationSource => notificationSource.id === notificationSourceCode
                    );

                if (!notificationSource)
                    return Future.error(new Error("Notification source not found"));

                return Future.joinObj({
                    riskAssessment: getAll(
                        id,
                        this.options.riskAssessmentRepository,
                        configurations
                    ),
                    incidentManagementTeam: getIncidentManagementTeamById(id, this.options),
                }).flatMap(({ riskAssessment, incidentManagementTeam }) => {
                    const incidentManager = incidentManagementTeam?.teamHierarchy?.find(
                        teamMember => teamMember.username === incidentManagerName
                    );

                    const teamRoles: TeamRole[] | undefined = incidentManager?.teamRoles
                        ? incidentManager.teamRoles.map((teamRole): TeamRole => {
                              const role = roles.find(role => role.id === teamRole.roleId);
                              return {
                                  id: teamRole.id,
                                  diseaseOutbreakId: id,
                                  roleId: teamRole.roleId,
                                  reportsToUsername: teamRole.reportsToUsername,
                                  name: role?.name || "",
                              };
                          })
                        : undefined;

                    const incidentManagerTeamMemberWithoutRoles =
                        teamMembers.incidentManagers?.find(teamMember => {
                            return teamMember.username === incidentManagerName;
                        });

                    const incidentManagerTeamMember: Maybe<TeamMember> =
                        incidentManagerTeamMemberWithoutRoles
                            ? new TeamMember({
                                  ...incidentManagerTeamMemberWithoutRoles,
                                  teamRoles: teamRoles,
                              })
                            : undefined;

                    const diseaseOutbreakEvent: DiseaseOutbreakEvent = new DiseaseOutbreakEvent({
                        ...diseaseOutbreakEventBase,
                        createdBy: undefined, //TO DO : FIXME populate once metadata change is done.
                        mainSyndrome: mainSyndrome,
                        suspectedDisease: suspectedDisease,
                        notificationSource: notificationSource,
                        incidentManager: incidentManagerTeamMember,
                        riskAssessment: riskAssessment,
                        incidentActionPlan: undefined, //IAP is fetched on menu click. It is not needed here.
                        incidentManagementTeam: undefined, //IMT is fetched on menu click. It is not needed here.
                    });
                    return Future.success(diseaseOutbreakEvent);
                });
            });
    }
}
