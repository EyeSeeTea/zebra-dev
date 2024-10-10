import { TreeView as TreeViewMUI } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { ArrowDropDown, ArrowRight } from "@material-ui/icons";

import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { IMTeamHierarchyItem } from "./IMTeamHierarchyItem";
import { Id } from "../../../domain/entities/Ref";
import { SearchInput } from "../search-input/SearchInput";

export type IMTeamHierarchyOption = {
    id: Id;
    teamRole: string;
    teamRoleId: Id;
    member: Maybe<TeamMember>;
    parent: Maybe<string>;
    children: IMTeamHierarchyOption[];
};

type IMTeamHierarchyViewProps = {
    items: IMTeamHierarchyOption[];
    selectedItemId: Id;
    onSelectedItemChange: (nodeId: Id, selected: boolean) => void;
    diseaseOutbreakEventName: string;
    onSearchChange: (term: string) => void;
    searchTerm: string;
};

export const IMTeamHierarchyView: React.FC<IMTeamHierarchyViewProps> = React.memo(props => {
    const {
        onSelectedItemChange,
        items,
        selectedItemId,
        diseaseOutbreakEventName,
        searchTerm,
        onSearchChange,
    } = props;

    return (
        <IMTeamHierarchyViewContainer>
            <SearchInput placeholder="Search" value={searchTerm} onChange={onSearchChange} />
            <StyledIMTeamHierarchyView
                disableSelection
                defaultCollapseIcon={<ArrowDropDown />}
                defaultExpandIcon={<ArrowRight />}
            >
                {items.map(item => (
                    <IMTeamHierarchyItem
                        key={item.id}
                        nodeId={item.id}
                        teamRole={item.teamRole}
                        member={item.member}
                        selectedItemId={selectedItemId}
                        onSelectedChange={onSelectedItemChange}
                        diseaseOutbreakEventName={diseaseOutbreakEventName}
                        subChildren={item.children}
                    />
                ))}
            </StyledIMTeamHierarchyView>
        </IMTeamHierarchyViewContainer>
    );
});

const IMTeamHierarchyViewContainer = styled.div`
    border: 1px solid ${props => props.theme.palette.common.grey500};
    background-color: ${props => props.theme.palette.common.white};
    padding: 8px;
    @media (max-width: 800px) {
    }
`;

const StyledIMTeamHierarchyView = styled(TreeViewMUI)`
    .MuiTreeItem-group {
        margin-left: 8px;
        border-left: 1px solid ${props => props.theme.palette.common.grey400};
    }

    .MuiTreeItem-content {
        align-items: baseline;
    }
`;
