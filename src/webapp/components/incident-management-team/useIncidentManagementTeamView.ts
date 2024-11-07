import React from "react";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import _c from "../../../domain/entities/generic/Collection";
import i18n from "../../../utils/i18n";
import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { IMTeamHierarchyOption } from "../im-team-hierarchy/IMTeamHierarchyView";
import { IncidentManagementTeam } from "../../../domain/entities/incident-management-team/IncidentManagementTeam";
import { TeamMember, TeamRole } from "../../../domain/entities/incident-management-team/TeamMember";
import { TableColumn, TableRowType } from "../table/BasicTable";

type State = {
    incidentManagementTeamHierarchyItems: Maybe<IMTeamHierarchyOption[]>;
    selectedHierarchyItemIds: Id[];
    setSelectedHierarchyItemIds: Dispatch<SetStateAction<Id[]>>;
    onSearchChange: (term: string) => void;
    getIncidentManagementTeam: () => void;
    searchTerm: string;
    defaultTeamRolesExpanded: Maybe<Id[]>;
    incidentManagementTeam: IncidentManagementTeam | undefined;
    constactTableColumns: TableColumn[];
    constactTableRows: TableRowType[];
};

export function useIncidentManagementTeamView(id: Id): State {
    const { compositionRoot, configurations } = useAppContext();
    const snackbar = useSnackbar();

    const [incidentManagementTeamHierarchyItems, setIncidentManagementTeamHierarchyItems] =
        useState<IMTeamHierarchyOption[] | undefined>();
    const [incidentManagementTeam, setIncidentManagementTeam] = useState<
        IncidentManagementTeam | undefined
    >();
    const [selectedHierarchyItemIds, setSelectedHierarchyItemIds] = useState<Id[]>([]);
    const [defaultTeamRolesExpanded, setDefaultTeamRolesExpanded] = useState<Id[] | undefined>(
        undefined
    );
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [constactTableRows, setConstactTableRows] = useState<TableRowType[]>([]);

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
                setConstactTableRows(
                    mapIncidentManagementTeamToTableRows(incidentManagementTeam?.teamHierarchy)
                );
            },
            err => {
                console.debug(err);
                snackbar.error(i18n.t(`Error loading current Incident Management Team`));
            }
        );
    }, [compositionRoot.incidentManagementTeam.get, configurations, id, snackbar]);

    useEffect(() => {
        getIncidentManagementTeam();
    }, [getIncidentManagementTeam]);

    const onSearchChange = useCallback(
        (term: string) => {
            setSearchTerm(term);

            if (incidentManagementTeamHierarchyItems) {
                const filteredIncidentManagementTeamHierarchyItems = term
                    ? filterAndGetFlattenIMTeamHierarchyOptions(
                          incidentManagementTeam?.teamHierarchy,
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

    const constactTableColumns: TableColumn[] = React.useMemo(() => {
        return [
            { value: "role", label: "Role", type: "text" },
            { value: "name", label: "Name", type: "text" },
            { value: "email", label: "Email", type: "text" },
            { value: "phone", label: "Phone", type: "text" },
        ];
    }, []);

    return {
        incidentManagementTeamHierarchyItems,
        incidentManagementTeam,
        selectedHierarchyItemIds,
        defaultTeamRolesExpanded,
        searchTerm,
        constactTableColumns,
        constactTableRows,
        setSelectedHierarchyItemIds,
        onSearchChange,
        getIncidentManagementTeam,
    };
}
function createHierarchyItem(item: TeamMember, teamRole: TeamRole): IMTeamHierarchyOption {
    return {
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
    };
}

function getTeamRolesMap(
    incidentManagementTeamHierarchy: Maybe<TeamMember[]>
): Record<Id, IMTeamHierarchyOption> | undefined {
    if (incidentManagementTeamHierarchy) {
        return incidentManagementTeamHierarchy.reduce<Record<string, IMTeamHierarchyOption>>(
            (map, item) => {
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
            },
            {}
        );
    }
}

function mapIncidentManagementTeamToIncidentManagementTeamHierarchyItems(
    incidentManagementTeamHierarchy: Maybe<TeamMember[]>
): IMTeamHierarchyOption[] {
    if (incidentManagementTeamHierarchy) {
        const teamRolesMap = getTeamRolesMap(incidentManagementTeamHierarchy);
        return teamRolesMap ? buildTree(teamRolesMap) : [];
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

function filterAndGetFlattenIMTeamHierarchyOptions(
    incidentManagementTeamHierarchy: Maybe<TeamMember[]>,
    searchTerm: string
): IMTeamHierarchyOption[] {
    if (incidentManagementTeamHierarchy) {
        return incidentManagementTeamHierarchy.flatMap((teamMember): IMTeamHierarchyOption[] => {
            const hierarchyItems: IMTeamHierarchyOption[] =
                teamMember.teamRoles
                    ?.map((teamRole): IMTeamHierarchyOption | undefined => {
                        const isMatch =
                            teamRole.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            teamMember?.name.toLowerCase().includes(searchTerm.toLowerCase());

                        if (isMatch) {
                            return createHierarchyItem(teamMember, teamRole);
                        }
                    })
                    ?.filter((item): item is IMTeamHierarchyOption => !!item) || [];
            return hierarchyItems || [];
        }, {});
    } else {
        return [];
    }
}

function getDefaultTeamRolesExpanded(incidentManagementTeam: Maybe<IncidentManagementTeam>): Id[] {
    return (
        incidentManagementTeam?.teamHierarchy.flatMap(teamMember => {
            return teamMember?.teamRoles?.map(teamRole => teamRole.id) || [];
        }) || []
    );
}

function mapIncidentManagementTeamToTableRows(
    incidentManagementTeamHierarchy: Maybe<TeamMember[]>
): TableRowType[] {
    const teamRolesMap = getTeamRolesMap(incidentManagementTeamHierarchy);
    if (teamRolesMap) {
        return Object.values(teamRolesMap).map(teamRole => ({
            id: teamRole.id,
            role: teamRole.teamRole,
            name: teamRole.member?.name || "",
            email: teamRole.member?.email || "",
            phone: teamRole.member?.phone || "",
        }));
    } else {
        return [];
    }
}
