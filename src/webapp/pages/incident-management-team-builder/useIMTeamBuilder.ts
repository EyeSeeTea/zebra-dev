import { useCallback, useEffect, useMemo, useState } from "react";

import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import { getDateAsLocaleDateTimeString } from "../../../data/repositories/utils/DateTimeHelper";
import { User } from "../../components/user-selector/UserSelector";
import { mapTeamMemberToUser } from "../form-page/mapEntityToFormState";
import { IMTeamHierarchyOption } from "../../components/im-team-hierarchy/IMTeamHierarchyView";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS } from "../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";

type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

export type ProfileModalData = {
    teamMember: TeamMember;
    teamRole: TeamRole;
};

type State = {
    globalMessage: Maybe<GlobalMessage>;
    incidentManagementTeamHierarchyItems: Maybe<IMTeamHierarchyOption[]>;
    selectedHierarchyItemId: string;
    onSelectHierarchyItem: (nodeId: string, selected: boolean) => void;
    goToIncidentManagementTeamRole: () => void;
    onDeleteIncidentManagementTeamMember: () => void;
    incidentManagerUser: Maybe<User>;
    lastUpdated: string;
    openDeleteModalData: ProfileModalData | undefined;
    onOpenDeleteModalData: (selectedHierarchyItemId: Id | undefined) => void;
    disableDeletion: boolean;
};

export function useIMTeamBuilder(id: Id): State {
    const { compositionRoot } = useAppContext();
    const { goTo } = useRoutes();

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [incidentManagementTeamHierarchyItems, setIncidentManagementTeamHierarchyItems] =
        useState<IMTeamHierarchyOption[] | undefined>();
    const [incidentManagementTeam, setIncidentManagementTeam] = useState<
        IncidentManagementTeam | undefined
    >();
    const [selectedHierarchyItemId, setSelectedHierarchyItemId] = useState<string>("");
    const [disableDeletion, setDisableDeletion] = useState(false);
    const [openDeleteModalData, setOpenDeleteModalData] = useState<ProfileModalData | undefined>(
        undefined
    );

    const getIncidentManagementTeam = useCallback(() => {
        compositionRoot.incidentManagementTeam.get.execute(id).run(
            incidentManagementTeam => {
                setIncidentManagementTeam(incidentManagementTeam);
                setIncidentManagementTeamHierarchyItems(
                    mapIncidentManagementTeamToIncidentManagementTeamHierarchyItems(
                        incidentManagementTeam
                    )
                );
            },
            err => {
                console.debug(err);
                setGlobalMessage({
                    text: `Error loading current Incident Management Team`,
                    type: "error",
                });
            }
        );
    }, [compositionRoot.incidentManagementTeam.get, id]);

    useEffect(() => {
        getIncidentManagementTeam();
    }, [getIncidentManagementTeam]);

    const goToIncidentManagementTeamRole = useCallback(() => {
        if (selectedHierarchyItemId) {
            goTo(RouteName.EDIT_FORM, {
                formType: "incident-management-team-member-assignment",
                id: selectedHierarchyItemId,
            });
        } else {
            goTo(RouteName.CREATE_FORM, {
                formType: "incident-management-team-member-assignment",
            });
        }
    }, [goTo, selectedHierarchyItemId]);

    const onSelectHierarchyItem = useCallback(
        (nodeId: string, selected: boolean) => {
            const selection = selected ? nodeId : "";
            const incidentManagementTeamItemSelected = selection
                ? incidentManagementTeam?.teamHierarchy.find(teamMember =>
                      teamMember.teamRoles?.some(role => role.id === selection)
                  )
                : undefined;

            const selectedRole = incidentManagementTeamItemSelected?.teamRoles?.find(
                role => role.id === selection
            );

            const isIncidentManagerRoleSelected =
                selectedRole?.roleId ===
                RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole;

            setSelectedHierarchyItemId(selection);
            setDisableDeletion(isIncidentManagerRoleSelected);
        },
        [incidentManagementTeam?.teamHierarchy]
    );

    const onOpenDeleteModalData = useCallback(
        (selectedHierarchyItemId: Id | undefined) => {
            if (!selectedHierarchyItemId) {
                setOpenDeleteModalData(undefined);
            } else {
                const incidentManagementTeamItem = incidentManagementTeam?.teamHierarchy.find(
                    teamMember =>
                        teamMember.teamRoles?.some(role => role.id === selectedHierarchyItemId)
                );

                const selectedRole = incidentManagementTeamItem?.teamRoles?.find(
                    role => role.id === selectedHierarchyItemId
                );

                if (incidentManagementTeamItem && selectedRole) {
                    setOpenDeleteModalData({
                        teamRole: selectedRole,
                        teamMember: incidentManagementTeamItem,
                    });
                }
            }
        },
        [incidentManagementTeam?.teamHierarchy]
    );

    const onDeleteIncidentManagementTeamMember = useCallback(() => {
        if (disableDeletion) return;

        const teamMember = incidentManagementTeam?.teamHierarchy.find(teamMember =>
            teamMember.teamRoles?.some(role => role.id === selectedHierarchyItemId)
        );

        const teamRoleToDelete = teamMember?.teamRoles?.find(
            role => role.id === selectedHierarchyItemId
        );

        if (teamMember && teamRoleToDelete) {
            compositionRoot.incidentManagementTeam.deleteIncidentManagementTeamMemberRole
                .execute(teamRoleToDelete, teamMember, id)
                .run(
                    () => {
                        setGlobalMessage({
                            text: `${teamMember.name} deleted from Incident Management Team`,
                            type: "success",
                        });
                        getIncidentManagementTeam();
                        onOpenDeleteModalData(undefined);
                    },
                    err => {
                        console.debug(err);
                        setGlobalMessage({
                            text: `Error deleting ${teamMember.name} from Incident Management Team`,
                            type: "error",
                        });
                        onOpenDeleteModalData(undefined);
                    }
                );
        } else {
            setGlobalMessage({
                text: `Error deleting team member from Incident Management Team`,
                type: "error",
            });
        }
    }, [
        compositionRoot.incidentManagementTeam.deleteIncidentManagementTeamMemberRole,
        disableDeletion,
        getIncidentManagementTeam,
        id,
        incidentManagementTeam?.teamHierarchy,
        onOpenDeleteModalData,
        selectedHierarchyItemId,
    ]);

    const incidentManagerUser = useMemo(() => {
        const incidentManagerTeamMember = incidentManagementTeam?.teamHierarchy.find(member => {
            return member.teamRoles?.some(
                role =>
                    role.roleId ===
                    RTSL_ZEBRA_INCIDENT_MANAGEMENT_TEAM_BUILDER_ROLE_IDS.incidentManagerRole
            );
        });
        if (incidentManagerTeamMember) {
            return mapTeamMemberToUser(incidentManagerTeamMember);
        }
    }, [incidentManagementTeam?.teamHierarchy]);

    const lastUpdated = getDateAsLocaleDateTimeString(new Date()); //TO DO : Fetch sync time from datastore once implemented

    return {
        globalMessage,
        incidentManagementTeamHierarchyItems,
        selectedHierarchyItemId,
        onSelectHierarchyItem,
        goToIncidentManagementTeamRole,
        incidentManagerUser,
        lastUpdated,
        onDeleteIncidentManagementTeamMember,
        openDeleteModalData,
        onOpenDeleteModalData,
        disableDeletion,
    };
}

