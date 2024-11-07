import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import { User } from "../../components/user-selector/UserSelector";
import { mapTeamMemberToUser } from "../form-page/mapEntityToFormState";
import { IMTeamHierarchyOption } from "../../components/im-team-hierarchy/IMTeamHierarchyView";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { INCIDENT_MANAGER_ROLE } from "../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import _c from "../../../domain/entities/generic/Collection";
import { useIncidentManagementTeamView } from "../../components/incident-management-team/useIncidentManagementTeamView";
import { TableColumn, TableRowType } from "../../components/table/BasicTable";

type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

type State = {
    globalMessage: Maybe<GlobalMessage>;
    incidentManagementTeamHierarchyItems: Maybe<IMTeamHierarchyOption[]>;
    selectedHierarchyItemIds: Id[];
    onSelectHierarchyItem: (nodeId: string, selected: boolean) => void;
    goToIncidentManagementTeamRole: () => void;
    onDeleteIncidentManagementTeamMember: () => void;
    incidentManagerUser: Maybe<User>;
    lastUpdated: string;
    openDeleteModalData: TeamMember[] | undefined;
    onOpenDeleteModalData: (selectedHierarchyItemId: Id[] | undefined) => void;
    disableDeletion: boolean;
    onSearchChange: (term: string) => void;
    searchTerm: string;
    defaultTeamRolesExpanded: Maybe<Id[]>;
    constactTableColumns: TableColumn[];
    constactTableRows: TableRowType[];
};

export function useIMTeamBuilder(diseaseOutbreakEventId: Id): State {
    const { compositionRoot } = useAppContext();
    const { goTo } = useRoutes();
    const {
        incidentManagementTeamHierarchyItems,
        incidentManagementTeam,
        selectedHierarchyItemIds,
        setSelectedHierarchyItemIds,
        onSearchChange,
        searchTerm,
        defaultTeamRolesExpanded,
        getIncidentManagementTeam,
        constactTableColumns,
        constactTableRows,
    } = useIncidentManagementTeamView(diseaseOutbreakEventId);

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [disableDeletion, setDisableDeletion] = useState(false);
    const [openDeleteModalData, setOpenDeleteModalData] = useState<TeamMember[] | undefined>(
        undefined
    );

    const goToIncidentManagementTeamRole = useCallback(() => {
        if (selectedHierarchyItemIds.length === 1 && selectedHierarchyItemIds[0]) {
            goTo(RouteName.EDIT_FORM, {
                formType: "incident-management-team-member-assignment",
                id: selectedHierarchyItemIds[0],
            });
        } else if (selectedHierarchyItemIds.length === 0) {
            goTo(RouteName.CREATE_FORM, {
                formType: "incident-management-team-member-assignment",
            });
        }
    }, [goTo, selectedHierarchyItemIds]);

    const onSelectHierarchyItem = useCallback(
        (nodeId: string, selected: boolean) => {
            const newSelection = selected
                ? [...selectedHierarchyItemIds, nodeId]
                : selectedHierarchyItemIds.filter(id => id !== nodeId);

            const incidentManagementTeamItemsSelected =
                incidentManagementTeam?.teamHierarchy.filter(teamMember =>
                    teamMember.teamRoles?.some(role => newSelection.includes(role.id))
                );

            const isIncidentManagerRoleSelected = !!incidentManagementTeamItemsSelected?.some(
                item => {
                    return item.teamRoles?.some(role => role.roleId === INCIDENT_MANAGER_ROLE);
                }
            );

            const areAllParentsAndAllChildrenSelected = checkIfParentsAndAllChildrenSelected(
                newSelection,
                incidentManagementTeam?.teamHierarchy
            );

            setSelectedHierarchyItemIds(newSelection);
            setDisableDeletion(
                isIncidentManagerRoleSelected || !areAllParentsAndAllChildrenSelected
            );
        },
        [
            incidentManagementTeam?.teamHierarchy,
            selectedHierarchyItemIds,
            setSelectedHierarchyItemIds,
        ]
    );

    const onOpenDeleteModalData = useCallback(
        (selectedHierarchyItemIds: Id[] | undefined) => {
            if (!selectedHierarchyItemIds?.length) {
                setOpenDeleteModalData(undefined);
            } else {
                const incidentManagementTeamItemsSelected =
                    incidentManagementTeam?.teamHierarchy.filter(teamMember =>
                        teamMember.teamRoles?.some(role =>
                            selectedHierarchyItemIds.includes(role.id)
                        )
                    );

                if (incidentManagementTeamItemsSelected) {
                    setOpenDeleteModalData(incidentManagementTeamItemsSelected);
                }
            }
        },
        [incidentManagementTeam?.teamHierarchy]
    );

    const onDeleteIncidentManagementTeamMember = useCallback(() => {
        if (disableDeletion || !selectedHierarchyItemIds.length) return;

        compositionRoot.diseaseOutbreakEvent.deleteIncidentManagementTeamMemberRoles
            .execute(diseaseOutbreakEventId, selectedHierarchyItemIds)
            .run(
                () => {
                    setGlobalMessage({
                        text: `${
                            selectedHierarchyItemIds.length > 1 ? "Team members" : "Team member"
                        } deleted from Incident Management Team`,
                        type: "success",
                    });
                    getIncidentManagementTeam();
                    onOpenDeleteModalData(undefined);
                    setSelectedHierarchyItemIds([]);
                },
                err => {
                    console.debug(err);
                    setGlobalMessage({
                        text: `Error deleting ${
                            selectedHierarchyItemIds.length > 1 ? "team members" : "team member"
                        } from Incident Management Team`,
                        type: "error",
                    });
                    onOpenDeleteModalData(undefined);
                    setSelectedHierarchyItemIds([]);
                }
            );
    }, [
        compositionRoot.diseaseOutbreakEvent.deleteIncidentManagementTeamMemberRoles,
        disableDeletion,
        diseaseOutbreakEventId,
        getIncidentManagementTeam,
        onOpenDeleteModalData,
        selectedHierarchyItemIds,
        setSelectedHierarchyItemIds,
    ]);

    const incidentManagerUser = useMemo(() => {
        const incidentManagerTeamMember = incidentManagementTeam?.teamHierarchy.find(member => {
            return member.teamRoles?.some(role => role.roleId === INCIDENT_MANAGER_ROLE);
        });
        if (incidentManagerTeamMember) {
            return mapTeamMemberToUser(incidentManagerTeamMember);
        }
    }, [incidentManagementTeam?.teamHierarchy]);

    const lastUpdated = incidentManagementTeam?.lastUpdated?.toString() ?? "";

    return {
        globalMessage,
        incidentManagementTeamHierarchyItems,
        selectedHierarchyItemIds,
        onSelectHierarchyItem,
        goToIncidentManagementTeamRole,
        incidentManagerUser,
        lastUpdated,
        onDeleteIncidentManagementTeamMember,
        openDeleteModalData,
        onOpenDeleteModalData,
        disableDeletion,
        searchTerm,
        onSearchChange,
        defaultTeamRolesExpanded,
        constactTableColumns,
        constactTableRows,
    };
}

