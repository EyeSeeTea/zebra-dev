import { useCallback, useEffect, useMemo, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import { User } from "../../components/user-selector/UserSelector";
import { mapTeamMemberToUser } from "../form-page/mapEntityToFormState";
import { IMTeamHierarchyOption } from "../../components/im-team-hierarchy/IMTeamHierarchyView";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { INCIDENT_MANAGER_ROLE } from "../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import _c from "../../../domain/entities/generic/Collection";

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
};

export function useIMTeamBuilder(id: Id): State {
    const { compositionRoot, configurations } = useAppContext();
    const { goTo } = useRoutes();
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [incidentManagementTeamHierarchyItems, setIncidentManagementTeamHierarchyItems] =
        useState<IMTeamHierarchyOption[] | undefined>();
    const [incidentManagementTeam, setIncidentManagementTeam] = useState<
        IncidentManagementTeam | undefined
    >();
    const [selectedHierarchyItemIds, setSelectedHierarchyItemIds] = useState<Id[]>([]);
    const [disableDeletion, setDisableDeletion] = useState(false);
    const [defaultTeamRolesExpanded, setDefaultTeamRolesExpanded] = useState<Id[] | undefined>(
        undefined
    );
    const [openDeleteModalData, setOpenDeleteModalData] = useState<TeamMember[] | undefined>(
        undefined
    );
    const [searchTerm, setSearchTerm] = useState<string>("");

    const getIncidentManagementTeam = useCallback(() => {
        compositionRoot.incidentManagementTeam.get.execute(id, configurations).run(
            incidentManagementTeam => {
                setIncidentManagementTeam(incidentManagementTeam);
                setDefaultTeamRolesExpanded(getDefaultTeamRolesExpanded(incidentManagementTeam));
                setIncidentManagementTeamHierarchyItems(
                    mapIncidentManagementTeamToIncidentManagementTeamHierarchyItems(
                        incidentManagementTeam?.teamHierarchy
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
    }, [compositionRoot.incidentManagementTeam.get, configurations, id]);

    useEffect(() => {
        getIncidentManagementTeam();
    }, [getIncidentManagementTeam]);

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

            const selectedItemsUsernames = incidentManagementTeamItemsSelected?.map(
                ({ username }) => username
            );

            const hasSomeParentReporting = !!incidentManagementTeam?.teamHierarchy.some(
                teamMember =>
                    teamMember.teamRoles?.some(teamRole =>
                        selectedItemsUsernames?.includes(teamRole.reportsToUsername || "")
                    )
            );

            setSelectedHierarchyItemIds(newSelection);
            setDisableDeletion(isIncidentManagerRoleSelected || hasSomeParentReporting);
        },
        [incidentManagementTeam?.teamHierarchy, selectedHierarchyItemIds]
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

        compositionRoot.incidentManagementTeam.deleteIncidentManagementTeamMemberRoles
            .execute(id, selectedHierarchyItemIds)
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
        compositionRoot.incidentManagementTeam.deleteIncidentManagementTeamMemberRoles,
        disableDeletion,
        getIncidentManagementTeam,
        id,
        onOpenDeleteModalData,
        selectedHierarchyItemIds,
    ]);

    const incidentManagerUser = useMemo(() => {
        const incidentManagerTeamMember = incidentManagementTeam?.teamHierarchy.find(member => {
            return member.teamRoles?.some(role => role.roleId === INCIDENT_MANAGER_ROLE);
        });
        if (incidentManagerTeamMember) {
            return mapTeamMemberToUser(incidentManagerTeamMember);
        }
    }, [incidentManagementTeam?.teamHierarchy]);

    const onSearchChange = useCallback(
        (term: string) => {
            setSearchTerm(term);

            if (incidentManagementTeamHierarchyItems) {
                const filteredIncidentManagementTeamHierarchyItems = term
                    ? filterIncidentManagementTeamHierarchy(
                          incidentManagementTeamHierarchyItems,
                          term
                      )
                    : mapIncidentManagementTeamToIncidentManagementTeamHierarchyItems(
                          incidentManagementTeam?.teamHierarchy
                      );

                setIncidentManagementTeamHierarchyItems(
                    filteredIncidentManagementTeamHierarchyItems
                );
            }
        },
        [incidentManagementTeam?.teamHierarchy, incidentManagementTeamHierarchyItems]
    );

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
    };
}

function mapIncidentManagementTeamToIncidentManagementTeamHierarchyItems(
    incidentManagementTeamHierarchy: Maybe<TeamMember[]>
): IMTeamHierarchyOption[] {
    if (incidentManagementTeamHierarchy) {
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
            parent: teamRole.reportsToUsername,
            children: [],
        });

        const teamMap = incidentManagementTeamHierarchy.reduce<
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

        return buildTree(teamMap);
    } else {
        return [];
    }
}

function buildTree(teamMap: Record<string, IMTeamHierarchyOption>): IMTeamHierarchyOption[] {
    const findChildren = (parentUsername: string): IMTeamHierarchyOption[] =>
        Object.values(teamMap)
            .filter(item => item.parent === parentUsername)
            .reduce<IMTeamHierarchyOption[]>((acc, item) => {
                const children = findChildren(item.member?.username || "");
                return [...acc, { ...item, children: [...item.children, ...children] }];
            }, []);

    return Object.values(teamMap).reduce<IMTeamHierarchyOption[]>((acc, item) => {
        const isRoot = !item.parent;
        if (isRoot) {
            const children = findChildren(item.member?.username || "");
            return [...acc, { ...item, children: [...item.children, ...children] }];
        }

        return acc;
    }, []);
}

function filterIncidentManagementTeamHierarchy(
    items: IMTeamHierarchyOption[],
    searchTerm: string
): IMTeamHierarchyOption[] {
    return _c(
        items.map(item => {
            const filteredChildren = filterIncidentManagementTeamHierarchy(
                item.children,
                searchTerm
            );

            const isMatch =
                item.teamRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.member?.name.toLowerCase().includes(searchTerm.toLowerCase());

            if (isMatch || filteredChildren.length > 0) {
                return {
                    ...item,
                    children: filteredChildren,
                };
            }

            return null;
        })
    )
        .compact()
        .toArray();
}

function getDefaultTeamRolesExpanded(incidentManagementTeam: Maybe<IncidentManagementTeam>): Id[] {
    return (
        incidentManagementTeam?.teamHierarchy.flatMap(teamMember => {
            return teamMember?.teamRoles?.map(teamRole => teamRole.id) || [];
        }) || []
    );
}