function mapIncidentManagementTeamToIncidentManagementTeamHierarchyItems(
    incidentManagementTeam: Maybe<IncidentManagementTeam>
): IMTeamHierarchyOption[] {
    if (incidentManagementTeam?.teamHierarchy) {
        const createHierarchyItem = (
            item: TeamMember,
            teamRole: TeamRole
        ): IMTeamHierarchyOption => ({
            id: teamRole.id,
            teamRole: teamRole.name,
            teamRoleId: teamRole.roleId,
            member: new TeamMember({
                id: item.id,
                name: item.name,
                username: item.username,
                phone: item.phone,
                email: item.email,
                status: item.status,
                photo: item.photo,
                teamRoles: item.teamRoles,
                workPosition: item.workPosition,
            }),
            parents: [],
            children: [],
        });

        const teamMap = incidentManagementTeam?.teamHierarchy.reduce<
            Record<string, IMTeamHierarchyOption>
        >((map, item) => {
            const hierarchyItems = item.teamRoles?.map(teamRole =>
                createHierarchyItem(item, teamRole)
            );

            return !hierarchyItems || hierarchyItems?.length === 0
                ? map
                : hierarchyItems.reduce(
                      (acc, hierarchyItem) => ({
                          ...acc,
                          [hierarchyItem.id]: hierarchyItem,
                      }),
                      map
                  );
        }, {});

        return incidentManagementTeam.teamHierarchy.reduce<IMTeamHierarchyOption[]>((acc, item) => {
            return item.teamRoles
                ? item.teamRoles.reduce((innerAcc, teamRole) => {
                      const hierarchyItem = teamMap[teamRole.id];
                      if (!hierarchyItem) return innerAcc;

                      const reportsToUsername = teamRole.reportsToUsername;
                      if (reportsToUsername) {
                          const parentItem = Object.values(teamMap).find(
                              teamItem => teamItem.member?.username === reportsToUsername
                          );

                          if (parentItem) {
                              parentItem.children = [...(parentItem.children || []), hierarchyItem];
                              hierarchyItem.parents = [
                                  ...hierarchyItem.parents,
                                  { id: parentItem.id, name: parentItem.teamRole },
                              ];
                          }
                      }

                      return hierarchyItem.parents.length === 0
                          ? [...innerAcc, hierarchyItem]
                          : innerAcc;
                  }, acc)
                : acc;
        }, []);
    } else {
        return [];
    }
}