function checkIfParentsAndAllChildrenSelected(
    teamRoleSelection: Id[],
    incidentManagementTeamHierarchy: Maybe<TeamMember[]>
): boolean {
    if (!incidentManagementTeamHierarchy) return true;

    const selectedItemsInTeamHierarchy = incidentManagementTeamHierarchy
        .map(teamMember => ({
            ...teamMember,
            teamRoles: teamMember.teamRoles?.filter(teamRole =>
                teamRoleSelection.includes(teamRole.id)
            ),
        }))
        .filter(teamMember => teamMember.teamRoles?.length);

    const allTeamRoleChildrenIdsByParentUsername = getAllTeamRoleChildrenIdsByParentUsername(
        incidentManagementTeamHierarchy
    );

    return selectedItemsInTeamHierarchy.every(teamMember => {
        const teamRoleChildrenIds = allTeamRoleChildrenIdsByParentUsername.get(teamMember.username);
        return (
            !teamRoleChildrenIds ||
            teamRoleChildrenIds.every(childId => {
                return teamRoleSelection.includes(childId);
            })
        );
    });
}

function getAllTeamRoleChildrenIdsByParentUsername(teamMembers: TeamMember[]): Map<string, Id[]> {
    return teamMembers.reduce((acc, teamMember) => {
        return (
            teamMember.teamRoles?.reduce((innerAcc, teamRole) => {
                const parentUsername = teamRole.reportsToUsername;
                if (parentUsername) {
                    const existingChildren = innerAcc.get(parentUsername) || [];
                    innerAcc.set(parentUsername, [...existingChildren, teamRole.id]);
                }
                return innerAcc;
            }, acc) || acc
        );
    }, new Map<string, Id[]>());
}
