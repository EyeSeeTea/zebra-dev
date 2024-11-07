import { TreeView as TreeViewMUI } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { ArrowDropDown, ArrowRight } from "@material-ui/icons";

import { Maybe } from "../../../utils/ts-utils";
import { TeamMember } from "../../../domain/entities/TeamMember";
import { IMTeamHierarchyItem } from "./IMTeamHierarchyItem";
import { Id } from "../../../domain/entities/Ref";
import { SearchInput } from "../search-input/SearchInput";
import i18n from "../../../utils/i18n";

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
    selectedItemIds?: Id[];
    onSelectedItemChange?: (nodeId: Id, selected: boolean) => void;
    diseaseOutbreakEventName: string;
    onSearchChange: (term: string) => void;
    searchTerm: string;
    defaultTeamRolesExpanded: Id[];
    isSelectable?: boolean;
};

export const IMTeamHierarchyView: React.FC<IMTeamHierarchyViewProps> = React.memo(props => {
    const {
        onSelectedItemChange,
        items,
        selectedItemIds,
        diseaseOutbreakEventName,
        searchTerm,
        onSearchChange,
        defaultTeamRolesExpanded,
        isSelectable = false,
    } = props;

    return (
        <IMTeamHierarchyViewContainer>
            <ContentWrapper>
                <SearchInput value={searchTerm} onChange={onSearchChange} />
                {isSelectable && searchTerm && selectedItemIds && selectedItemIds?.length > 0 ? (
                    <CountSelectionText>
                        {i18n.t(
                            `{{count}} selected ${selectedItemIds.length > 1 ? "items" : "item"}`,
                            {
                                count: selectedItemIds.length,
                            }
                        )}
                    </CountSelectionText>
                ) : null}
                <StyledIMTeamHierarchyView
                    disableSelection
                    defaultCollapseIcon={<ArrowDropDown />}
                    defaultExpandIcon={<ArrowRight />}
                    defaultExpanded={defaultTeamRolesExpanded}
                >
                    {items.map(item => (
                        <IMTeamHierarchyItem
                            key={item.id}
                            nodeId={item.id}
                            teamRole={item.teamRole}
                            member={item.member}
                            selectedItemIds={selectedItemIds}
                            onSelectedChange={onSelectedItemChange}
                            diseaseOutbreakEventName={diseaseOutbreakEventName}
                            subChildren={item.children}
                            isSelectable={isSelectable}
                        />
                    ))}
                </StyledIMTeamHierarchyView>
            </ContentWrapper>
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

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* gap: 8px; */
`;

const CountSelectionText = styled.span`
    margin-block-start: 10px;
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;
